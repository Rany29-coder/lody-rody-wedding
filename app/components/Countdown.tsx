"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: ms === 0 };
}

const FIELDS: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] =
  [
    { key: "days", label: "Days" },
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
  ];

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  // Start null so server-rendered HTML and the first client render match
  // (the live value depends on Date.now(), which differs build-time vs runtime).
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (Number.isNaN(target)) return null;

  // Structurally-identical placeholder until mounted (no layout shift)
  if (!t) {
    return (
      <div className="flex items-start justify-center gap-3 sm:gap-5">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center">
            <span className="font-serif text-3xl sm:text-5xl font-light tabular-nums text-ink">
              --
            </span>
            <span className="mt-1 font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (t.done) {
    return (
      <p className="font-script text-3xl text-gold">Today is the day! 💛</p>
    );
  }

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      {FIELDS.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <span className="font-serif text-3xl sm:text-5xl font-light tabular-nums text-ink">
            {String(t[key]).padStart(2, "0")}
          </span>
          <span className="mt-1 font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
