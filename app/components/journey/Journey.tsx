"use client";

import { motion } from "motion/react";
import Hero from "./Hero";
import Details from "./Details";
import Rsvp from "./Rsvp";
import Guestbook from "./Guestbook";
import Gallery from "./Gallery";
import Closing from "./Closing";

function Divider() {
  return (
    <div className="mx-auto flex max-w-xs items-center justify-center gap-3 px-6">
      <span className="gold-rule flex-1 opacity-50" />
      <span className="text-xs text-gold/60">✦</span>
      <span className="gold-rule flex-1 opacity-50" />
    </div>
  );
}

export default function Journey() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      <Hero />
      <Divider />
      <Details />
      <Divider />
      <Rsvp />
      <Divider />
      <Guestbook />
      <Divider />
      <Gallery />
      <Divider />
      <Closing />
    </motion.div>
  );
}
