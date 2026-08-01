"use client";

import { motion } from "motion/react";
import { wedding } from "../wedding-config";

/**
 * Classic luxury wedding monogram: interlocked script R & L inside a
 * fine double ring, wedding date beneath. Simple, joyful, timeless.
 */
export default function Monogram({ className = "" }: { className?: string }) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      aria-label={`${wedding.groom} and ${wedding.bride} monogram`}
      role="img"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold/60 sm:h-28 sm:w-28"
      >
        {/* inner ring */}
        <div className="absolute inset-[5px] rounded-full border border-gold/30" />

        {/* interlocked initials */}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="font-script text-[44px] leading-none text-gold sm:text-5xl"
          style={{ transform: "translate(-7px, -4px)" }}
        >
          R
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease }}
          className="font-script text-[44px] leading-none text-gold-soft sm:text-5xl"
          style={{ transform: "translate(-16px, 10px)" }}
        >
          L
        </motion.span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease }}
        className="mt-3 font-sans text-[10px] tracking-[0.35em] text-gold"
        dir="ltr"
      >
        {wedding.dateShort}
      </motion.p>
    </div>
  );
}
