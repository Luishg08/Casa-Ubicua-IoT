import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DEVICES, type Device, type Part } from "@/game/devices";
import { readScenePalette, type ScenePalette } from "@/game/scene-palette";
import type { ShopRound } from "@/game/shop";

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
    case "cone": return <coneGeometry args={[part.a[0], part.a[1], part.a[2] ?? 24, part.a[3] ?? 1, false]} />;
    case "torus": return <torusGeometry args={a as unknown as [number, number, number, number]} />;
  }
}

function ProductSlot({
  device,
  position,
  selected,
  locked,
  reveal,
  correct,
  palette,
  onChoose,
}: {
  device: Device;
  position: [number, number, number];
  selected: boolean;
  locked: boolean;
  reveal: boolean;
  correct: boolean;
  palette: ScenePalette;
  onChoose: () => void;
}) {
  const g = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame((s, dt) => {
    if (!g.current) return;
    const k = 1 - Math.exp(-10 * Math.min(dt, 0.05));
    const target = hover && !locked ? 1.15 : selected ? 1.1 : 1;
    const sc = g.current.scale.x + (target - g.current.scale.x) * k;
    g.current.scale.setScalar(sc);
    g.current.rotation.y += dt * (hover ? 1.2 : 0.35);
    for (const m of mats.current) {
      if (!m) continue;
      const base = m.userData["e"] as string | undefined;
      if (reveal && correct) {
        m.emissive.set(palette.emerald);
        m.emissiveIntensity = 0.7;
      } else if (reveal && selected && !correct) {
        m.emissive.set(palette["coral-dark"]);
        m.emissiveIntensity = 0.65;
      } else if (hover && !locked) {
        m.emissive.set(palette.hover);
        m.emissiveIntensity = 0.55;
      } else if (selected) {
        m.emissive.set(palette.selected);
        m.emissiveIntensity = 0.5;
      } else {
        m.emissive.set(base ?? palette.ink);
        m.emissiveIntensity = base ? 0.75 : 0;
      }
    }
  });

  const ringColor = reveal && correct
    ? palette.emerald
    : reveal && selected
      ? palette["coral-dark"]
      : selected || hover
        ? palette.selected
        : palette.wood;

  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.62, 0.16, 24]} />
        <meshStandardMaterial color={palette.wood} roughness={0.55} />
      </mesh>
      {/* Anillo fino de selección (evita el outline gigante de Outlines) */}
      {(hover || selected || reveal) && (
        <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.58, 32]} />
          <meshStandardMaterial
            color={ringColor}
            emissive={ringColor}
            emissiveIntensity={selected || reveal ? 0.85 : 0.45}
            toneMapped={false}
          />
        </mesh>
      )}
      <group
        ref={g}
        position={[0, 0.35, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!locked) {
            setHover(true);
            document.body.style.cursor = "pointer";
          }
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!locked) onChoose();
        }}
      >
        {device.parts.map((p, i) => (
          <mesh
            key={i}
            position={p.p ?? [0, 0, 0]}
            rotation={p.r ?? [0, 0, 0]}
            castShadow
          >
            <Geo part={p} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) {
                  mats.current[i] = m;
                  if (p.e) m.userData["e"] = palette[p.e];
                }
              }}
              color={palette[p.c]}
              roughness={0.45}
              metalness={p.c === "silver" ? 0.55 : 0.08}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Customer({ palette }: { palette: ScenePalette }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.position.y = Math.sin(s.clock.elapsedTime * 2) * 0.04;
  });
  return (
    <group ref={g} position={[0, 0, 2.4]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.7, 6, 12]} />
        <meshStandardMaterial color={palette.coral} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color={palette.white} roughness={0.6} />
      </mesh>
    </group>
  );
}

function ShopRoom({ palette }: { palette: ScenePalette }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={palette.tile} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.2, -3.2]} receiveShadow>
        <boxGeometry args={[12, 4.4, 0.25]} />
        <meshStandardMaterial color={palette.wall} roughness={0.9} />
      </mesh>
      {/* Estantería decorativa */}
      <mesh position={[0, 1.6, -2.95]} castShadow>
        <boxGeometry args={[9, 0.12, 0.5]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
      <mesh position={[0, 0.9, -2.95]} castShadow>
        <boxGeometry args={[9, 0.12, 0.5]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
      {/* Mostrador */}
      <mesh position={[0, 0.45, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 0.9, 1.4]} />
        <meshStandardMaterial color={palette["wood-dark"]} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.95, 0.2]} castShadow>
        <boxGeometry args={[7.4, 0.08, 1.55]} />
        <meshStandardMaterial color={palette.wood} roughness={0.4} />
      </mesh>
    </group>
  );
}

const SLOT_X = [-2.4, -0.8, 0.8, 2.4] as const;

export default function ShopScene({
  round,
  locked,
  choiceId,
  onChoose,
}: {
  round: ShopRound;
  locked: boolean;
  choiceId: string | null;
  onChoose: (optionId: string) => void;
}) {
  const [palette, setPalette] = useState<ScenePalette | null>(null);
  useEffect(() => {
    setPalette(readScenePalette());
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  const products = useMemo(
    () =>
      round.opciones.map((opt) => {
        const device = DEVICES.find((d) => d.id === opt.id);
        return { opt, device };
      }),
    [round],
  );

  if (!palette) return null;

  return (
    <div className="absolute inset-0 touch-none" data-shop-scene>
      <Canvas shadows camera={{ position: [0, 4.2, 7.5], fov: 42 }} dpr={[1, 1.6]}>
        <color attach="background" args={[palette.sky]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 10, 5]} intensity={1.35} castShadow shadow-mapSize={[1024, 1024]} />
        <Environment>
          <Lightformer intensity={1.2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        </Environment>
        <ShopRoom palette={palette} />
        <Customer palette={palette} />
        {products.map(({ opt, device }, i) =>
          device ? (
            <ProductSlot
              key={`${round.id}-${opt.id}`}
              device={device}
              position={[SLOT_X[i]!, 1.0, 0.15]}
              selected={choiceId === opt.id}
              locked={locked}
              reveal={locked && choiceId !== null}
              correct={opt.id === round.correcta}
              palette={palette}
              onChoose={() => onChoose(opt.id)}
            />
          ) : null,
        )}
        <ContactShadows position={[0, 0.02, 0]} opacity={0.28} scale={14} blur={2.2} far={4} />
      </Canvas>
    </div>
  );
}
