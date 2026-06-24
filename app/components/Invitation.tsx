"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { wedding } from "../wedding-config";
import Countdown from "./Countdown";
import Monogram from "./Monogram";

export default function Invitation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-5 py-12">
      <AnimatePresence mode="wait">
        {!open ? (
          <Envelope key="envelope" onOpen={() => setOpen(true)} />
        ) : (
          <Card key="card" />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── Sealed envelope ───────────────────────── */

function Envelope({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Tap to open the invitation"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.4 } }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group flex flex-col items-center outline-none"
    >
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-44 w-72 sm:h-52 sm:w-96"
      >
        {/* Envelope body */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[#fefcf8] to-blush-soft shadow-[0_25px_60px_-20px_rgba(120,90,60,0.45)] ring-1 ring-gold-soft/40" />

        {/* Inner pocket triangles (sides + bottom) */}
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background:
              "linear-gradient(45deg, rgba(216,189,133,0.18) 0 50%, transparent 50%), linear-gradient(-45deg, rgba(216,189,133,0.18) 0 50%, transparent 50%)",
            backgroundSize: "50.5% 100%",
            backgroundPosition: "left, right",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Top flap */}
        <div
          className="absolute left-0 right-0 top-0 h-1/2 origin-top"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "linear-gradient(to bottom, #fdf8f1, #f0ddd6)",
            filter: "drop-shadow(0 6px 6px rgba(120,90,60,0.18))",
          }}
        />

        {/* Wax seal */}
        <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-background shadow-lg ring-2 ring-[#fffdfb]/60">
          <span className="font-script text-2xl leading-none">R&amp;L</span>
        </div>
      </motion.div>

      <span className="animate-breathe mt-9 font-sans text-xs uppercase tracking-[0.4em] text-gold">
        Tap to open
      </span>
    </motion.button>
  );
}

/* ───────────────────────── Revealed card ───────────────────────── */

function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#fffdf9]/85 px-7 py-12 text-center shadow-[0_30px_80px_-30px_rgba(120,90,60,0.5)] ring-1 ring-gold-soft/40 backdrop-blur-sm sm:px-12">
        {/* Corner flourishes */}
        <Flourish className="left-4 top-4" />
        <Flourish className="right-4 top-4 -scale-x-100" />
        <Flourish className="bottom-4 left-4 -scale-y-100" />
        <Flourish className="bottom-4 right-4 -scale-100" />

        <Stagger delay={0.1}>
          <Monogram className="mb-7" />
        </Stagger>

        <Stagger delay={0.15}>
          <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-gold">
            The Wedding Of
          </p>
        </Stagger>

        <Stagger delay={0.3}>
          <h1 className="mt-6 font-script text-6xl leading-none text-ink sm:text-7xl">
            {wedding.groom}
          </h1>
        </Stagger>

        <Stagger delay={0.42}>
          <div className="my-3 flex items-center justify-center gap-4">
            <span className="gold-rule w-16" />
            <span className="font-script text-3xl text-gold">&amp;</span>
            <span className="gold-rule w-16" />
          </div>
        </Stagger>

        <Stagger delay={0.54}>
          <h1 className="font-script text-6xl leading-none text-ink sm:text-7xl">
            {wedding.bride}
          </h1>
        </Stagger>

        <Stagger delay={0.7}>
          <p className="mx-auto mt-8 max-w-sm font-serif text-base italic leading-relaxed text-foreground/80">
            {wedding.invitationLine}
          </p>
        </Stagger>

        <Stagger delay={0.82}>
          <div className="mt-8 space-y-1">
            <p className="font-serif text-xl text-ink">{wedding.dateLabel}</p>
            <p className="font-sans text-sm tracking-wide text-foreground/70">
              {wedding.timeLabel}
            </p>
            <p className="mt-3 font-serif text-lg text-ink">
              {wedding.venueName}
            </p>
            <p className="font-sans text-sm tracking-wide text-foreground/70">
              {wedding.venueAddress}
            </p>
          </div>
        </Stagger>

        {wedding.date && (
          <Stagger delay={0.94}>
            <div className="mt-10">
              <Countdown date={wedding.date} />
            </div>
          </Stagger>
        )}

        <Stagger delay={1.05}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {wedding.rsvpUrl ? (
              <a
                href={wedding.rsvpUrl}
                className="rounded-full bg-gradient-to-br from-gold-soft to-gold px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-[#fffdf9] shadow-md transition hover:brightness-105 active:scale-95"
              >
                RSVP
              </a>
            ) : (
              <span className="rounded-full border border-gold-soft/60 px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-gold">
                RSVP — coming soon
              </span>
            )}
            {wedding.mapsUrl && (
              <a
                href={wedding.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gold-soft/60 px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-gold transition hover:bg-blush-soft/60 active:scale-95"
              >
                View Map
              </a>
            )}
          </div>
        </Stagger>

        <Stagger delay={1.18}>
          <p className="mt-10 font-script text-2xl text-gold">
            We can&apos;t wait to celebrate with you
          </p>
        </Stagger>
      </div>
    </motion.div>
  );
}

function Stagger({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute h-9 w-9 text-gold-soft/70 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M2 38 C2 20 20 2 38 2" strokeLinecap="round" />
      <path d="M2 30 C2 16 16 2 30 2" strokeLinecap="round" opacity="0.6" />
      <circle cx="6" cy="34" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
