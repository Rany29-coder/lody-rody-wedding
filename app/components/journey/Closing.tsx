"use client";

import { wedding } from "../../wedding-config";
import Monogram from "../Monogram";
import { Reveal, Section } from "./ui";

export default function Closing() {
  return (
    <Section className="pb-28 pt-10 text-center">
      <Reveal>
        <Monogram className="mb-8 scale-90" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-script text-4xl text-gold-soft sm:text-5xl">
          We can&apos;t wait to celebrate with you
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mx-auto my-7 flex items-center justify-center gap-3">
          <span className="gold-rule w-12" />
          <span className="text-gold-soft">♥</span>
          <span className="gold-rule w-12" />
        </div>
      </Reveal>
      <Reveal delay={0.25}>
        <p className="font-serif text-lg text-ink">
          {wedding.groom} &amp; {wedding.bride}
        </p>
        <p className="mt-2 font-sans text-xs uppercase tracking-[0.35em] text-gold">
          {wedding.hashtag}
        </p>
      </Reveal>
    </Section>
  );
}
