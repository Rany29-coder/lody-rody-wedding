"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { weddingRequest } from "../../lib/wedding-api";
type Pending = { id: string; name: string; blob: Blob; url: string };
async function preparePhoto(file: File): Promise<Blob> {
  if (
    !/^image\/(jpeg|png|webp)$/.test(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("Choose JPG, PNG or WebP photographs under 10 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare this photo.");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.5]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (blob && blob.size <= 1048576) return blob;
    }
    throw new Error(
      "This photograph is too large. Please choose a smaller version.",
    );
  } finally {
    bitmap.close();
  }
}
export default function WeddingGuests() {
  const [sendingWish, setSendingWish] = useState(false),
    [wishStatus, setWishStatus] = useState("");
  const [pending, setPending] = useState<Pending[]>([]),
    [preparing, setPreparing] = useState(false),
    [sendingPhotos, setSendingPhotos] = useState(false),
    [photoStatus, setPhotoStatus] = useState("");
  const urls = useRef(new Set<string>()),
    wishAttempt = useRef({ text: "", id: "" });
  useEffect(() => {
    const live = urls.current;
    return () => {
      live.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  async function sendWish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingWish) return;
    const form = event.currentTarget,
      data = new FormData(form),
      name = String(data.get("name") || "").trim(),
      message = String(data.get("message") || "").trim();
    if (!name || !message) {
      setWishStatus("Please add your name and message.");
      return;
    }
    const text = JSON.stringify({ name, message });
    if (wishAttempt.current.text !== text)
      wishAttempt.current = { text, id: crypto.randomUUID() };
    setSendingWish(true);
    setWishStatus("");
    try {
      await weddingRequest("/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, id: wishAttempt.current.id }),
      });
      form.reset();
      wishAttempt.current = { text: "", id: "" };
      setWishStatus("Sent with love. Only Rody & Lody can read your message.");
    } catch (error) {
      setWishStatus(
        error instanceof Error
          ? error.message
          : "Your message was not sent. Please try again.",
      );
    } finally {
      setSendingWish(false);
    }
  }
  async function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    setPreparing(true);
    setPhotoStatus("");
    try {
      if (files.length + pending.length > 6)
        throw new Error("Choose up to six photos at a time.");
      for (const file of files) {
        const blob = await preparePhoto(file),
          url = URL.createObjectURL(blob);
        urls.current.add(url);
        setPending((old) => [
          ...old,
          { id: crypto.randomUUID(), name: file.name, blob, url },
        ]);
      }
    } catch (error) {
      setPhotoStatus(
        error instanceof Error ? error.message : "Unable to prepare photos.",
      );
    } finally {
      setPreparing(false);
    }
  }
  function remove(id: string) {
    setPending((old) => {
      const photo = old.find((p) => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.url);
        urls.current.delete(photo.url);
      }
      return old.filter((p) => p.id !== id);
    });
  }
  async function sendPhotos() {
    if (!pending.length || sendingPhotos) return;
    setSendingPhotos(true);
    setPhotoStatus("");
    let sent = 0;
    try {
      for (const photo of pending) {
        const data = new FormData();
        data.append("id", photo.id);
        data.append("photo", photo.blob, "wedding.jpg");
        await weddingRequest("/photos", {
          method: "POST",
          body: data,
        });
        remove(photo.id);
        sent++;
      }
      setPhotoStatus(
        `${sent === 1 ? "Your photo is" : "Your photos are"} sent privately to Rody & Lody. Thank you!`,
      );
    } catch (error) {
      setPhotoStatus(
        `${sent ? `${sent} sent. ` : ""}${error instanceof Error ? error.message : "Please try again."} Unsent photos are still selected.`,
      );
    } finally {
      setSendingPhotos(false);
    }
  }
  return (
    <>
      <section id="your-wishes" className="wishes-section">
        <p className="eyebrow">Little words. Lasting memories.</p>
        <h2>Leave a little love.</h2>
        <p className="section-intro">
          A blessing, a memory,
          <br />a wish for the years ahead.
        </p>
        <form onSubmit={sendWish}>
          <label>
            Your name
            <input
              name="name"
              required
              maxLength={80}
              autoComplete="name"
              placeholder="With love, from…"
              disabled={sendingWish}
            />
          </label>
          <label>
            Your wish
            <textarea
              name="message"
              required
              maxLength={1200}
              rows={3}
              placeholder="May your life together…"
              disabled={sendingWish}
            />
          </label>
          <button
            className="primary-action"
            type="submit"
            disabled={sendingWish}
          >
            {sendingWish ? "Sending…" : "Send"}
          </button>
          <p role="status">{wishStatus}</p>
        </form>
      </section>
      <section id="memories" className="memories-section">
        <p className="eyebrow">Through your eyes</p>
        <h2>Keep the little moments.</h2>
        <p className="section-intro">
          The happy tears. The hands held.
          <br />
          The in-between.
        </p>
        <label className="photo-drop">
          <span className="photo-icon">＋</span>
          <strong>Add your photographs</strong>
          <span>JPG, PNG or WebP · up to 10 MB each</span>
          <input
            aria-label="Choose photographs"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={preparing || sendingPhotos}
            onChange={choose}
          />
        </label>
        <p className="photo-public-note">
          Only Rody & Lody can view the photos you send.
        </p>
        {preparing && <p role="status">Preparing your photographs…</p>}
        <div className="photo-grid pending-photos">
          {pending.map((photo) => (
            <div key={photo.id}>
              <Image
                src={photo.url}
                width={300}
                height={300}
                alt={photo.name}
                unoptimized
              />
              <button
                disabled={sendingPhotos}
                className="remove-photo"
                aria-label={`Remove ${photo.name}`}
                onClick={() => remove(photo.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          className="primary-action photo-send"
          disabled={!pending.length || preparing || sendingPhotos}
          onClick={sendPhotos}
        >
          {sendingPhotos ? "Sending…" : "Send"}
        </button>
        <p role="status">{photoStatus}</p>
      </section>
    </>
  );
}
