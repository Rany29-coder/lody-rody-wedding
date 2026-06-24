"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { wedding } from "../../wedding-config";
import {
  Reveal,
  Section,
  SectionHeading,
  fieldClass,
  goldButtonClass,
} from "./ui";

type Attending = "yes" | "no";

export default function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending>("yes");
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    // TODO(backend): persist this RSVP. UI-only for now.
    setSubmitted(true);
  }

  return (
    <Section>
      <Reveal>
        <SectionHeading eyebrow="Join Us" title="Will you celebrate?" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rounded-2xl border border-gold/20 bg-[#120d08]/60 p-7 backdrop-blur-sm sm:p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 text-center"
              >
                <p className="font-script text-4xl text-gold-soft">
                  Thank you{name ? `, ${name.split(" ")[0]}` : ""}!
                </p>
                <p className="mx-auto mt-3 max-w-xs font-serif text-base text-foreground/80">
                  {attending === "yes"
                    ? `We've noted ${guests} ${
                        guests === 1 ? "guest" : "guests"
                      }. We can't wait to celebrate with you. 🤍`
                    : "We'll miss you dearly, but thank you for letting us know. 🤍"}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block font-sans text-[11px] uppercase tracking-[0.25em] text-gold">
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    dir="auto"
                    placeholder="Full name"
                    className={fieldClass}
                    required
                  />
                </div>

                <div>
                  <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.25em] text-gold">
                    Will you attend?
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <ChoiceButton
                      active={attending === "yes"}
                      onClick={() => setAttending("yes")}
                      label="Joyfully accept"
                    />
                    <ChoiceButton
                      active={attending === "no"}
                      onClick={() => setAttending("no")}
                      label="Regretfully decline"
                    />
                  </div>
                </div>

                {attending === "yes" && (
                  <div>
                    <label className="mb-2 block font-sans text-[11px] uppercase tracking-[0.25em] text-gold">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-4">
                      <Stepper
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        label="−"
                      />
                      <span
                        dir="ltr"
                        className="w-10 text-center font-serif text-2xl text-ink"
                      >
                        {guests}
                      </span>
                      <Stepper
                        onClick={() => setGuests((g) => Math.min(10, g + 1))}
                        label="+"
                      />
                    </div>
                  </div>
                )}

                <button type="submit" className={`${goldButtonClass} w-full`}>
                  Send RSVP
                </button>
                <p className="text-center font-serif text-xs italic text-foreground/45">
                  Kindly respond before the big day · {wedding.hashtag}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}

function ChoiceButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-4 py-3 font-sans text-xs uppercase tracking-[0.15em] transition ${
        active
          ? "border-gold bg-gold/15 text-gold-soft"
          : "border-gold/25 text-foreground/60 hover:border-gold/50"
      }`}
    >
      {label}
    </button>
  );
}

function Stepper({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 font-serif text-2xl text-gold-soft transition hover:bg-gold/10 active:scale-90"
    >
      {label}
    </button>
  );
}
