"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal, Section, SectionHeading, goldButtonClass } from "./ui";

type Photo = { id: number; url: string };

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // TODO(backend): upload to storage. For now, preview locally via object URLs.
    const next = files.map((f, i) => ({
      id: Date.now() + i,
      url: URL.createObjectURL(f),
    }));
    setPhotos((prev) => [...next, ...prev]);
    e.target.value = "";
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section>
      <Reveal>
        <SectionHeading eyebrow="Share the Moments" title="Photo Gallery" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="text-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={goldButtonClass}
          >
            Upload Photos
          </button>
          <p className="mt-3 font-serif text-xs italic text-foreground/45">
            Help us capture the day from every angle
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        {photos.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-gold/25 bg-black/20 p-10 text-center">
            <p className="text-3xl">📸</p>
            <p className="mt-3 font-serif text-base text-foreground/55">
              Be the first to share a photo.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AnimatePresence initial={false}>
              {photos.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square overflow-hidden rounded-xl border border-gold/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt="Shared wedding moment"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
