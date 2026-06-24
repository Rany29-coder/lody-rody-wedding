"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Gives children a luxurious 3D tilt that follows the pointer (desktop)
 * and the device's gyroscope (phones). Wrap content you want to feel
 * like a physical card held in the hand.
 */
export default function Tilt({
  children,
  max = 9,
  className = "",
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  // normalized -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 140, damping: 16 });
  const sy = useSpring(py, { stiffness: 140, damping: 16 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  function handleMove(e: React.PointerEvent) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  useEffect(() => {
    function onOrient(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      // gamma: left/right tilt, beta: front/back tilt
      px.set(Math.max(-0.5, Math.min(0.5, e.gamma / 40)));
      py.set(Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 40)));
    }
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [px, py]);

  return (
    <div
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ perspective: 1200 }}
      className={className}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
