"use client";

import { motion } from "motion/react";

/**
 * Animated R + L → shared "ODY" monogram.
 * Concept: Rody & Lody both end in "ODY". The two initials begin apart,
 * a gold brace draws to connect them, and the shared "ODY" glides in —
 * two names becoming one.
 */
export default function Monogram({ className = "" }: { className?: string }) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
      aria-label="Rody and Lody monogram"
      role="img"
    >
      {/* Distinct initials, stacked */}
      <div className="flex flex-col items-end font-serif leading-[0.78] text-gold">
        <motion.span
          initial={{ x: -22, y: -14, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease }}
          className="text-4xl font-light sm:text-5xl"
        >
          R
        </motion.span>
        <motion.span
          initial={{ x: -22, y: 14, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
          className="text-4xl font-light sm:text-5xl"
        >
          L
        </motion.span>
      </div>

      {/* Gold brace that draws itself, grouping R + L toward ODY */}
      <svg
        viewBox="0 0 22 88"
        className="h-[58px] w-[14px] sm:h-[70px] sm:w-[16px]"
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        <motion.path
          d="M4 4 C12 4 12 38 18 44 C12 50 12 84 4 84"
          className="text-gold-soft"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeInOut" }}
        />
      </svg>

      {/* Shared suffix */}
      <motion.span
        initial={{ opacity: 0, scale: 0.82, x: 8 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease }}
        className="font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl"
      >
        ODY
      </motion.span>
    </div>
  );
}
