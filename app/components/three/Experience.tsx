"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, PresentationControls, Sparkles } from "@react-three/drei";

/**
 * Real WebGL 3D scene: a draggable envelope that opens in 3D space,
 * surrounded by gold sparkles floating in actual depth. Stays mounted
 * as a fixed background; the HTML journey scrolls on top once opened.
 */
export default function Experience({
  opening,
  open,
  onRequestOpen,
  onOpened,
}: {
  opening: boolean;
  open: boolean;
  onRequestOpen: () => void;
  onOpened: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: open ? "none" : "auto" }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6], fov: 38 }}
      >
        <Suspense fallback={null}>
          <Scene
            opening={opening}
            open={open}
            onRequestOpen={onRequestOpen}
            onOpened={onOpened}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({
  opening,
  open,
  onRequestOpen,
  onOpened,
}: {
  opening: boolean;
  open: boolean;
  onRequestOpen: () => void;
  onOpened: () => void;
}) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.9} color="#fff1d0" />
      <directionalLight position={[0, 0, 6]} intensity={0.4} color="#ffe7b8" />
      <pointLight position={[-5, 1, 4]} intensity={30} color="#ffcf86" />
      <pointLight position={[4, -3, -2]} intensity={16} color="#c8a24c" />
      {/* Rim light from behind to catch the envelope's gold edges */}
      <pointLight position={[0, 2, -4]} intensity={30} color="#ffd98a" />

      {/* Gold dust floating in true 3D */}
      <Sparkles
        count={120}
        scale={[14, 16, 8]}
        size={3}
        speed={0.3}
        opacity={0.8}
        color="#e6cd8a"
      />

      <Rig />

      {open ? null : !opening ? (
        <PresentationControls
          global
          snap
          damping={0.18}
          polar={[-0.3, 0.3]}
          azimuth={[-0.6, 0.6]}
        >
          <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5}>
            <Envelope opening={opening} onClick={onRequestOpen} onOpened={onOpened} />
          </Float>
        </PresentationControls>
      ) : (
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
          <Envelope opening={opening} onClick={onRequestOpen} onOpened={onOpened} />
        </Float>
      )}
    </>
  );
}

/** Subtle pointer parallax for the whole scene. */
function Rig() {
  useFrame((state, dt) => {
    const k = Math.min(1, dt * 2.2);
    state.camera.position.x += (state.pointer.x * 0.7 - state.camera.position.x) * k;
    state.camera.position.y += (state.pointer.y * 0.45 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Envelope({
  opening,
  onClick,
  onOpened,
}: {
  opening: boolean;
  onClick: () => void;
  onOpened: () => void;
}) {
  const flap = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const prog = useRef(0);
  const fired = useRef(false);

  const flapShape = useMemo(() => {
    const w = 3.2;
    const h = 1.12;
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, -h);
    s.lineTo(-w / 2, 0);
    return s;
  }, []);

  const pocketShape = useMemo(() => {
    const w = 3.2;
    const s = new THREE.Shape();
    s.moveTo(-w / 2, -1.05);
    s.lineTo(w / 2, -1.05);
    s.lineTo(0, 0.02);
    s.lineTo(-w / 2, -1.05);
    return s;
  }, []);

  useFrame((_, dt) => {
    const target = opening ? 1 : 0;
    prog.current = THREE.MathUtils.damp(prog.current, target, 3, dt);
    const p = prog.current;

    if (flap.current) flap.current.rotation.x = -2.5 * p;
    if (card.current) {
      card.current.position.y = -0.1 + 1.75 * p;
      card.current.position.z = 0.0 + 0.7 * p;
    }
    if (opening && !fired.current && p > 0.92) {
      fired.current = true;
      onOpened();
    }
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (!opening) onClick();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* Body */}
      <mesh>
        <boxGeometry args={[3.2, 2.1, 0.16]} />
        <meshStandardMaterial color="#2e2010" metalness={0.55} roughness={0.42} />
        <Edges threshold={15} color="#e6cd8a" />
      </mesh>

      {/* Card that rises out (hidden inside when closed) */}
      <group ref={card} position={[0, -0.1, 0]}>
        <mesh>
          <planeGeometry args={[2.5, 1.66]} />
          <meshStandardMaterial color="#caa44e" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[2.34, 1.5]} />
          <meshStandardMaterial color="#15110b" metalness={0.2} roughness={0.6} />
        </mesh>
      </group>

      {/* Front pocket V */}
      <mesh position={[0, 0, 0.082]}>
        <shapeGeometry args={[pocketShape]} />
        <meshStandardMaterial
          color="#241809"
          metalness={0.5}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
        <Edges threshold={1} color="#cdb06a" />
      </mesh>

      {/* Top flap (hinged at top edge) with the wax seal attached */}
      <group ref={flap} position={[0, 1.05, 0.085]}>
        <mesh>
          <shapeGeometry args={[flapShape]} />
          <meshStandardMaterial
            color="#33240f"
            metalness={0.55}
            roughness={0.45}
            side={THREE.DoubleSide}
          />
          <Edges threshold={1} color="#e6cd8a" />
        </mesh>
        {/* Wax seal near the apex */}
        <mesh position={[0, -1.0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.06, 48]} />
          <meshStandardMaterial
            color="#c8a24c"
            metalness={0.85}
            roughness={0.38}
            emissive="#4a3410"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, -1.0, 0.07]}>
          <torusGeometry args={[0.2, 0.018, 16, 48]} />
          <meshStandardMaterial color="#3a2a10" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
