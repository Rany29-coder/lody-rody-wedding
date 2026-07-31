"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * A hand-crafted 3D envelope. Real paper grain, gold-foil seams, an
 * embossed wax seal with the R&L monogram, and a cinematic opening:
 * the flap swings back in true perspective, the letter rises out.
 * CSS 3D — crisp typography and textures, no CGI look.
 */

// Subtle paper grain (inline SVG noise)
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.9 0 0 0 0 0.8 0 0 0 0 0.6 0 0 0 0.05 0'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")";

type Stage = "closed" | "flap" | "rise" | "out";

export default function EnvelopeLetter({
  onOpened,
}: {
  onOpened: () => void;
}) {
  const [stage, setStage] = useState<Stage>("closed");
  const interactive = stage === "closed";

  // Pointer tilt (springy, disabled while opening)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 16 });
  const sy = useSpring(py, { stiffness: 120, damping: 16 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, 0]);
  const sheenX = useTransform(sx, [-0.5, 0.5], ["-18%", "18%"]);

  function onMove(e: React.PointerEvent) {
    if (!interactive) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }
  function openIt() {
    if (!interactive) return;
    px.set(0);
    py.set(0);
    setStage("flap");
  }

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-6">
      {/* Perspective stage */}
      <div
        style={{ perspective: 1500 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="w-[min(88vw,430px)]"
      >
        <motion.div
          style={{
            rotateX: interactive ? rotateX : 6,
            rotateY: interactive ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          onClick={openIt}
          className={interactive ? "cursor-pointer" : ""}
          role="button"
          aria-label="Open the invitation"
        >
          {/* ENVELOPE */}
          <div className="relative aspect-[10/6.8] w-full">
            {/* Contact + ambient shadow */}
            <div
              aria-hidden
              className="absolute inset-x-6 -bottom-10 h-16 rounded-[50%] bg-black/70 blur-2xl"
            />

            {/* Back panel */}
            <div
              className="absolute inset-0 rounded-[10px]"
              style={{
                zIndex: 10,
                background:
                  "linear-gradient(160deg, #221709 0%, #17100a 55%, #0e0a06 100%)",
                boxShadow:
                  "0 40px 80px -24px rgba(0,0,0,0.85), 0 8px 22px rgba(0,0,0,0.6)",
              }}
            />

            {/* Interior (visible above the letter once the flap opens) */}
            <div
              className="absolute inset-x-[3px] top-[2px] h-1/2 rounded-t-[9px]"
              style={{
                zIndex: 12,
                background:
                  "linear-gradient(to bottom, #060403 0%, #120c07 70%, #1a1209 100%)",
                boxShadow: "inset 0 14px 22px rgba(0,0,0,0.85)",
              }}
            />

            {/* LETTER — rises out of the pocket */}
            <motion.div
              initial={false}
              animate={{
                y: stage === "rise" || stage === "out" ? "-108%" : "0%",
              }}
              transition={{ duration: 1.15, ease: [0.24, 0.9, 0.3, 1] }}
              onAnimationComplete={() => {
                if (stage === "rise") {
                  setStage("out");
                  onOpened();
                }
              }}
              className="absolute inset-x-[7%] top-[5%] bottom-[7%]"
              style={{ zIndex: 20 }}
            >
              <div
                className="flex h-full w-full flex-col items-center justify-center rounded-[6px] px-6 text-center"
                style={{
                  background:
                    "linear-gradient(168deg, #f6efdd 0%, #efe5cd 60%, #e6d9ba 100%)",
                  backgroundImage: `${NOISE}, linear-gradient(168deg, #f6efdd 0%, #efe5cd 60%, #e6d9ba 100%)`,
                  boxShadow:
                    "0 -6px 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(148,110,45,0.35)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-2 rounded-[4px]"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(148,110,45,0.28)" }}
                />
                <p
                  className="font-sans text-[9px] uppercase tracking-[0.42em]"
                  style={{ color: "#8a6a2c" }}
                >
                  Wedding Invitation
                </p>
                <p
                  className="font-script mt-2 text-4xl leading-tight sm:text-5xl"
                  style={{ color: "#3d2c12" }}
                >
                  Rody <span className="text-2xl align-middle">&amp;</span> Lody
                </p>
              </div>
            </motion.div>

            {/* POCKET — left, right, bottom folds with gold foil seams */}
            <Fold
              z={30}
              clip="polygon(0 0, 50.5% 50.5%, 0 100%)"
              bg="linear-gradient(100deg, #241a0d 0%, #191108 70%)"
              shade="linear-gradient(100deg, rgba(255,231,170,0.10), transparent 45%)"
            />
            <Fold
              z={30}
              clip="polygon(100% 0, 49.5% 50.5%, 100% 100%)"
              bg="linear-gradient(260deg, #241a0d 0%, #191108 70%)"
              shade="linear-gradient(260deg, rgba(255,231,170,0.10), transparent 45%)"
            />
            <Fold
              z={31}
              clip="polygon(0 100%, 50% 49%, 100% 100%)"
              bg="linear-gradient(to top, #2a1e0e 0%, #1c1309 80%)"
              shade="linear-gradient(to top, rgba(255,231,170,0.07), transparent 55%)"
            />

            {/* FLAP — swings open in real perspective */}
            <motion.div
              initial={false}
              animate={{ rotateX: stage === "closed" ? 0 : -178 }}
              transition={{ duration: 1.0, ease: [0.6, 0.05, 0.25, 1] }}
              onAnimationComplete={() => {
                if (stage === "flap") setStage("rise");
              }}
              className="absolute inset-x-0 top-0 h-full"
              style={{
                zIndex: stage === "closed" || stage === "flap" ? 40 : 14,
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
            >
              {/* front face */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  clipPath: "polygon(0 0, 100% 0, 50% 56%)",
                  background:
                    "linear-gradient(to bottom, #2c1f0f 0%, #1f1509 78%)",
                  backgroundImage: `${NOISE}, linear-gradient(to bottom, #2c1f0f 0%, #1f1509 78%)`,
                }}
              >
                {/* gold seam on the flap edges */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 56%)",
                    background:
                      "linear-gradient(to bottom right, transparent 49.75%, rgba(222,190,120,0.55) 50%, transparent 50.4%), linear-gradient(to bottom left, transparent 49.75%, rgba(222,190,120,0.55) 50%, transparent 50.4%)",
                  }}
                />
              </div>
              {/* back face (interior of the flap) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                  clipPath: "polygon(0 0, 100% 0, 50% 56%)",
                  background:
                    "linear-gradient(to bottom, #120c06 0%, #1b1209 80%)",
                }}
              />

              {/* WAX SEAL — real typography, embossed */}
              <div
                className="absolute left-1/2 top-[56%] flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                style={{
                  backfaceVisibility: "hidden",
                  background:
                    "radial-gradient(circle at 32% 28%, #f7e3ae 0%, #dcb765 34%, #b8903c 62%, #8f6a24 100%)",
                  boxShadow:
                    "0 6px 16px rgba(0,0,0,0.55), inset 0 2px 4px rgba(255,244,200,0.65), inset 0 -3px 6px rgba(70,48,10,0.55)",
                }}
              >
                {/* engraved ring */}
                <div
                  className="absolute inset-[7px] rounded-full"
                  style={{
                    boxShadow:
                      "inset 0 1px 2px rgba(80,55,12,0.6), inset 0 -1px 1px rgba(255,240,190,0.5)",
                  }}
                />
                <span
                  className="font-script text-[30px] leading-none"
                  style={{
                    color: "#5d431a",
                    textShadow:
                      "0 1px 0 rgba(255,243,200,0.55), 0 -1px 1px rgba(60,40,8,0.6)",
                  }}
                >
                  R&amp;L
                </span>
              </div>
            </motion.div>

            {/* Moving sheen — light glides across the paper as you tilt */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[10px]"
              style={{
                zIndex: 45,
                x: sheenX,
                background:
                  "linear-gradient(115deg, transparent 30%, rgba(255,238,190,0.075) 46%, rgba(255,238,190,0.16) 50%, rgba(255,238,190,0.075) 54%, transparent 70%)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: stage === "closed" ? 1 : 0, y: 0 }}
        transition={
          stage === "closed"
            ? { delay: 0.6, duration: 0.9 }
            : { duration: 0.25 }
        }
        className="animate-breathe mt-14 font-sans text-[11px] uppercase tracking-[0.45em] text-gold-soft"
      >
        Tap the seal to open
      </motion.p>
    </div>
  );
}

function Fold({
  z,
  clip,
  bg,
  shade,
}: {
  z: number;
  clip: string;
  bg: string;
  shade: string;
}) {
  return (
    <div
      className="absolute inset-0 rounded-[10px]"
      style={{
        zIndex: z,
        clipPath: clip,
        background: bg,
        backgroundImage: `${NOISE}, ${shade}, ${bg}`,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
      }}
    />
  );
}
