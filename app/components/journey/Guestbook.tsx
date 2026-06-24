"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Reveal,
  Section,
  SectionHeading,
  fieldClass,
  goldButtonClass,
} from "./ui";

type Message = { id: number; name: string; text: string };

// Seed messages so the guestbook never looks empty (replaced by real data later).
const SEED: Message[] = [
  {
    id: 1,
    name: "Mariam",
    text: "So overjoyed for you both! May your life together be full of love and light. 🤍",
  },
  {
    id: 2,
    name: "George",
    text: "Rody & Lody — a perfect match. Wishing you a lifetime of happiness!",
  },
];

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    // TODO(backend): persist this message. UI-only (local state) for now.
    setMessages((prev) => [
      { id: Date.now(), name: name.trim(), text: text.trim() },
      ...prev,
    ]);
    setName("");
    setText("");
  }

  return (
    <Section>
      <Reveal>
        <SectionHeading eyebrow="From the Heart" title="Leave a message" />
      </Reveal>

      <Reveal delay={0.1}>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gold/20 bg-[#120d08]/60 p-7 backdrop-blur-sm sm:p-8"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            dir="auto"
            placeholder="Your name"
            className={`${fieldClass} mb-4`}
            required
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="auto"
            placeholder="Write a wish for the couple…"
            rows={4}
            className={`${fieldClass} resize-none`}
            required
          />
          <button type="submit" className={`${goldButtonClass} mt-5 w-full`}>
            Sign the Guestbook
          </button>
        </form>
      </Reveal>

      <div className="mt-8 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gold/15 bg-black/30 p-5"
            >
              <p className="font-serif text-base italic leading-relaxed text-foreground/85">
                “{m.text}”
              </p>
              <p className="mt-3 font-script text-2xl text-gold-soft">
                {m.name}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
}
