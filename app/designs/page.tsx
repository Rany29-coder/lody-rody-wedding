import Link from "next/link";
import { designs } from "../components/designs/catalog";
import DesignObject from "../components/designs/Objects";
import "../components/designs/designs.css";
export const metadata = { title: "Five ways to say forever — Rody & Lody" };
export default function Collection() {
  return (
    <main className="collection">
      <header className="collection-top">
        <Link href="/">R & L</Link>
        <span>The wedding collection · 2026</span>
      </header>
      <section className="collection-intro">
        <p className="eyebrow">Rody & Lody · November 7</p>
        <h1>
          Five ways
          <br />
          to say <i>forever.</i>
        </h1>
        <p>
          One love story. Five little worlds.
          <br />
          Open each invitation and find the one that feels like you.
        </p>
        <div className="palette">
          <span />
          <span />
          <span />
          <span />
          <em>Ivory · sage · dusty rose</em>
        </div>
      </section>
      <div className="collection-grid">
        {designs.map((d) => (
          <Link
            className={`concept-preview preview-${d.slug}`}
            href={`/designs/${d.slug}/`}
            key={d.slug}
          >
            <div className="preview-scene">
              <DesignObject slug={d.slug} />
            </div>
            <div className="concept-copy">
              <span className="eyebrow">
                {d.number} · {d.mood}
              </span>
              <h2>
                {d.name}
                <span>↗</span>
              </h2>
              <p>{d.description}</p>
              <span className="preview-link">Experience this invitation</span>
            </div>
          </Link>
        ))}
      </div>
      <footer className="collection-footer">
        <p>Thoughtfully made for the beginning of forever.</p>
        <span>
          Five interactive design previews · best enjoyed on your phone
        </span>
      </footer>
    </main>
  );
}
