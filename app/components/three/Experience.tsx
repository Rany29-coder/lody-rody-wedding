"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Lightformer,
  PresentationControls,
  Sparkles,
} from "@react-three/drei";

/**
 * Realistic WebGL 3D envelope. Beveled paper flaps form the classic
 * envelope diamond, a metallic gold wax seal reflects a studio
 * environment, and a cream card lifts out on open. Stays mounted as a
 * fixed background; the HTML journey scrolls on top once opened.
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
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 1.05 }}
        camera={{ position: [0, 0.2, 6.4], fov: 34 }}
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
      {/* Soft diffuse fills */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#fff1d6" />
      <directionalLight position={[-4, 2, 3]} intensity={0.5} color="#ffd98a" />

      {/* Studio environment — gives the gold real reflections (no external file) */}
      <Environment resolution={256}>
        <color attach="background" args={["#0a0806"]} />
        <Lightformer
          intensity={3}
          color="#fff3d6"
          position={[0, 4, 3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[9, 4, 1]}
        />
        <Lightformer
          intensity={1.8}
          color="#ffce82"
          position={[-5, 2, 2]}
          scale={[3, 5, 1]}
        />
        <Lightformer
          intensity={1.4}
          color="#c8a24c"
          position={[5, -1, 2]}
          scale={[3, 5, 1]}
        />
        <Lightformer
          intensity={0.7}
          color="#ffffff"
          position={[0, -3, 3]}
          scale={[7, 2, 1]}
        />
      </Environment>

      {/* Gold dust in true 3D depth */}
      <Sparkles
        count={110}
        scale={[14, 16, 8]}
        size={3}
        speed={0.28}
        opacity={0.75}
        color="#e6cd8a"
      />

      <Rig />

      {open ? null : !opening ? (
        <PresentationControls
          global
          snap
          damping={0.18}
          rotation={[-0.12, -0.32, 0]}
          polar={[-0.35, 0.35]}
          azimuth={[-0.6, 0.6]}
        >
          <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.4}>
            <Envelope opening={opening} onClick={onRequestOpen} onOpened={onOpened} />
          </Float>
        </PresentationControls>
      ) : (
        <group rotation={[-0.12, -0.32, 0]}>
          <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.35}>
            <Envelope opening={opening} onClick={onRequestOpen} onOpened={onOpened} />
          </Float>
        </group>
      )}
    </>
  );
}

/** Subtle pointer parallax for the whole scene. */
function Rig() {
  useFrame((state, dt) => {
    const k = Math.min(1, dt * 2.2);
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * k;
    state.camera.position.y +=
      (0.2 + state.pointer.y * 0.4 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// Envelope dimensions
const W = 3.2;
const H = 2.16;

// Reusable materials
function useMaterials() {
  return useMemo(() => {
    const paper = new THREE.MeshStandardMaterial({
      color: "#171009",
      metalness: 0.25,
      roughness: 0.72,
    });
    const paperLit = new THREE.MeshStandardMaterial({
      color: "#221708",
      metalness: 0.3,
      roughness: 0.66,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: "#caa24c",
      metalness: 1,
      roughness: 0.28,
    });
    const wax = new THREE.MeshStandardMaterial({
      color: "#b8902f",
      metalness: 0.9,
      roughness: 0.34,
      emissive: new THREE.Color("#3a2806"),
      emissiveIntensity: 0.3,
    });
    const cream = new THREE.MeshStandardMaterial({
      color: "#efe6d2",
      metalness: 0.05,
      roughness: 0.85,
    });
    return { paper, paperLit, gold, wax, cream };
  }, []);
}

const extrude = (depth: number, bevel = 0.012) => ({
  depth,
  bevelEnabled: true,
  bevelThickness: bevel,
  bevelSize: bevel,
  bevelSegments: 2,
});

function tri(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  const s = new THREE.Shape();
  s.moveTo(ax, ay);
  s.lineTo(bx, by);
  s.lineTo(cx, cy);
  s.lineTo(ax, ay);
  return s;
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
  const m = useMaterials();

  const shapes = useMemo(() => {
    const panel = new THREE.Shape();
    panel.moveTo(-W / 2, -H / 2);
    panel.lineTo(W / 2, -H / 2);
    panel.lineTo(W / 2, H / 2);
    panel.lineTo(-W / 2, H / 2);
    panel.lineTo(-W / 2, -H / 2);
    return {
      panel,
      bottom: tri(-W / 2, -H / 2, W / 2, -H / 2, 0, 0.12),
      left: tri(-W / 2, -H / 2, -W / 2, H / 2, 0, 0),
      right: tri(W / 2, -H / 2, W / 2, H / 2, 0, 0),
      top: tri(-W / 2, 0, W / 2, 0, 0, -H / 2 - 0.04), // hinge at y=0 of its group
    };
  }, []);

  useFrame((_, dt) => {
    const target = opening ? 1 : 0;
    prog.current = THREE.MathUtils.damp(prog.current, target, 3, dt);
    const p = prog.current;
    if (flap.current) flap.current.rotation.x = -2.55 * p;
    if (card.current) {
      card.current.position.y = -0.05 + 1.85 * p;
      card.current.position.z = 0.05 + 0.8 * p;
      card.current.rotation.x = -0.12 * p;
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
      {/* Back panel */}
      <mesh material={m.paper} position={[0, 0, -0.05]} castShadow receiveShadow>
        <extrudeGeometry args={[shapes.panel, extrude(0.05, 0.02)]} />
      </mesh>

      {/* Cream card (hidden inside, rises on open) */}
      <group ref={card} position={[0, -0.05, 0.05]}>
        <mesh material={m.cream} castShadow>
          <boxGeometry args={[W - 0.34, H - 0.34, 0.03]} />
        </mesh>
        {/* gold inner border */}
        <lineSegments position={[0, 0, 0.02]}>
          <edgesGeometry
            args={[new THREE.PlaneGeometry(W - 0.62, H - 0.62)]}
          />
          <lineBasicMaterial color="#b8902f" />
        </lineSegments>
      </group>

      {/* Static folded flaps: bottom + sides (form the diamond) */}
      <mesh material={m.paperLit} position={[0, 0, 0.045]}>
        <extrudeGeometry args={[shapes.bottom, extrude(0.022)]} />
      </mesh>
      <mesh material={m.paper} position={[0, 0, 0.05]}>
        <extrudeGeometry args={[shapes.left, extrude(0.022)]} />
      </mesh>
      <mesh material={m.paper} position={[0, 0, 0.05]}>
        <extrudeGeometry args={[shapes.right, extrude(0.022)]} />
      </mesh>

      {/* Top flap (hinged at top edge) with wax seal */}
      <group ref={flap} position={[0, H / 2, 0.06]}>
        <mesh material={m.paperLit}>
          <extrudeGeometry args={[shapes.top, extrude(0.024)]} />
        </mesh>
        {/* Wax seal near the apex (travels with the flap) */}
        <group position={[0, -H / 2 + 0.02, 0.05]}>
          {/* wax disc facing the camera */}
          <mesh material={m.wax} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.07, 64]} />
          </mesh>
          {/* domed top */}
          <mesh material={m.wax} position={[0, 0, 0.05]} scale={[1, 1, 0.5]}>
            <sphereGeometry args={[0.24, 32, 16]} />
          </mesh>
          {/* gold emblem ring */}
          <mesh material={m.gold} position={[0, 0, 0.085]}>
            <torusGeometry args={[0.13, 0.012, 16, 48]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
