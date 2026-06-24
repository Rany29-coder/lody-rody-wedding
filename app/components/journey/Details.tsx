"use client";

import { wedding } from "../../wedding-config";
import { Reveal, Section, SectionHeading, ghostButtonClass } from "./ui";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Build an .ics calendar file (no backend needed) and trigger a download.
function addToCalendar() {
  if (!wedding.date) return;
  const start = new Date(wedding.date);
  const end = new Date(start.getTime() + wedding.durationHours * 3_600_000);
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
      d.getUTCHours()
    )}${pad(d.getUTCMinutes())}00Z`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rody and Lody//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@rodyandlody`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${wedding.groom} & ${wedding.bride} — Wedding`,
    `LOCATION:${wedding.venueName}, ${wedding.venueAddress}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "rody-and-lody-wedding.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Details() {
  return (
    <Section>
      <Reveal>
        <SectionHeading eyebrow="When & Where" title="The Celebration" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rounded-2xl border border-gold/20 bg-[#120d08]/60 p-8 text-center backdrop-blur-sm">
          <p className="font-serif text-2xl text-ink">{wedding.dateLabel}</p>
          <p className="mt-1 font-sans text-xs uppercase tracking-[0.3em] text-gold-soft">
            {wedding.timeLabel}
          </p>

          <div className="mx-auto my-7 h-px w-24 bg-gold/30" />

          <p className="font-serif text-xl text-ink">{wedding.venueName}</p>
          <p className="mt-1 font-sans text-xs uppercase tracking-[0.25em] text-foreground/60">
            {wedding.venueAddress}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {wedding.mapsUrl && (
              <a
                href={wedding.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={ghostButtonClass}
              >
                View Map
              </a>
            )}
            {wedding.date && (
              <button
                type="button"
                onClick={addToCalendar}
                className={ghostButtonClass}
              >
                Add to Calendar
              </button>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
