import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Lightformer, ContactShadows, Outlines, Billboard } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { readScenePalette, type ScenePalette } from "@/game/scene-palette";
import { DEVICES, type Device, type Part } from "@/game/devices";

function SoftBox({ dimensions }: { dimensions: number[] }) {
  const [w = 1, h = 1, d = 1] = dimensions;
  const geometry = useMemo(() => new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.18), [w, h, d]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <primitive object={geometry} attach="geometry" />;
}

function Geo({ part }: { part: Part }) {
  const a = part.a as never[];
  switch (part.s) {
    case "box": return <SoftBox dimensions={part.a} />;
    case "cyl": return <cylinderGeometry args={a as unknown as [number, number, number, number]} />;
    case "sphere": return <sphereGeometry args={a as unknown as [number, number, number]} />;
    // openEnded=false: la pantalla de la lámpara (y conos similares) sí reciben raycast
    case "cone": return <coneGeometry args={[part.a[0], part.a[1], part.a[2] ?? 24, part.a[3] ?? 1, false]} />;
    case "torus": return <torusGeometry args={a as unknown as [number, number, number, number]} />;
  }
}

function DeviceObj({ d, selected, onToggle, locked, palette }: { d: Device; selected: boolean; onToggle: () => void; locked: boolean; palette: ScenePalette }) {
  const g = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const { badgeY, hitSize, hitCenter } = useMemo(() => {
    let minY = 0;
    let maxY = 0.6;
    let maxXZ = 0.4;
    for (const p of d.parts) {
      const py = p.p?.[1] ?? 0;
      const px = p.p?.[0] ?? 0;
      const pz = p.p?.[2] ?? 0;
      let hy = 0.4;
      let rxz = 0.3;
      if (p.s === "box") {
        hy = p.a[1];
        rxz = Math.max(p.a[0], p.a[2]) / 2;
      } else if (p.s === "cyl" || p.s === "cone") {
        hy = p.a[2];
        rxz = Math.max(p.a[0], p.a[1] ?? p.a[0]);
      } else if (p.s === "sphere") {
        hy = p.a[0] * 2;
        rxz = p.a[0];
      } else if (p.s === "torus") {
        hy = (p.a[0] + p.a[1]) * 2;
        rxz = p.a[0] + p.a[1];
      }
      minY = Math.min(minY, py - hy / 2);
      maxY = Math.max(maxY, py + hy / 2);
      maxXZ = Math.max(maxXZ, Math.hypot(px, pz) + rxz);
    }
    const height = Math.max(0.8, maxY - minY + 0.2);
    return {
      badgeY: maxY + 0.4,
      hitSize: [Math.max(0.9, maxXZ * 2.2), height, Math.max(0.9, maxXZ * 2.2)] as [number, number, number],
      hitCenter: [0, minY + height / 2, 0] as [number, number, number],
    };
  }, [d.parts]);

  useFrame((s, dt) => {
    if (!g.current) return;
    const k = 1 - Math.exp(-12 * Math.min(dt, 0.05));
    const target = hover ? 1.35 : selected ? 1.22 : 1.15;
    const sc = g.current.scale.x + (target - g.current.scale.x) * k;
    g.current.scale.setScalar(sc);
    const bob = hover ? Math.sin(s.clock.elapsedTime * 6) * 0.08 + 0.2 : selected ? 0.08 : 0;
    g.current.position.y += (d.pos[1] + bob - g.current.position.y) * k;
    g.current.rotation.y = (d.rotY ?? 0) + (hover ? Math.sin(s.clock.elapsedTime * 3) * 0.25 : 0);
    for (const m of mats.current) {
      if (!m) continue;
      const base = m.userData["e"] as string | undefined;
      if (hover) {
        m.emissive.set(palette.hover);
        m.emissiveIntensity = 0.65;
      } else if (selected) {
        m.emissive.set(palette.selected);
        m.emissiveIntensity = 0.55;
      } else {
        m.emissive.set(base ?? palette.ink);
        m.emissiveIntensity = base ? 0.8 : 0;
      }
    }
  });

  const showLabel = hover || selected;

  return (
    <group
      ref={g}
      position={d.pos}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); if (!locked) onToggle(); }}
    >
      {/* Hitbox transparente: R3F ignora visible=false; hace clicables objetos altos/finos */}
      <mesh position={hitCenter}>
        <boxGeometry args={hitSize} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {d.parts.map((p, i) => (
        <mesh key={i} position={p.p ?? [0, 0, 0]} rotation={p.r ?? [0, 0, 0]} castShadow>
          <Geo part={p} />
          <meshStandardMaterial
            ref={(m) => { if (m) { m.userData["e"] = p.e ? palette[p.e] : undefined; mats.current[i] = m; } }}
            color={palette[p.c]}
            roughness={0.32}
            metalness={p.c === "silver" ? 0.5 : 0.12}
          />
          {selected && (
            <Outlines thickness={3.5} color={palette.selected} transparent opacity={1} toneMapped={false} />
          )}
          {hover && !selected && (
            <Outlines thickness={2.2} color={palette.hover} transparent opacity={0.95} toneMapped={false} />
          )}
        </mesh>
      ))}

      {selected && (
        <mesh position={[0, 0.04 - Math.min(d.pos[1], 0.2), 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.78, 48]} />
          <meshBasicMaterial color={palette.selected} transparent opacity={0.95} depthWrite={false} />
        </mesh>
      )}

      {selected && (
        <Billboard position={[0, badgeY, 0]}>
          <Html center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }} distanceFactor={12}>
            <div className="pick-badge" aria-hidden>✓</div>
          </Html>
        </Billboard>
      )}

      {showLabel && (
        <Html zIndexRange={[15, 0]} position={[0, badgeY + (selected ? 0.55 : 0.2), 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="panel max-w-[12rem] px-2.5 py-1.5 text-center text-xs font-semibold text-foreground sm:max-w-none sm:whitespace-nowrap sm:px-3 sm:text-sm">
            {d.nombre}{selected ? " · marcado" : ""}
          </div>
        </Html>
      )}
    </group>
  );
}

