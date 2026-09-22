"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { wedding } from "../../wedding-config";
import GuestExtras from "../designs/GuestExtras";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const target = Date.parse("2026-11-07T19:00:00+02:00");
const pieces = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  delay: `${(i % 9) * 0.27}s`,
  duration: `${6 + (i % 4)}s`,
  rotate: `${i * 29}deg`,
}));
function Lilies({ className = "" }: { className?: string }) {
  return (
    <Image
      className={`calla-lilies ${className}`}
      src={`${base}/invitation/calla-lilies.webp`}
      width={500}
      height={1000}
      alt=""
      aria-hidden="true"
      priority
    />
  );
}
function Names() {
  return (
    <h1 className="sage-names" aria-label="Rody and Lody">
      <svg
        className="name-flourish flourish-left"
        viewBox="0 0 260 80"
        aria-hidden="true"
      >
        <path d="M0 60C75 95 115 0 160 32C200 69 95 80 128 37C162-5 201 64 260 22" />
      </svg>
      <span className="name-rody">Rody</span>
      <span className="name-plus">&</span>
      <span className="name-lody">Lody</span>
      <svg
        className="name-flourish flourish-right"
        viewBox="0 0 260 80"
        aria-hidden="true"
      >
        <path d="M0 60C75 95 115 0 160 32C200 69 95 80 128 37C162-5 201 64 260 22" />
      </svg>
    </h1>
  );
}
export default function SelectedInvitation() {
  const [opened, setOpened] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const details = useRef<HTMLElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const hero = useRef<HTMLElement>(null);
  const [celebration, setCelebration] = useState(0);
  useEffect(() => {
    function tick() {
      setRemaining(Math.max(0, target - Date.now()));
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  function open() {
    setOpened(true);
    setCelebration((n) => n + 1);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        details.current?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      }),
    );
  }
  function close() {
    setOpened(false);
    requestAnimationFrame(() =>
      openButton.current?.focus({ preventScroll: true }),
    );
    hero.current?.scrollIntoView({ behavior: "instant" });
  }
  async function share() {
    const data = {
      title: "Rody & Lody — November 7, 2026",
      text: "Join us at 7 PM at Kasr El Dobara Evangelical Church, Cairo.",
      url: `${location.origin}${base}/`,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        setShareStatus("Invitation link copied.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(data.url);
        setShareStatus("Invitation link copied.");
      } catch {
        setShareStatus(
          "Copy the website address from your browser to share this invitation.",
        );
      }
    }
  }
  function calendar() {
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Rody and Lody//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:rody-lody-20261107@wedding",
      "DTSTAMP:20260922T000000Z",
      "DTSTART:20261107T170000Z",
      "SUMMARY:Rody & Lody — Wedding Ceremony",
      "LOCATION:Kasr El Dobara Evangelical Church\\, Tahrir Square\\, Cairo",
      "DESCRIPTION:Join us at 7:00 PM Cairo time. Your loved ones are also ours!",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([event], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "Rody-and-Lody-November-7.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function move(e: React.PointerEvent<HTMLElement>) {
    if (
      e.pointerType !== "mouse" ||
      paused ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--drift",
      `${((e.clientX - r.left) / r.width - 0.5) * 12}px`,
    );
  }
  const units =
    remaining === null
      ? null
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ];
  return (
    <main
      className={`design-world selected-world ${paused ? "motion-paused" : ""}`}
    >
      <header className="sage-header">
        <a href="#home" aria-label="Rody and Lody, back to invitation">
          R<span>&</span>L
        </a>
        <div>
          <button onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
            {paused ? "Resume motion" : "Pause motion"}
          </button>
          <button onClick={share}>Share ↗</button>
        </div>
      </header>
      <p className="sage-share-status" role="status">
        {shareStatus}
      </p>
      <section
        id="home"
        ref={hero}
        className="sage-hero"
        onPointerMove={move}
        onPointerLeave={(e) =>
          e.currentTarget.style.setProperty("--drift", "0px")
        }
      >
        <div className="sage-paper-grain" aria-hidden="true" />
        <div className="sage-confetti" key={celebration} aria-hidden="true">
          {pieces.map((p, i) => (
            <span
              key={i}
              style={
                {
                  left: p.left,
                  top: `${(i * 19) % 85}%`,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  "--turn": p.rotate,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <p className="sage-eyebrow">A day for love. A lifetime together.</p>
        <Names />
        <div className="sage-hero-copy">
          <p className="ceremony-line">
            Would like you to join their
            <br />
            wedding ceremony
          </p>
          <p className="sage-date" aria-label="November 7, 2026">
            <span>07</span>
            <i>·</i>
            <span>11</span>
            <i>·</i>
            <span>26</span>
          </p>
          <p className="sage-time">7:00 PM</p>
          <p className="sage-venue">
            Kasr El Dobara Evangelical Church
            <br />
            <span>Tahrir Square · Cairo</span>
          </p>
          <p className="loved-ones">Your loved ones are also ours!</p>
        </div>
        <Lilies className="lilies-left" />
        <Lilies className="lilies-right" />
        <button
          ref={openButton}
          className="sage-open"
          onClick={
            opened
              ? () =>
                  details.current?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  })
              : open
          }
          aria-expanded={opened}
          aria-controls="our-invitation"
        >
          <span>
            {opened ? "Return to the details" : "Unfold the invitation"}
          </span>
          <span aria-hidden="true">↓</span>
        </button>
        <p className="sage-open-note">Made with love, for you.</p>
      </section>
      <section
        id="our-invitation"
        className={`sage-details wedding-details ${opened ? "is-unfolded" : ""}`}
        hidden={!opened}
        ref={details}
      >
        <nav className="sage-nav" aria-label="Wedding invitation">
          <a href="#celebration">The day</a>
          <a href="#your-wishes">Your wishes</a>
          <a href="#memories">Memories</a>
          <button onClick={close} aria-label="Fold the invitation closed">
            Fold ↑
          </button>
        </nav>
        <div className="unfolded-paper">
          <section className="sage-blessing">
            <span className="sage-ornament" aria-hidden="true">
              ✧
            </span>
            <p className="eyebrow">Together with our families</p>
            <h2>
              Two hearts.
              <br />
              <em>One beautiful promise.</em>
            </h2>
            <blockquote>
              “So they are no longer two, but one.
              <br />
              Therefore what God has joined together,
              <br />
              let man not separate.”
            </blockquote>
            <p className="eyebrow">Matthew 19:6</p>
            <p className="blessing-note">
              It would mean the world to celebrate this beginning with you.
            </p>
          </section>
          <section id="celebration" className="sage-celebration">
            <p className="eyebrow">Save a little space for our big day</p>
            <h2>
              Saturday,
              <br />
              <em>November seventh.</em>
            </h2>
            <div className="sage-event-grid">
              <div>
                <span className="event-number">07</span>
                <p>November 2026</p>
              </div>
              <div>
                <span className="event-number">7:00</span>
                <p>PM · Cairo time</p>
              </div>
            </div>
            <p className="ceremony-location">
              Kasr El Dobara
              <br />
              Evangelical Church
            </p>
            <p className="location-small">Tahrir Square, Cairo, Egypt</p>
            <div className="sage-event-actions">
              <a
                className="primary-action"
                href={wedding.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions to the church ↗
              </a>
              <button className="secondary-action" onClick={calendar}>
                Add to my calendar ↓
              </button>
            </div>
            <div className="sage-countdown" aria-label="Time until the wedding">
              {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
                <div key={label}>
                  <strong>
                    {units ? String(units[i]).padStart(2, "0") : "—"}
                  </strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="countdown-caption">
              {remaining === 0
                ? "The day we have been waiting for."
                : "Counting the moments until we celebrate together."}
            </p>
          </section>
          <div className="sage-guest-sections">
            <GuestExtras />
          </div>
          <footer className="sage-closing">
            <Lilies />
            <p>With all our love,</p>
            <h2>Rody & Lody</h2>
            <p className="closing-date">07 · 11 · 26</p>
            <p className="closing-tagline">Your loved ones are also ours!</p>
            <button onClick={share} className="secondary-action">
              Share the invitation ↗
            </button>
            <a href="#home">Back to the beginning ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}
