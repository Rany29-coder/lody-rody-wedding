"use client";
import { useState } from "react";
import { weddingRequest } from "../lib/wedding-api";
import "./couple.css";
type Wish = { id: string; name: string; message: string; created_at: string };
export default function CoupleInbox() {
  const [token, setToken] = useState(""),
    [messages, setMessages] = useState<Wish[]>([]),
    [next, setNext] = useState<string | null>(null),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  async function load(auth: string, before?: string) {
    const data = await weddingRequest<{
      messages: Wish[];
      next: string | null;
    }>(
      `/admin/messages${before ? `?before=${encodeURIComponent(before)}` : ""}`,
      { headers: { Authorization: `Bearer ${auth}` } },
    );
    setMessages((old) => (before ? [...old, ...data.messages] : data.messages));
    setNext(data.next);
  }
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(
      new FormData(event.currentTarget).get("password") || "",
    );
    setBusy(true);
    setStatus("");
    try {
      const data = await weddingRequest<{ token: string }>("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      await load(data.token);
      setToken(data.token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  async function refresh(before?: string) {
    setBusy(true);
    setStatus("");
    try {
      await load(token, before);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to load messages.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await weddingRequest("/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      setStatus(
        "Signed out on this device. The session expires automatically within 24 hours.",
      );
    } finally {
      setToken("");
      setMessages([]);
      setNext(null);
    }
  }
  return (
    <main className="couple-inbox">
      <p className="inbox-eyebrow">Just for the two of you</p>
      <h1>Rody + Lody</h1>
      <h2>Your private messages</h2>
      {!token ? (
        <form onSubmit={login}>
          <p>Sign in to read the wishes your guests have sent.</p>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      ) : (
        <>
          <div className="inbox-actions">
            <button disabled={busy} onClick={() => refresh()}>
              Refresh
            </button>
            <button onClick={logout}>Sign out</button>
          </div>
          {!messages.length && (
            <p>No messages yet. Your guests’ wishes will appear here.</p>
          )}
          <div className="private-wishes">
            {messages.map((wish) => (
              <article key={wish.id}>
                <h3 dir="auto">{wish.name}</h3>
                <p dir="auto">{wish.message}</p>
                <time dateTime={wish.created_at}>
                  {new Date(wish.created_at).toLocaleString()}
                </time>
              </article>
            ))}
          </div>
          {next && (
            <button disabled={busy} onClick={() => refresh(next)}>
              Earlier messages
            </button>
          )}
        </>
      )}
      <p role="status">{status}</p>
    </main>
  );
}
