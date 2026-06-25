"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import Journey from "./journey/Journey";

// WebGL scene is client-only (no SSR).
const Experience = dynamic(() => import("./three/Experience"), { ssr: false });

export default function Invitation() {
  const [opening, setOpening] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Persistent 3D background: envelope intro + floating gold sparkles */}
      <Experience
        opening={opening}
        open={open}
        onRequestOpen={() => setOpening(true)}
        onOpened={() => setOpen(true)}
      />

      {/* Intro hint over the 3D canvas (also a reliable open control) */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="hint"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="pointer-events-none fixed inset-x-0 bottom-20 z-10 flex flex-col items-center gap-4 px-6 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-script text-3xl text-gold-soft"
            >
              {opening ? "Opening…" : "Drag to explore · tap to open"}
            </motion.p>
            {!opening && (
              <motion.button
                type="button"
                onClick={() => setOpening(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="animate-breathe pointer-events-auto rounded-full border border-gold/50 bg-black/30 px-8 py-3 font-sans text-xs uppercase tracking-[0.4em] text-gold-soft backdrop-blur-sm"
              >
                Open
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The HTML journey scrolls over the live 3D background once opened */}
      <AnimatePresence>{open && <Journey key="journey" />}</AnimatePresence>
    </>
  );
}
