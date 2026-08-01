"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { wedding } from "../wedding-config";

/**
 * A hand-crafted cream envelope with gold foil. Tap the wax seal:
 * the flap swings back, a folded letter rises out, then unfolds like
 * a real folded paper (the couple's request) — no idle "dancing".
 */

// Subtle paper grain (inline SVG noise)
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0 0.25 0 0 0 0.04 0'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")";

type Stage = "closed" | "flap" | "rise" | "unfold" | "out";

export default function EnvelopeLetter({
  onOpened,
}: {
  onOpened: () => void;
}) {
  const [stage, setStage] = useState<Stage>("closed");
  const interactive = stage === "closed";

  // Pointer tilt while closed only
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

  const risen = stage === "rise" || stage === "unfold" || stage === "out";

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
            rotateX: interactive ? rotateX : 5,
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
              className="absolute inset-x-6 -bottom-10 h-16 rounded-[50%] blur-2xl"
              style={{ background: "rgba(130, 95, 40, 0.35)" }}
            />

            {/* Back panel */}
            <div
              className="absolute inset-0 rounded-[10px]"
              style={{
                zIndex: 10,
                background:
                  "linear-gradient(160deg, #f7f0e0 0%, #eee3ca 55%, #e3d5b4 100%)",
                boxShadow:
                  "0 34px 70px -22px rgba(140,105,45,0.5), 0 8px 20px rgba(140,105,45,0.28)",
              }}
            />

            {/* Interior (visible above the letter once the flap opens) */}
            <div
              className="absolute inset-x-[3px] top-[2px] h-1/2 rounded-t-[9px]"
              style={{
                zIndex: 12,
                background:
                  "linear-gradient(to bottom, #cdbd99 0%, #dccdab 70%, #e5d8b9 100%)",
                boxShadow: "inset 0 12px 20px rgba(120,90,40,0.35)",
              }}
            />

            {/* FOLDED LETTER — rises out, then unfolds downward */}
            <motion.div
              initial={false}
              animate={{ y: risen ? "-82%" : "0%" }}
              transition={{ duration: 1.1, ease: [0.24, 0.9, 0.3, 1] }}
              onAnimationComplete={() => {
                if (stage === "rise") setStage("unfold");
              }}
              className="absolute inset-x-[8%] top-[7%] bottom-[9%]"
              style={{
                zIndex: stage === "unfold" || stage === "out" ? 50 : 20,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Top half of the letter (visible when folded) */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-t-[6px] px-6 text-center"
                style={{
                  background:
                    "linear-gradient(175deg, #fffdf6 0%, #f8f1df 100%)",
                  backgroundImage: `${NOISE}, linear-gradient(175deg, #fffdf6 0%, #f8f1df 100%)`,
                  boxShadow:
                    "0 -5px 16px rgba(120,90,40,0.18), inset 0 0 0 1px rgba(168,128,46,0.35)",
                }}
              >
                <p
                  className="font-sans text-[9px] uppercase tracking-[0.42em]"
                  style={{ color: "#8a6a24" }}
                >
                  Wedding Invitation
                </p>
                <p
                  className="font-script mt-2 text-4xl leading-tight sm:text-5xl"
                  style={{ color: "#3a2c19" }}
                >
                  {wedding.groom}{" "}
                  <span className="align-middle text-2xl">&amp;</span>{" "}
                  {wedding.bride}
                </p>
              </div>

              {/* Bottom half — folded up over the front; unfolds downward */}
              <motion.div
                initial={false}
                animate={{ rotateX: stage === "unfold" || stage === "out" ? 0 : 180 }}
                transition={{ duration: 1.0, ease: [0.45, 0.05, 0.25, 1] }}
                onAnimationComplete={() => {
                  if (stage === "unfold") {
                    setStage("out");
                    setTimeout(onOpened, 450);
                  }
                }}
                className="absolute left-0 right-0 top-full h-full"
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* front face (revealed when unfolded): date + venue */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-b-[6px] px-6 text-center"
                  style={{
                    backfaceVisibility: "hidden",
                    background:
                      "linear-gradient(175deg, #f8f1df 0%, #f1e7cd 100%)",
                    backgroundImage: `${NOISE}, linear-gradient(175deg, #f8f1df 0%, #f1e7cd 100%)`,
                    boxShadow:
                      "0 10px 22px rgba(120,90,40,0.22), inset 0 0 0 1px rgba(168,128,46,0.35)",
                  }}
                >
                  <p
                    dir="ltr"
                    className="font-serif text-2xl tracking-wide"
                    style={{ color: "#3a2c19" }}
                  >
                    {wedding.dateShort}
                  </p>
                  <div
                    className="my-3 h-px w-16"
                    style={{ background: "rgba(168,128,46,0.45)" }}
                  />
                  <p
                    className="font-sans text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: "#8a6a24" }}
                  >
                    {wedding.venueName}
                  </p>
                </div>
                {/* back face (the cover you see while folded): small emblem */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-t-[6px]"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                    background:
                      "linear-gradient(175deg, #fffdf6 0%, #f6eeda 100%)",
                    backgroundImage: `${NOISE}, linear-gradient(175deg, #fffdf6 0%, #f6eeda 100%)`,
                    boxShadow: "inset 0 0 0 1px rgba(168,128,46,0.35)",
                  }}
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(168,128,46,0.5)",
                    }}
                  >
                    <span
                      className="font-script text-2xl"
                      style={{ color: "#a8802e" }}
                    >
                      R&amp;L
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* POCKET — left, right, bottom folds with gold foil seams */}
            <Fold
              z={30}
              clip="polygon(0 0, 50.5% 50.5%, 0 100%)"
              bg="linear-gradient(100deg, #f4ecd8 0%, #e9dcc0 70%)"
              shade="linear-gradient(100deg, rgba(255,252,240,0.7), transparent 45%)"
            />
            <Fold
              z={30}
              clip="polygon(100% 0, 49.5% 50.5%, 100% 100%)"
              bg="linear-gradient(260deg, #f4ecd8 0%, #e9dcc0 70%)"
              shade="linear-gradient(260deg, rgba(255,252,240,0.7), transparent 45%)"
            />
            <Fold
              z={31}
              clip="polygon(0 100%, 50% 49%, 100% 100%)"
              bg="linear-gradient(to top, #f6efdc 0%, #eadec2 80%)"
              shade="linear-gradient(to top, rgba(255,252,240,0.55), transparent 55%)"
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
                    "linear-gradient(to bottom, #f9f3e4 0%, #ecdfc2 78%)",
                  backgroundImage: `${NOISE}, linear-gradient(to bottom, #f9f3e4 0%, #ecdfc2 78%)`,
                }}
              >
                {/* gold seam on the flap edges */}
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 56%)",
                    background:
                      "linear-gradient(to bottom right, transparent 49.75%, rgba(168,128,46,0.55) 50%, transparent 50.4%), linear-gradient(to bottom left, transparent 49.75%, rgba(168,128,46,0.55) 50%, transparent 50.4%)",
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
                    "linear-gradient(to bottom, #e2d5b6 0%, #ecdfc4 80%)",
                }}
              />

              {/* WAX SEAL — embossed gold with real calligraphy */}
              <div
                className="absolute left-1/2 top-[56%] flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                style={{
                  backfaceVisibility: "hidden",
                  background:
                    "radial-gradient(circle at 32% 28%, #f7e3ae 0%, #dcb765 34%, #b8903c 62%, #8f6a24 100%)",
                  boxShadow:
                    "0 6px 16px rgba(120,88,30,0.45), inset 0 2px 4px rgba(255,244,200,0.65), inset 0 -3px 6px rgba(70,48,10,0.55)",
                }}
              >
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
                  "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 46%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.14) 54%, transparent 70%)",
                mixBlendMode: "soft-light",
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
        className={`${
          stage === "closed" ? "animate-breathe" : ""
        } mt-14 font-sans text-[11px] uppercase tracking-[0.45em] text-gold`}
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
        filter: "drop-shadow(0 2px 3px rgba(140,105,45,0.3))",
      }}
    />
  );
}
