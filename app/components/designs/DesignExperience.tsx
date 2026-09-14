"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { designs } from "./catalog";
import DesignObject, { BotanicalPaper, Initials, LeafBranch } from "./Objects";
import { wedding } from "../../wedding-config";
import GuestExtras from "./GuestExtras";
type Design = (typeof designs)[number];
export default function DesignExperience({ design }: { design: Design }) {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [light, setLight] = useState(50);
  const [copied, setCopied] = useState("");
  const [days, setDays] = useState<number | null>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const detailsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const update = () =>
      setDays(
        Math.max(
          0,
          Math.ceil(
            (Date.parse("2026-11-07T00:00:00+02:00") - Date.now()) / 86400000,
          ),
        ),
      );
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);
  function tilt(e: React.PointerEvent<HTMLDivElement>) {
    if (
      e.pointerType !== "mouse" ||
      opened ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--ry",
      `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`,
    );
    e.currentTarget.style.setProperty(
      "--rx",
      `${-((e.clientY - r.top) / r.height - 0.5) * 9}deg`,
    );
  }
  function resetTilt() {
    objectRef.current?.style.setProperty("--ry", "0deg");
    objectRef.current?.style.setProperty("--rx", "0deg");
  }
  function toggle() {
    resetTilt();
    setOpened((o) => !o);
    setPage(0);
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("Link copied");
    } catch {
      setCopied("Copy the address from your browser to share");
    }
  }
  function calendar() {
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Rody and Lody//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:rody-lody-20261107@wedding",
      "DTSTAMP:20260914T000000Z",
      "DTSTART;VALUE=DATE:20261107",
      "DTEND;VALUE=DATE:20261108",
      "SUMMARY:Rody & Lody — Wedding",
      "LOCATION:Qasr El Dobara Evangelical Church\\, Cairo",
      "DESCRIPTION:Ceremony time to be confirmed.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "Rody-and-Lody.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <main className={`design-world world-${design.slug}`}>
      <header className="design-header">
        <Link href="/designs/">← The collection</Link>
        <span>R & L</span>
        <button onClick={share} aria-label="Copy invitation link">
          Share ↗
        </button>
      </header>
      <section
        className={`opening ${opened ? "opening-open" : ""}`}
        aria-label={design.name}
      >
        <div className="opening-heading">
          <p className="eyebrow">A celebration of us · 07.11.2026</p>
          <h1>{design.short}</h1>
          <p className="opening-note">
            {opened
              ? "A little piece of our forever."
              : "A personal invitation for someone special."}
          </p>
        </div>
        <div
          className="scene"
          style={
            {
              "--light": `${light}%`,
              "--shadow-x": `${(50 - light) * 0.4}px`,
            } as CSSProperties
          }
        >
          <div className="scene-shadow" />
          <div
            ref={objectRef}
            className="object-tilt"
            role="button"
            tabIndex={0}
            aria-label={opened ? "Invitation opened" : design.action}
            onClick={() => {
              if (!opened) {
                resetTilt();
                setOpened(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!opened) {
                  resetTilt();
                  setOpened(true);
                }
              }
            }}
            onPointerMove={tilt}
            onPointerLeave={resetTilt}
            onPointerDown={(e) => {
              touchStart.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (
                touchStart.current !== null &&
                Math.abs(e.clientX - touchStart.current) > 40
              ) {
                resetTilt();
                setOpened(true);
              }
              touchStart.current = null;
            }}
          >
            <DesignObject slug={design.slug} opened={opened} page={page} />
          </div>
        </div>
        <div className="opening-controls">
          <button
            className="primary-action"
            onClick={toggle}
            aria-expanded={opened}
            aria-controls="wedding-details"
          >
            {opened ? "Close & replay" : design.action}
            <span>{opened ? "↺" : "↗"}</span>
          </button>
          {opened && design.slug === "the-storybook" && (
            <button
              className="text-action"
              onClick={() => setPage((p) => (p === 0 ? 1 : 0))}
            >
              {page === 0 ? "Turn to the day →" : "← Back to our story"}
            </button>
          )}
          {design.slug === "the-garden" && (
            <label className="light-control">
              Move the sunlight
              <input
                type="range"
                min="10"
                max="90"
                value={light}
                onChange={(e) => setLight(Number(e.target.value))}
              />
            </label>
          )}
          <p className="interaction-hint">
            {opened
              ? "Your invitation is waiting below."
              : "Touch to open · swipe across to discover"}
          </p>
          {opened && (
            <button
              className="text-action continue-action"
              onClick={() =>
                detailsRef.current?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              Discover the day ↓
            </button>
          )}
          <span role="status" className="share-status">
            {copied}
          </span>
        </div>
        <span className="concept-label">
          {design.number} / {design.name}
        </span>
      </section>
      <section
        ref={detailsRef}
        id="wedding-details"
        className="wedding-details"
        hidden={!opened}
      >
        <nav className="journey-nav" aria-label="Invitation sections">
          <a href="#invitation">Invitation</a>
          <a href="#the-day">The day</a>
          <a href="#your-wishes">Your wishes</a>
          <a href="#memories">Memories</a>
        </nav>
        <article id="invitation" className="formal-invitation">
          <BotanicalPaper />
          <div className="formal-copy">
            <p className="verse">
              “So they are no longer two, but one.
              <br />
              Therefore what God has joined together,
              <br />
              let man not separate.”
            </p>
            <span className="eyebrow">Matthew 19:6</span>
            <p className="families">
              Together
              <br />
              with their families,
            </p>
            <Initials />
            <h2>
              Rody <i>&</i> Lody
            </h2>
            <p className="invite-line">
              Joyfully invite you to their
              <br />
              wedding ceremony
            </p>
            <div className="formal-date">
              <span>Saturday</span>
              <strong>November 7</strong>
              <span>2026</span>
            </div>
          </div>
        </article>
        <div id="the-day" className="day-section">
          <p className="eyebrow">A place. A promise. A beginning.</p>
          <h2>See you in Cairo.</h2>
          <div className="day-grid">
            <div>
              <span className="eyebrow">When</span>
              <h3>07 November 2026</h3>
              <p>Ceremony time to be confirmed</p>
            </div>
            <div>
              <span className="eyebrow">Where</span>
              <h3>Qasr El Dobara</h3>
              <p>Evangelical Church · Cairo, Egypt</p>
            </div>
          </div>
          <div className="day-actions">
            <a
              className="primary-action"
              href={wedding.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Find the church ↗
            </a>
            <button className="secondary-action" onClick={calendar}>
              Save the date ↓
            </button>
          </div>
          <p className="days-count">
            {days === null
              ? "Counting down to forever"
              : `${days} days until our next chapter`}
          </p>
        </div>
        <GuestExtras />
        <footer className="invitation-footer">
          <LeafBranch />
          <p>With all our love,</p>
          <h2>Rody & Lody</h2>
          <span className="eyebrow">07 · 11 · 2026</span>
          <Link href="/designs/">Explore the five designs ↗</Link>
        </footer>
      </section>
    </main>
  );
}