function woodTexture(palette: ScenePalette) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  if (!x) return new THREE.CanvasTexture(c);
  for (let i = 0; i < 8; i++) {
    x.fillStyle = i % 2 ? palette["wood-light"] : palette.wood;
    x.fillRect(0, i * 32, 256, 32);
    x.strokeStyle = palette["wood-dark"];
    x.strokeRect(0, i * 32, 256, 32);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 4);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function tileTexture(a: string, b: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d");
  if (!x) return new THREE.CanvasTexture(c);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? a : b; x.fillRect(i * 32, j * 32, 32, 32); }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 3);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const Box = ({ p, s, c }: { p: [number, number, number]; s: [number, number, number]; c: string }) => (
  <mesh position={p} castShadow receiveShadow>
    <SoftBox dimensions={s} />
    <meshStandardMaterial color={c} roughness={0.8} />
  </mesh>
);

function House({ locked, palette }: { locked: boolean; palette: ScenePalette }) {
  const wood = useMemo(() => woodTexture(palette), [palette]);
  const tile = useMemo(() => tileTexture(palette.tile, palette["tile-alt"]), [palette]);
  const carpet = useMemo(() => tileTexture(palette.carpet, palette["carpet-alt"]), [palette]);
  useEffect(() => () => { wood.dispose(); tile.dispose(); carpet.dispose(); }, [wood, tile, carpet]);
  const W = palette.wall;
  const H = 2.6;
  return (
    <group>
      {/* césped */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 50]} />
        <meshStandardMaterial color={palette["grass"]} roughness={1} />
      </mesh>
      {/* pisos */}
      {[
        { x: -5, z: 3.5, t: wood }, { x: 5, z: 3.5, t: tile }, { x: -5, z: -3.5, t: carpet }, { x: 5, z: -3.5, t: wood },
      ].map((f, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[f.x, 0, f.z]} receiveShadow>
          <planeGeometry args={[10, 7]} />
          <meshStandardMaterial map={f.t} roughness={0.7} />
        </mesh>
      ))}
      {/* muros exteriores */}
      <Box p={[0, H / 2, 7.1]} s={[20.4, H, 0.2]} c={W} />
      <Box p={[0, H / 2, -7.1]} s={[20.4, H, 0.2]} c={W} />
      <Box p={[-10.1, H / 2, 0]} s={[0.2, H, 14.4]} c={W} />
      <Box p={[10.1, H / 2, 0]} s={[0.2, H, 14.4]} c={W} />
      {/* muros interiores con puertas */}
      <Box p={[0, H / 2, 5]} s={[0.15, H, 4]} c={W} />
      <Box p={[0, H / 2, -4.5]} s={[0.15, H, 5]} c={W} />
      <Box p={[-7, H / 2, 0]} s={[6, H, 0.15]} c={W} />
      <Box p={[7, H / 2, 0]} s={[6, H, 0.15]} c={W} />
      {/* SALA: sofá, mesa, TV */}
      <Box p={[-6, 0.35, 5.6]} s={[4, 0.7, 1.2]} c={palette["coral"]} />
      <Box p={[-6, 0.8, 6.3]} s={[4, 0.9, 0.3]} c={palette["coral-dark"]} />
      <Box p={[-6, 0.3, 3.8]} s={[2.4, 0.6, 1.2]} c={palette["wood"]} />
      <Box p={[-6.8, 0.3, 1.3]} s={[5, 0.6, 0.7]} c={palette["wood-dark"]} />
      <Box p={[-6.8, 1.1, 1.0]} s={[2.6, 1.3, 0.1]} c={palette["ink"]} />
      {/* COCINA: mesones, mesa */}
      <Box p={[5, 0.4, 0.8]} s={[7, 0.8, 1.2]} c={palette["cyan"]} />
      <Box p={[5, 0.82, 0.8]} s={[7, 0.05, 1.25]} c={palette["white"]} />
      <Box p={[6.5, 0.38, 4.5]} s={[2.4, 0.08, 1.6]} c={palette["wood-light"]} />
      <Box p={[1, 0.2, 6]} s={[1.2, 0.4, 1]} c={palette["yellow"]} />
      {/* DORMITORIO: cama, mesas */}
      <Box p={[-6, 0.3, -4.5]} s={[3.2, 0.6, 4]} c={palette["white"]} />
      <Box p={[-6, 0.62, -3.6]} s={[3.1, 0.06, 2.2]} c={palette["blue"]} />
      <Box p={[-6, 0.8, -6.3]} s={[3.2, 1, 0.3]} c={palette["wood"]} />
      <Box p={[-9, 0.35, -6]} s={[1, 0.7, 0.9]} c={palette["wood-light"]} />
      <Box p={[-3.6, 0.35, -6]} s={[1, 0.7, 0.9]} c={palette["wood-light"]} />
      {/* ESTUDIO: escritorio, silla, estante */}
      <Box p={[4, 0.38, -5.6]} s={[4, 0.76, 1.4]} c={palette["wood-light"]} />
      <Box p={[4, 0.3, -4.2]} s={[0.8, 0.6, 0.8]} c={palette["emerald"]} />
      <Box p={[6.2, 0.4, -1.2]} s={[1.4, 0.8, 0.9]} c={palette["wood"]} />
      <Box p={[1.0, 0.4, -2.2]} s={[1.2, 0.8, 0.9]} c={palette["wood-light"]} />
      {[
        { t: "Sala", p: [-3, 0.02, 2.6] }, { t: "Cocina", p: [5, 0.02, 2.6] }, { t: "Dormitorio", p: [-5, 0.02, -1.0] }, { t: "Estudio", p: [5, 0.02, -2.6] },
      ].filter(() => !locked).map((r) => (
        <Html zIndexRange={[5, 0]} key={r.t} position={r.p as [number, number, number]} center distanceFactor={18} style={{ pointerEvents: "none" }}>
          <span className="font-display text-base italic text-foreground/45 sm:text-2xl">{r.t}</span>
        </Html>
      ))}
    </group>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const narrow = size.width < 640;
    cam.fov = narrow ? 52 : 45;
    cam.position.set(0, narrow ? 24 : 20, narrow ? 14 : 11);
    cam.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

