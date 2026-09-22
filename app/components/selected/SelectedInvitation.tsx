"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { wedding } from "../../wedding-config";
import GuestExtras from "../designs/GuestExtras";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const target = Date.parse(wedding.date);
const pieces = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  delay: `${-((i * 1.73) % (6 + (i % 4)))}s`,
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
function Names({
  compact = false,
  closing = false,
}: {
  compact?: boolean;
  closing?: boolean;
}) {
  const id = useId();
  if (compact) {
    const ink = `url(#${id}-initial-ink)`;
    const original = (
      <image
        href={`${base}/invitation/original-wordmark.jpeg`}
        width="912"
        height="486"
        filter={ink}
      />
    );
    return (
      <span className="header-wordmark">
        <svg
          viewBox="0 0 410 235"
          aria-hidden="true"
          className="original-initials"
        >
          <defs>
            <filter id={`${id}-initial-ink`} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1  0 0 0 0 .945  0 0 0 0 .8  2 4 .667 0 -4.5"
              />
            </filter>
            <clipPath id={`${id}-initial-r`}>
              <path d="M420 35 H610 V135 H560 V232 H420 Z" />
            </clipPath>
            <clipPath id={`${id}-initial-l`}>
              <path d="M250 230 H335 V320 L308 385 L390 395 V440 H250 Z" />
            </clipPath>
          </defs>
          <g transform="translate(-410 -30)" clipPath={`url(#${id}-initial-r)`}>
            {original}
          </g>
          <svg
            x="195"
            y="108"
            width="32"
            height="30"
            viewBox="425 235 45 35"
            overflow="hidden"
          >
            {original}
          </svg>
          <g transform="translate(15 -195)" clipPath={`url(#${id}-initial-l)`}>
            {original}
          </g>
        </svg>
      </span>
    );
  }
  const artwork = (
    <svg
      className={`original-wordmark ${closing ? "is-static" : ""}`}
      viewBox="0 0 912 486"
      aria-hidden="true"
    >
      <defs>
        <filter id={`${id}-wordmark-ink`} colorInterpolationFilters="sRGB">
          {/* Isolate the light ink at render time; keep the original artwork intact. */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 .945  0 0 0 0 .8  3 6 1 0 -7"
          />
        </filter>
      </defs>
      <defs>
        <clipPath id={`${id}-ink-rody`}>
          <path d="M0 0H912V250H810L760 278H460L450 275L430 270L400 265L370 220H265L250 278H0Z" />
        </clipPath>
        <clipPath id={`${id}-ink-lody`}>
          <path d="M0 278H250L265 220H370L400 265L430 270L450 275L460 278H760L810 250H912V486H0Z" />
        </clipPath>
        <mask
          id={`${id}-ink-from-left`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="912"
          height="486"
        >
          <path
            className="ink-trace"
            pathLength="1"
            d="M-70 245 C80 290 90 130 220 170 S350 200 410 150 L490 45 C660 0 565 145 430 205 L545 220 L455 250 L485 150 L575 165 L620 165 L655 100 L630 180 L700 155 L680 265 L745 165 L790 155"
          />
          <rect
            className="ink-complete"
            width="912"
            height="486"
            fill="white"
          />
        </mask>
        <mask
          id={`${id}-ink-from-right`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="912"
          height="486"
        >
          <path
            className="ink-trace"
            pathLength="1"
            d="M982 280 C820 240 735 345 800 295 C760 415 610 370 540 350 L485 350 L430 445 L475 350 L410 345 L420 280 L385 355 L335 345 L290 350 L325 245 L270 415 L375 415"
          />
          <rect
            className="ink-complete"
            width="912"
            height="486"
            fill="white"
          />
        </mask>
      </defs>
      <defs>
        <mask
          id={`${id}-clean-ink`}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="912"
          height="486"
        >
          <rect width="912" height="486" fill="white" />
          <path d="M398 171 Q400 168 403 166 H418 V185 H394 Z" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${id}-clean-ink)`}>
        <g className="ink-side ink-left" clipPath={`url(#${id}-ink-rody)`}>
          <image
            href={`${base}/invitation/original-wordmark.jpeg`}
            width="912"
            height="486"
            filter={`url(#${id}-wordmark-ink)`}
            mask={`url(#${id}-ink-from-left)`}
          />
        </g>
        <g className="ink-side ink-right" clipPath={`url(#${id}-ink-lody)`}>
          <image
            href={`${base}/invitation/original-wordmark.jpeg`}
            width="912"
            height="486"
            filter={`url(#${id}-wordmark-ink)`}
            mask={`url(#${id}-ink-from-right)`}
          />
        </g>
      </g>
    </svg>
  );
  if (closing)
    return (
      <h2 className="sage-names closing-wordmark" aria-label="Rody and Lody">
        {artwork}
      </h2>
    );
  return (
    <h1 className="sage-names" aria-label="Rody and Lody">
      {artwork}
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
  const shareTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (shareTimer.current) clearTimeout(shareTimer.current);
    },
    [],
  );
  function showShareStatus(message: string, duration = 3000) {
    if (shareTimer.current) clearTimeout(shareTimer.current);
    setShareStatus(message);
    shareTimer.current = setTimeout(() => setShareStatus(""), duration);
  }
  async function share() {
    const data = {
      title: "Rody & Lody — November 7, 2026",
      text: "Join us at 6:30 PM at Kasr El Dobara Evangelical Church, Cairo.",
      url: `${location.origin}${base}/`,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
        showShareStatus("Invitation link copied.");
      }
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(data.url);
        showShareStatus("Invitation link copied.");
      } catch {
        showShareStatus(
          "Copy the website address from your browser to share this invitation.",
          7000,
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
      "DTSTART:20261107T163000Z",
      "SUMMARY:Rody & Lody — Wedding Ceremony",
      "LOCATION:Kasr El Dobara Evangelical Church\\, Tahrir Square\\, Cairo",
      "DESCRIPTION:Join us at 6:30 PM Cairo time. Your loved ones are also ours!",
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
          <Names compact />
        </a>
        <div>
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
          <p className="sage-time">{wedding.timeLabel}</p>
          <p className="sage-venue">
            Kasr El Dobara Evangelical Church
            <br />
            <span>Tahrir Square · Cairo</span>
          </p>
        </div>
        <Lilies className="lilies-left" />
        <Lilies className="lilies-right" />
        <Lilies className="lilies-left lilies-extra-left" />
        <Lilies className="lilies-right lilies-extra-right" />
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
            <figure className="wedding-scripture">
              <blockquote>
                “So they are no longer two, but one.
                <br />
                Therefore what God has joined together,
                <br />
                let man not separate.”
              </blockquote>
              <figcaption className="eyebrow verse-reference">
                Matthew 19:6
              </figcaption>
            </figure>
            <p className="blessing-note">
              <span>It would mean the world to celebrate</span>
              <span>this beginning with you.</span>
            </p>
          </section>
          <section id="celebration" className="sage-celebration">
            <h2>
              Come celebrate
              <br />
              <em>with us.</em>
            </h2>
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
            <GuestExtras refined />
          </div>
          <footer className="sage-closing">
            <Lilies />
            <Lilies className="closing-lilies-right" />
            <p>With all our love,</p>
            <Names closing />
            <p className="closing-tagline">
              Your loved ones
              <br />
              are also ours!
            </p>
            <button onClick={share} className="secondary-action">
              Share the invitation ↗
            </button>
            <a href="#home">Back to the beginning ↑</a>
          </footer>
        </div>
      </section>
      <div className="motion-settings">
        <button onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
    </main>
  );
}
