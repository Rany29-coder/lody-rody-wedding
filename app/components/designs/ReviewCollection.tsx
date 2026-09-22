"use client";
import Link from "next/link";
import { useState } from "react";
import { designs, type DesignSlug } from "./catalog";
import DesignObject from "./Objects";
import { useReviewStore } from "./useReviewStore";
export default function ReviewCollection() {
  const { favorites, notes, update } = useReviewStore();
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState("all");
  function favorite(slug: DesignSlug) {
    update({
      favorites: favorites.includes(slug)
        ? favorites.filter((s) => s !== slug)
        : [...favorites, slug],
      notes,
    });
    setStatus("");
  }
  const feedback = `Rody & Lody — invitation design feedback\n\nOur favorites:\n${
    favorites.length
      ? favorites
          .map((s) => {
            const d = designs.find((d) => d.slug === s)!;
            return `${d.number}. ${d.name}`;
          })
          .join("\n")
      : "Still deciding"
  }\n\nWhat we like / would change:\n${notes.trim() || "We will add our thoughts here."}\n\nNext step: refine our chosen opening before moving on to the rest of the invitation.`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(feedback);
      setStatus("Copied! Paste this into your chat to send your feedback.");
    } catch {
      setStatus(
        "Copy the text from the feedback box below and paste it into your chat.",
      );
    }
  }
  const visible = designs.filter((d) =>
    filter === "new"
      ? Number(d.number) > 5
      : filter === "favorites"
        ? favorites.includes(d.slug)
        : true,
  );
  return (
    <main className="collection">
      <header className="collection-top">
        <Link href="/designs/">R & L</Link>
        <a href="#your-choice">Your shortlist · {favorites.length}</a>
      </header>
      <aside className="selected-direction">
        <span>Rody & Lody’s chosen direction</span>
        <Link href="/invitation/">
          Sage, ivory & calla lilies — see the refined invitation ↗
        </Link>
      </aside>
      <section className="collection-intro">
        <p className="eyebrow">Made just for Rody & Lody · Step 01</p>
        <h1>
          Your love.
          <br />
          Your <i>first impression.</i>
        </h1>
        <p>
          Rody & Lody, this is where your invitation begins.
          <br />
          Ten different ways to welcome your guests. Which one feels like you?
        </p>
        <div className="palette">
          <span />
          <span />
          <span />
          <span />
          <em>Your palette: ivory · sage · dusty rose</em>
        </div>
        <div className="review-guide">
          <div>
            <strong>01 / Explore</strong>
            <p>
              Open the designs on your phone. Tap, swipe, and replay the
              opening.
            </p>
          </div>
          <div>
            <strong>02 / Choose</strong>
            <p>
              Save the ones you love. You can choose one or mix ideas from a
              few.
            </p>
          </div>
          <div>
            <strong>03 / Tell us</strong>
            <p>
              Add your thoughts and copy your feedback to send back in your
              chat.
            </p>
          </div>
        </div>
        <p className="review-scope">
          For now, choose the opening and the overall feel. Then we’ll refine
          your favorite together, confirm your wording and details, and build
          the next steps.
        </p>
      </section>
      <nav className="review-filters" aria-label="Filter designs">
        {[
          ["all", "All 10 designs"],
          ["new", "5 new ideas"],
          ["favorites", `Your shortlist (${favorites.length})`],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="collection-grid">
        {visible.map((d) => (
          <article className={`concept-preview preview-${d.slug}`} key={d.slug}>
            <Link
              className="design-preview-link"
              href={`/designs/${d.slug}/`}
              aria-label={`Explore ${d.number}: ${d.name}`}
            >
              <div className="preview-scene">
                <DesignObject slug={d.slug} />
                {Number(d.number) > 5 && (
                  <span className="new-concept">New idea</span>
                )}
              </div>
            </Link>
            <div className="concept-copy">
              <span className="eyebrow">
                {d.number} · {d.mood}
              </span>
              <h2>
                <Link href={`/designs/${d.slug}/`}>
                  {d.name}
                  <span>↗</span>
                </Link>
              </h2>
              <p>{d.description}</p>
              <div className="concept-actions">
                <Link className="preview-link" href={`/designs/${d.slug}/`}>
                  Try the opening ↗
                </Link>
                <button
                  className="favorite-button"
                  aria-pressed={favorites.includes(d.slug)}
                  aria-label={`${favorites.includes(d.slug) ? "Remove" : "Shortlist"} ${d.name}`}
                  onClick={() => favorite(d.slug)}
                >
                  {favorites.includes(d.slug)
                    ? "♥ Shortlisted"
                    : "♡ Save favorite"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="empty-shortlist">
          Your shortlist is waiting. Explore the designs and save the ones you
          love.
        </p>
      )}
      <section id="your-choice" className="couple-feedback">
        <p className="eyebrow">Over to you, Rody & Lody</p>
        <h2>
          What feels like <i>you?</i>
        </h2>
        <p>
          There’s no wrong answer. Tell us what you love, what you’d change, or
          which ideas you’d like to combine.
        </p>
        <div className="shortlist-summary">
          {favorites.length ? (
            favorites.map((slug) => {
              const d = designs.find((d) => d.slug === slug)!;
              return (
                <button
                  key={slug}
                  onClick={() => favorite(slug)}
                  aria-label={`Remove ${d.name} from shortlist`}
                >
                  {d.number} · {d.name} ×
                </button>
              );
            })
          ) : (
            <span>
              No favorites selected yet — you can still leave feedback below.
            </span>
          )}
        </div>
        <label htmlFor="couple-notes">Your thoughts</label>
        <textarea
          id="couple-notes"
          rows={5}
          maxLength={3000}
          value={notes}
          onChange={(e) => {
            update({ favorites, notes: e.target.value });
            setStatus("");
          }}
          placeholder="We like #… because… We would change… Could we combine…?"
        />
        <button className="primary-action" onClick={copy}>
          Copy our feedback ↗
        </button>
        <p className="feedback-status" role="status">
          {status}
        </p>
        <details>
          <summary>Preview the feedback to send</summary>
          <textarea
            aria-label="Feedback to copy"
            readOnly
            value={feedback}
            rows={10}
          />
        </details>
        <p className="demo-note">
          Your shortlist and notes are kept in this browser when storage is
          available. Nothing is sent automatically — copy your feedback and send
          it in your chat.
        </p>
      </section>
      <footer className="collection-footer">
        <p>One beautiful beginning, chosen by you.</p>
        <span>
          For Rody & Lody · November 7, 2026 · These are design previews, not
          the final guest invitation.
        </span>
      </footer>
    </main>
  );
}
