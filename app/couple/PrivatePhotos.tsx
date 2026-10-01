"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  WEDDING_API,
  weddingRequest,
  type GalleryPhoto,
  type GalleryResponse,
} from "../lib/wedding-api";

function PrivatePhoto({
  photo,
  token,
}: {
  photo: GalleryPhoto;
  token: string;
}) {
  const [src, setSrc] = useState("");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const abort = new AbortController();
    let objectUrl = "";
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fetch(`${WEDDING_API}/admin/photo/${photo.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: abort.signal,
        })
          .then(async (response) => {
            if (!response.ok)
              throw new Error(
                "Unable to load this photo. Try again or sign in again.",
              );
            return response.blob();
          })
          .then((blob) => {
            if (abort.signal.aborted) return;
            objectUrl = URL.createObjectURL(blob);
            setSrc(objectUrl);
            setError("");
          })
          .catch((error) => {
            if (!abort.signal.aborted) setError(error.message);
          });
      },
      { rootMargin: "200px" },
    );
    if (container.current) observer.observe(container.current);
    return () => {
      observer.disconnect();
      abort.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photo.id, token, attempt]);
  return (
    <div ref={container} className="private-photo">
      {src ? (
        <>
          <button
            className="private-photo-open"
            aria-label="View private photograph"
            onClick={() => dialog.current?.showModal()}
          >
            <Image
              src={src}
              alt="A private wedding memory"
              width={400}
              height={400}
              unoptimized
            />
          </button>
          <a href={src} download={`wedding-${photo.id}.jpg`}>
            Download ↓
          </a>
          <dialog
            ref={dialog}
            onClick={(event) => {
              if (event.target === event.currentTarget) dialog.current?.close();
            }}
          >
            <button onClick={() => dialog.current?.close()}>Close ×</button>
            <Image
              src={src}
              alt="A private wedding memory"
              width={1600}
              height={1600}
              unoptimized
            />
          </dialog>
        </>
      ) : error ? (
        <p role="alert">
          {error}{" "}
          <button onClick={() => setAttempt((n) => n + 1)}>Try again</button>
        </p>
      ) : (
        <p>Loading photo…</p>
      )}
    </div>
  );
}
export default function PrivatePhotos({ token }: { token: string }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    const abort = new AbortController();
    weddingRequest<GalleryResponse>("/admin/photos", {
      headers: { Authorization: `Bearer ${token}` },
      signal: abort.signal,
    })
      .then((data) => {
        setPhotos(data.photos);
        setNext(data.next);
      })
      .catch((error) => {
        if (!abort.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!abort.signal.aborted) setBusy(false);
      });
    return () => abort.abort();
  }, [token]);
  async function load(before?: string) {
    setBusy(true);
    setError("");
    try {
      const data = await weddingRequest<GalleryResponse>(
        `/admin/photos${before ? `?before=${encodeURIComponent(before)}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPhotos((old) =>
        before
          ? [
              ...old,
              ...data.photos.filter((p) => !old.some((o) => o.id === p.id)),
            ]
          : data.photos,
      );
      setNext(data.next);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load photos.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="private-photos">
      <h2>Your private photos</h2>
      <button disabled={busy} onClick={() => load()}>
        Refresh photos
      </button>
      {error && <p role="alert">{error}</p>}
      {busy && <p role="status">Loading photographs…</p>}
      {!busy && !error && !photos.length && (
        <p>No photos yet. Photographs your guests send will appear here.</p>
      )}
      <div className="private-photo-grid">
        {photos.map((photo) => (
          <PrivatePhoto key={photo.id} photo={photo} token={token} />
        ))}
      </div>
      {next && (
        <button disabled={busy} onClick={() => load(next)}>
          More photographs
        </button>
      )}
    </section>
  );
}
