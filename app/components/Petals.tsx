"use client";

import { useEffect, useMemo, useState } from "react";

// Deterministic pseudo-random so server/client markup matches (no hydration drift)
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Petals({ count = 14 }: { count?: number }) {
  // Decorative-only. Render client-side after mount to avoid SSR hydration
  // mismatches (Math.sin differs by ~1 ULP between Node and the browser).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const size = 8 + seeded(i, 1) * 12;
        return {
          left: `${seeded(i, 2) * 100}%`,
          size,
          duration: `${9 + seeded(i, 3) * 9}s`,
          delay: `${-seeded(i, 4) * 12}s`,
          drift: `${(seeded(i, 5) - 0.5) * 160}px`,
          opacity: 0.35 + seeded(i, 6) * 0.4,
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
            height: p.size * 0.7,
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
