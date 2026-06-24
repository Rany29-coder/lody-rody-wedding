"use client";

import { motion } from "motion/react";

/** Fade-up as the element scrolls into view (once). */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow label + script title, centered. */
export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10 text-center">
      <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-gold">
        {eyebrow}
      </p>
      <div className="my-4 flex items-center justify-center gap-3">
        <span className="gold-rule w-10" />
        <span className="text-gold-soft">✦</span>
        <span className="gold-rule w-10" />
      </div>
      <h2 className="gold-foil font-script text-5xl leading-tight sm:text-6xl">
        {title}
      </h2>
    </div>
  );
}

/** A full-width journey section with consistent padding + max width. */
export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-lg px-6 py-20 ${className}`}
    >
      {children}
    </section>
  );
}

/** Shared input/textarea styling — dark with gold focus, 16px to stop iOS zoom. */
export const fieldClass =
  "w-full rounded-lg border border-gold/30 bg-black/40 px-4 py-3 font-serif text-base text-ink placeholder:text-foreground/35 outline-none transition focus:border-gold/70 focus:ring-1 focus:ring-gold/40";

/** Gold pill button. */
export const goldButtonClass =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gold-bright via-gold-soft to-gold px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-background shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-50";

/** Outlined gold pill button. */
export const ghostButtonClass =
  "inline-flex items-center justify-center rounded-full border border-gold/50 px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-gold-soft transition hover:bg-gold/10 active:scale-95";
