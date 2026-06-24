"use client";

import { motion } from "motion/react";
import { wedding } from "../../wedding-config";
import Countdown from "../Countdown";
import Monogram from "../Monogram";
import Tilt from "../Tilt";

export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        <Tilt className="w-full" max={9}>
          <div className="relative overflow-hidden rounded-2xl bg-[#120d08]/85 px-7 py-12 text-center shadow-[0_45px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-gold/30 backdrop-blur-sm sm:px-12">
            <div className="pointer-events-none absolute inset-3 rounded-xl ring-1 ring-gold/15" />

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
              <h1 className="gold-foil mt-6 font-script text-6xl leading-none sm:text-7xl">
                {wedding.groom}
              </h1>
            </Stagger>

            <Stagger delay={0.42}>
              <div className="my-3 flex items-center justify-center gap-4">
                <span className="gold-rule w-16" />
                <span className="font-script text-3xl text-gold-bright">
                  &amp;
                </span>
                <span className="gold-rule w-16" />
              </div>
            </Stagger>

            <Stagger delay={0.54}>
              <h1 className="gold-foil font-script text-6xl leading-none sm:text-7xl">
                {wedding.bride}
              </h1>
            </Stagger>

            <Stagger delay={0.7}>
              <p className="mx-auto mt-8 max-w-sm font-serif text-base italic leading-relaxed text-foreground/80">
                {wedding.invitationLine}
              </p>
            </Stagger>

            {wedding.date && (
              <Stagger delay={0.85}>
                <div className="mt-9">
                  <Countdown date={wedding.date} />
                </div>
              </Stagger>
            )}
          </div>
        </Tilt>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-10 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold-soft">
          Scroll
        </span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold-soft"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
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
      className={`pointer-events-none absolute h-9 w-9 text-gold/60 ${className}`}
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
