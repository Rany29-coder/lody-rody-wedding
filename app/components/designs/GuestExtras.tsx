"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
type Wish = { id: string; name: string; message: string };
type Photo = { id: string; url: string; name: string };
export default function GuestExtras({
  refined = false,
}: {
  refined?: boolean;
}) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [status, setStatus] = useState("");
  const [photoStatus, setPhotoStatus] = useState("");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const urls = useRef(new Set<string>());
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const liveUrls = urls.current;
    return () => liveUrls.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !message) {
      setStatus("Please add your name and a message.");
      return;
    }
    setWishes((w) => [{ id: crypto.randomUUID(), name, message }, ...w]);
    setStatus("Your preview message is below. It has not been sent.");
    form.reset();
  }
  function files(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const slots = Math.max(0, 12 - photos.length);
    const valid = selected
      .filter(
        (f) =>
          /^image\/(jpeg|png|webp|gif)$/.test(f.type) &&
          f.size <= 10 * 1024 * 1024,
      )
      .slice(0, slots);
    const next = valid.map((f) => {
      const url = URL.createObjectURL(f);
      urls.current.add(url);
      return { id: crypto.randomUUID(), url, name: f.name };
    });
    setPhotos((p) => [...p, ...next]);
    setPhotoStatus(
      valid.length === selected.length
        ? `${valid.length} photo previews added. Nothing has been uploaded.`
        : "Use JPG, PNG, WebP or GIF under 10 MB. Maximum 12 photos. Valid photos were added.",
    );
    e.target.value = "";
  }
  function remove(id: string) {
    const p = photos.find((p) => p.id === id);
    if (p) {
      URL.revokeObjectURL(p.url);
      urls.current.delete(p.url);
    }
    setPhotos((p) => p.filter((x) => x.id !== id));
  }
  return (
    <>
      <section id="your-wishes" className="wishes-section">
        <p className="eyebrow">Little words. Lasting memories.</p>
        <h2>Leave a little love.</h2>
        <p className="section-intro">
          A blessing, a memory,{refined ? <br /> : " "}a wish for the years
          ahead.
        </p>
        {!refined && (
          <p className="demo-note">
            Design preview · messages stay on this page only and are not sent to
            the couple.
          </p>
        )}
        <form onSubmit={submit}>
          <label>
            Your name
            <input
              name="name"
              required
              maxLength={80}
              autoComplete="name"
              placeholder="With love, from…"
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
            />
          </label>
          <button className="primary-action" type="submit">
            Preview your wish <span>↗</span>
          </button>
          {refined && (
            <small className="wish-preview-label">
              Preview only · not sent to the couple.
            </small>
          )}
          <p role="status">{status}</p>
        </form>
        <div className="wishes-list">
          {wishes.length === 0 ? (
            <p className="empty-wish">Your words will look lovely here.</p>
          ) : (
            wishes.map((w) => (
              <blockquote key={w.id}>
                <p dir="auto">“{w.message}”</p>
                <cite dir="auto">— {w.name}</cite>
              </blockquote>
            ))
          )}
        </div>
      </section>
      <section id="memories" className="memories-section">
        <p className="eyebrow">Through your eyes</p>
        <h2>Keep the little moments.</h2>
        <p className="section-intro">
          The happy tears. The hands held. The in-between.
        </p>
        <label className="photo-drop">
          <span className="photo-icon">＋</span>
          <strong>Add your photographs</strong>
          <span>JPG, PNG, WebP or GIF · up to 10 MB each</span>
          <input
            aria-label="Add photo previews"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={files}
          />
        </label>
        <p className="demo-note">
          Local previews only · photos are not uploaded and disappear on
          refresh.
        </p>
        <p role="status">{photoStatus}</p>
        <div className="photo-grid">
          {photos.map((p) => (
            <div key={p.id}>
              <button
                onClick={() => {
                  setActivePhoto(p);
                  dialog.current?.showModal();
                }}
                aria-label={`View ${p.name}`}
              >
                <Image
                  src={p.url}
                  width={300}
                  height={300}
                  alt={p.name}
                  unoptimized
                />
              </button>
              <button
                className="remove-photo"
                aria-label={`Remove ${p.name}`}
                onClick={() => remove(p.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <dialog
          ref={dialog}
          className="photo-dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
        >
          <button
            onClick={() => dialog.current?.close()}
            aria-label="Close photo"
          >
            Close ×
          </button>
          {activePhoto && (
            <Image
              src={activePhoto.url}
              width={1200}
              height={1200}
              unoptimized
              alt={activePhoto.name}
            />
          )}
        </dialog>
      </section>
    </>
  );
}
