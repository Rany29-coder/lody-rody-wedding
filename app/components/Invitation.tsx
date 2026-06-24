"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Journey from "./journey/Journey";

// iOS 13+ requires explicit permission for gyroscope, granted from a tap.
async function requestTiltPermission() {
  const D = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  if (D && typeof D.requestPermission === "function") {
    try {
      await D.requestPermission();
    } catch {
      /* user declined — pointer tilt still works */
    }
  }
}

export default function Invitation() {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    requestTiltPermission();
    setOpen(true);
  }

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <motion.div
          key="envelope"
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-5 py-12"
        >
          <Envelope onOpen={handleOpen} />
        </motion.div>
      ) : (
        <Journey key="journey" />
      )}
    </AnimatePresence>
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
        <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[#241a10] to-[#0d0a07] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] ring-1 ring-gold/40" />

        {/* Inner pocket triangles (sides + bottom) */}
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background:
              "linear-gradient(45deg, rgba(230,205,138,0.10) 0 50%, transparent 50%), linear-gradient(-45deg, rgba(230,205,138,0.10) 0 50%, transparent 50%)",
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
            background: "linear-gradient(to bottom, #2c2012, #15100a)",
            filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.5))",
          }}
        />
        {/* Thin gold seam along the flap */}
        <div
          className="absolute left-0 right-0 top-0 h-1/2"
          style={{
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            background:
              "linear-gradient(to bottom right, transparent 49.6%, rgba(230,205,138,0.5) 49.8%, transparent 50.1%), linear-gradient(to bottom left, transparent 49.6%, rgba(230,205,138,0.5) 49.8%, transparent 50.1%)",
          }}
        />

        {/* Wax seal */}
        <div className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-bright via-gold-soft to-gold text-background shadow-[0_4px_14px_rgba(0,0,0,0.6)] ring-2 ring-[#0a0807]/50">
          <span className="font-script text-2xl leading-none">R&amp;L</span>
        </div>
      </motion.div>

      <span className="animate-breathe mt-9 font-sans text-xs uppercase tracking-[0.4em] text-gold-soft">
        Tap to open
      </span>
    </motion.button>
  );
}
