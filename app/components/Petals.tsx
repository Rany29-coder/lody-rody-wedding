"use client";

import { useEffect, useMemo, useState } from "react";

// Deterministic pseudo-random so server/client markup matches (no hydration drift)
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Petals({ count = 22 }: { count?: number }) {
  // Decorative-only. Render client-side after mount to avoid SSR hydration
  // mismatches (Math.sin differs by ~1 ULP between Node and the browser).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 3 + seeded(i, 1) * 7; // small round gold motes
        return {
          left: `${seeded(i, 2) * 100}%`,
          size,
          duration: `${10 + seeded(i, 3) * 10}s`,
          delay: `${-seeded(i, 4) * 14}s`,
          drift: `${(seeded(i, 5) - 0.5) * 160}px`,
          opacity: 0.4 + seeded(i, 6) * 0.5,
        };
      }),
    [count]
  );

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            // @ts-expect-error custom property
            "--drift": p.drift,
          }}
        />
      ))}
    </div>
  );
}