/** Orbit + pan lateral, con el target limitado para no salir de la casa. */
function PanLimitedControls() {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    c.target.x = THREE.MathUtils.clamp(c.target.x, -8, 8);
    c.target.z = THREE.MathUtils.clamp(c.target.z, -6, 6);
    c.target.y = THREE.MathUtils.clamp(c.target.y, 0, 2);
  });
  return (
    <OrbitControls
      ref={controls}
      target={[0, 0, 0]}
      enablePan
      screenSpacePanning
      panSpeed={1.1}
      minDistance={10}
      maxDistance={34}
      minPolarAngle={0.12}
      maxPolarAngle={1.05}
      enableDamping
      dampingFactor={0.08}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
    />
  );
}

export default function HouseScene({ selected, onToggle, locked }: { selected: Set<string>; onToggle: (id: string) => void; locked: boolean }) {
  const [palette, setPalette] = useState<ScenePalette | null>(null);
  useEffect(() => { setPalette(readScenePalette()); return () => { document.body.style.cursor = "auto"; }; }, []);
  if (!palette) return null;
  return (
    <div className="absolute inset-0 touch-none" data-house-scene>
      <Canvas shadows camera={{ position: [0, 20, 11], fov: 45 }} dpr={[1, 1.75]}>
        <color attach="background" args={[palette.sky]} />
        <ambientLight intensity={0.7} />
        <ReadySignal />
        <ResponsiveCamera />
        <directionalLight position={[8, 18, 6]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={12} shadow-camera-bottom={-12} />
        <Environment>
          <Lightformer intensity={1.5} position={[0, 6, 0]} scale={[12, 12, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={0.8} color={palette.white} position={[-6, 2, 4]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} />
        </Environment>
        <House locked={locked} palette={palette} />
        {DEVICES.map((d) => (
          <DeviceObj key={d.id} d={d} selected={selected.has(d.id)} onToggle={() => onToggle(d.id)} locked={locked} palette={palette} />
        ))}
        <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={22} blur={2} far={4} />
        <PanLimitedControls />
      </Canvas>
    </div>
  );
}

function ReadySignal() {
  const ready = useRef(false);
  useFrame(() => {
    if (ready.current) return;
    document.querySelector("[data-house-scene]")?.setAttribute("data-scene-ready", "true");
    ready.current = true;
  });
  return null;
}
