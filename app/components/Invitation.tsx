"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Petals from "./Petals";
import EnvelopeLetter from "./EnvelopeLetter";
import Journey from "./journey/Journey";

export default function Invitation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Ambient gold dust */}
      <Petals />

      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7 } }}
          >
            <EnvelopeLetter onOpened={() => setOpen(true)} />
          </motion.div>
        ) : (
          <Journey key="journey" />
        )}
      </AnimatePresence>
    </>
  );
}
