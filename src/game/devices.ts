import type { SceneRole } from "@/game/scene-palette";

export type Shape = "box" | "cyl" | "sphere" | "cone" | "torus";
export interface Part {
  s: Shape;
  a: number[]; // geometry args
  p?: [number, number, number];
  r?: [number, number, number];
  c: SceneRole;
  e?: SceneRole; // emissive (LEDs, pantallas)
}
export interface Device {
  id: string;
  nombre: string;
  ubicuo: boolean;
  cuarto: string;
  pos: [number, number, number];
  rotY?: number;
  parts: Part[];
  porque: string;
}

const led = (p: [number, number, number], e: SceneRole = "cyan"): Part => ({ s: "sphere", a: [0.07, 12, 12], p, c: e, e });

export const DEVICES: Device[] = [
  // ---------- SALA (x -10..0, z 0..7)
  {
    id: "altavoz", nombre: "Altavoz inteligente", ubicuo: true, cuarto: "Sala", pos: [-8.6, 0.9, 1.4],
    parts: [{ s: "cyl", a: [0.35, 0.4, 0.7, 24], c: "ink" }, { s: "torus", a: [0.3, 0.05, 8, 24], p: [0, 0.36, 0], r: [Math.PI / 2, 0, 0], c: "cyan", e: "cyan" }],
    porque: "Escucha comandos de voz, se conecta a Internet y controla otros dispositivos del hogar: interacción natural y contextual.",
  },
  {
    id: "radio", nombre: "Radio analógica", ubicuo: false, cuarto: "Sala", pos: [-5.2, 0.9, 1.3],
    parts: [{ s: "box", a: [0.9, 0.55, 0.35], c: "coral" }, { s: "cyl", a: [0.17, 0.17, 0.05, 20], p: [-0.2, 0, 0.18], r: [Math.PI / 2, 0, 0], c: "wood" }, { s: "cyl", a: [0.03, 0.03, 0.7, 6], p: [0.35, 0.6, 0], r: [0, 0, -0.4], c: "silver" }],
    porque: "Solo recibe señal de radio AM/FM. No procesa datos, no se conecta a una red ni percibe el contexto.",
  },
  {
    id: "termostato", nombre: "Termostato inteligente", ubicuo: true, cuarto: "Sala", pos: [-9.6, 1.6, 4.5], rotY: Math.PI / 2,
    parts: [{ s: "cyl", a: [0.35, 0.35, 0.12, 32], r: [Math.PI / 2, 0, 0], c: "white" }, { s: "cyl", a: [0.26, 0.26, 0.13, 32], r: [Math.PI / 2, 0, 0], c: "coral", e: "coral" }],
    porque: "Mide la temperatura con microsensores, aprende tus horarios y ajusta el clima automáticamente vía Wi‑Fi.",
  },
  {
    id: "reloj", nombre: "Reloj de pared analógico", ubicuo: false, cuarto: "Sala", pos: [-3.5, 1.6, 6.7],
    parts: [{ s: "cyl", a: [0.45, 0.45, 0.08, 32], r: [Math.PI / 2, 0, 0], c: "white" }, { s: "torus", a: [0.45, 0.05, 8, 32], c: "coral" }, { s: "box", a: [0.04, 0.3, 0.02], p: [0, 0.12, 0.05], c: "ink" }],
    porque: "Es un mecanismo que marca la hora; no sensa, no se comunica ni se adapta al usuario.",
  },
  {
    id: "camara", nombre: "Cámara de seguridad IP", ubicuo: true, cuarto: "Sala", pos: [-0.6, 2.2, 6.4],
    parts: [{ s: "sphere", a: [0.32, 20, 20], c: "white" }, { s: "cyl", a: [0.15, 0.15, 0.12, 20], p: [0, -0.05, 0.28], r: [Math.PI / 2, 0, 0], c: "ink" }, led([0.18, 0.15, 0.25], "coral")],
    porque: "Detecta movimiento, transmite video por la red y envía alertas al celular en cualquier lugar y momento.",
  },
  {
    id: "control", nombre: "Control remoto infrarrojo", ubicuo: false, cuarto: "Sala", pos: [-6.4, 0.75, 4.0], rotY: 0.6,
    parts: [{ s: "box", a: [0.25, 0.08, 0.8], c: "ink" }, { s: "box", a: [0.15, 0.03, 0.1], p: [0, 0.05, -0.25], c: "coral" }],
    porque: "Envía un pulso infrarrojo de una sola vía. No está conectado a una red ni recolecta información del entorno.",
  },
  {
    id: "lampara", nombre: "Lámpara de pie convencional", ubicuo: false, cuarto: "Sala", pos: [-9.0, 0, 6.2],
    parts: [
      { s: "cyl", a: [0.3, 0.35, 0.08, 20], p: [0, 0.05, 0], c: "wood" },
      { s: "cyl", a: [0.04, 0.04, 2, 8], p: [0, 1.05, 0], c: "wood" },
      // Pantalla cerrada (openEnded lo maneja Geo); radio un poco mayor para que se vea y se pueda tocar
      { s: "cone", a: [0.55, 0.7, 24, 1], p: [0, 2.15, 0], c: "wood" },
    ],
    porque: "Se prende con un interruptor manual. No tiene sensores ni conectividad.",
  },
  {
    id: "enchufe", nombre: "Enchufe inteligente Wi‑Fi", ubicuo: true, cuarto: "Sala", pos: [-1.5, 0.5, 0.4],
    parts: [{ s: "box", a: [0.4, 0.5, 0.25], c: "white" }, led([0, 0.15, 0.13], "emerald")],
    porque: "Mide consumo eléctrico y permite programar o apagar aparatos desde el celular: sostenibilidad y conectividad.",
  },
  // ---------- COCINA (x 0..10, z 0..7)
  {
    id: "nevera", nombre: "Nevera inteligente con pantalla", ubicuo: true, cuarto: "Cocina", pos: [9.0, 0, 1.2],
    parts: [{ s: "box", a: [1.2, 2.4, 1], p: [0, 1.2, 0], c: "white" }, { s: "box", a: [0.5, 0.6, 0.02], p: [-0.2, 1.6, 0.51], c: "ink", e: "blue" }],
    porque: "Inventaría alimentos con cámaras/RFID, avisa caducidades y se conecta a Internet para hacer pedidos.",
  },
  {
    id: "microondas", nombre: "Microondas convencional", ubicuo: false, cuarto: "Cocina", pos: [6.0, 1.15, 0.8],
    parts: [{ s: "box", a: [1.1, 0.6, 0.7], c: "white" }, { s: "box", a: [0.65, 0.45, 0.02], p: [-0.15, 0, 0.36], c: "ink" }, { s: "box", a: [0.18, 0.12, 0.02], p: [0.38, 0.12, 0.36], c: "emerald", e: "emerald" }],
    porque: "Tiene pantalla y botones, pero solo ejecuta un temporizador local; no se comunica ni se adapta al contexto.",
  },
  {
    id: "tostadora", nombre: "Tostadora", ubicuo: false, cuarto: "Cocina", pos: [3.2, 1.05, 0.8],
    parts: [{ s: "box", a: [0.7, 0.45, 0.45], c: "coral" }, { s: "box", a: [0.4, 0.04, 0.08], p: [0, 0.23, 0.08], c: "ink" }, { s: "box", a: [0.4, 0.04, 0.08], p: [0, 0.23, -0.08], c: "ink" }],
    porque: "Aparato eléctrico simple con perilla mecánica, sin sensores ni red.",
  },
  {
    id: "aspiradora", nombre: "Robot aspirador", ubicuo: true, cuarto: "Cocina", pos: [4.5, 0.15, 4.5],
    parts: [{ s: "cyl", a: [0.6, 0.6, 0.22, 32], c: "ink" }, { s: "cyl", a: [0.18, 0.18, 0.24, 20], p: [0, 0.02, -0.2], c: "silver" }, led([0, 0.13, 0.3], "cyan")],
    porque: "Mapea la casa con sensores, decide su ruta de forma autónoma y se controla desde la nube.",
  },
  {
    id: "humo", nombre: "Detector de humo a pilas", ubicuo: false, cuarto: "Cocina", pos: [7.5, 2.2, 6.5],
    parts: [{ s: "cyl", a: [0.35, 0.35, 0.12, 32], r: [Math.PI / 2, 0, 0], c: "white" }, led([0, 0.1, 0.07], "coral")],
    porque: "Suena localmente cuando detecta humo, pero no está conectado ni comparte información con otros sistemas.",
  },
  {
    id: "rfid", nombre: "Despensa con etiquetas RFID", ubicuo: true, cuarto: "Cocina", pos: [1.0, 0.75, 6.0],
    parts: [{ s: "box", a: [0.5, 0.7, 0.5], c: "wood" }, { s: "box", a: [0.3, 0.15, 0.02], p: [0, 0.05, 0.26], c: "white" }, { s: "box", a: [0.18, 0.06, 0.03], p: [0, 0.05, 0.27], c: "wood", e: "yellow" }],
    porque: "Cada producto lleva un transpondedor RFID que un lector identifica automáticamente: tecnología clave de la ubicuidad.",
  },
  // ---------- DORMITORIO (x -10..0, z -7..0)
  {
    id: "camaSensor", nombre: "Sensor de presencia en cama", ubicuo: true, cuarto: "Dormitorio", pos: [-6.5, 0.75, -4.0],
    parts: [{ s: "box", a: [1.6, 0.06, 0.35], c: "blue" }, led([0.7, 0.05, 0], "emerald")],
    porque: "Detecta si la persona está en la cama y alerta a cuidadores (teleasistencia para adultos mayores).",
  },
  {
    id: "smartwatch", nombre: "Reloj inteligente", ubicuo: true, cuarto: "Dormitorio", pos: [-3.6, 0.85, -6.0],
    parts: [{ s: "box", a: [0.4, 0.1, 0.45], c: "ink" }, { s: "box", a: [0.32, 0.02, 0.36], p: [0, 0.06, 0], c: "ink", e: "emerald" }, { s: "box", a: [0.2, 0.04, 1], c: "coral" }],
    porque: "Computación vestible: mide pulso, pasos y sueño, y sincroniza los datos con el celular y la nube.",
  },
  {
    id: "despertador", nombre: "Despertador digital", ubicuo: false, cuarto: "Dormitorio", pos: [-9.0, 0.85, -6.0],
    parts: [{ s: "box", a: [0.7, 0.35, 0.3], c: "ink" }, { s: "box", a: [0.55, 0.2, 0.02], p: [0, 0, 0.16], c: "ink", e: "coral" }],
    porque: "Pantalla digital y alarma, pero funciona aislado: no sensa el entorno ni se conecta a una red.",
  },
  {
    id: "bombilla", nombre: "Bombilla inteligente", ubicuo: true, cuarto: "Dormitorio", pos: [-1.6, 0, -1.6],
    parts: [{ s: "cyl", a: [0.25, 0.3, 0.08, 20], p: [0, 0.04, 0], c: "white" }, { s: "cyl", a: [0.03, 0.03, 1.4, 8], p: [0, 0.75, 0], c: "white" }, { s: "sphere", a: [0.32, 20, 20], p: [0, 1.6, 0], c: "yellow", e: "wood" }],
    porque: "Cambia color e intensidad según la hora o la presencia, controlada por app o voz a través de la red.",
  },
  {
    id: "ventilador", nombre: "Ventilador de mesa", ubicuo: false, cuarto: "Dormitorio", pos: [-1.6, 0, -5.8],
    parts: [{ s: "cyl", a: [0.3, 0.35, 0.1, 20], p: [0, 0.05, 0], c: "white" }, { s: "cyl", a: [0.05, 0.05, 1, 8], p: [0, 0.55, 0], c: "white" }, { s: "torus", a: [0.45, 0.04, 8, 32], p: [0, 1.15, 0], c: "cyan" }, { s: "sphere", a: [0.12, 12, 12], p: [0, 1.15, 0], c: "cyan" }],
    porque: "Motor con botones de velocidad. No tiene sensores, ni red, ni adaptación automática.",
  },
  {
    id: "panico", nombre: "Botón de pánico conectado", ubicuo: true, cuarto: "Dormitorio", pos: [-9.6, 1.1, -2.2], rotY: Math.PI / 2,
    parts: [{ s: "box", a: [0.5, 0.5, 0.15], c: "white" }, { s: "cyl", a: [0.17, 0.17, 0.12, 24], p: [0, 0, 0.1], r: [Math.PI / 2, 0, 0], c: "coral", e: "coral" }],
    porque: "Envía una alerta inmediata (GSM/Internet) a familiares o un centro de teleasistencia.",
  },
  // ---------- ESTUDIO (x 0..10, z -7..0)
  {
    id: "tablet", nombre: "Tablet (\"pad\" de Weiser)", ubicuo: true, cuarto: "Estudio", pos: [3.0, 0.82, -5.6], rotY: 0.3,
    parts: [{ s: "box", a: [0.9, 0.05, 0.65], c: "ink" }, { s: "box", a: [0.8, 0.02, 0.55], p: [0, 0.03, 0], c: "ink", e: "blue" }],
    porque: "Es el 'pad' que imaginó Mark Weiser: dispositivo portátil, conectado y con interfaz natural.",
  },
  {
    id: "calculadora", nombre: "Calculadora científica", ubicuo: false, cuarto: "Estudio", pos: [4.6, 0.82, -5.4],
    parts: [{ s: "box", a: [0.4, 0.06, 0.7], c: "ink" }, { s: "box", a: [0.3, 0.02, 0.15], p: [0, 0.04, -0.2], c: "emerald" }],
    porque: "Computa, pero de forma aislada y bajo demanda; no está conectada ni consciente del contexto.",
  },
  {
    id: "signos", nombre: "Monitor de signos vitales", ubicuo: true, cuarto: "Estudio", pos: [8.6, 0, -5.4],
    parts: [{ s: "cyl", a: [0.05, 0.05, 1.3, 8], p: [0, 0.65, 0], c: "silver" }, { s: "box", a: [0.8, 0.6, 0.15], p: [0, 1.5, 0], c: "white" }, { s: "box", a: [0.65, 0.42, 0.02], p: [0, 1.5, 0.08], c: "ink", e: "emerald" }],
    porque: "Telemedicina: mide pulso y presión y envía los datos al hospital para monitoreo continuo.",
  },
  {
    id: "telefono", nombre: "Teléfono fijo", ubicuo: false, cuarto: "Estudio", pos: [6.2, 0.85, -1.2],
    parts: [{ s: "box", a: [0.6, 0.18, 0.5], c: "coral" }, { s: "box", a: [0.65, 0.12, 0.16], p: [0, 0.15, 0], c: "coral" }],
    porque: "Comunica, pero no es inteligente: no sensa, no procesa contexto ni se integra con otros dispositivos.",
  },
  {
    id: "pir", nombre: "Sensor de movimiento PIR", ubicuo: true, cuarto: "Estudio", pos: [9.6, 2.1, -0.6], rotY: -Math.PI / 2,
    parts: [{ s: "box", a: [0.4, 0.4, 0.2], c: "white" }, { s: "sphere", a: [0.15, 16, 16], p: [0, 0, 0.1], c: "white" }, led([0.13, -0.13, 0.11], "coral")],
    porque: "Detecta presencia y activa luces o alarmas de forma automática, sin que el usuario intervenga.",
  },
  {
    id: "termometro", nombre: "Termómetro de mercurio", ubicuo: false, cuarto: "Estudio", pos: [1.0, 0.85, -2.2], rotY: 0.8,
    parts: [{ s: "cyl", a: [0.06, 0.06, 0.9, 10], r: [0, 0, Math.PI / 2], c: "white" }, { s: "sphere", a: [0.09, 10, 10], p: [-0.45, 0, 0], c: "silver" }],
    porque: "Mide temperatura, pero no registra ni transmite el dato: un humano tiene que leerlo.",
  },
  {
    id: "cerradura", nombre: "Cerradura inteligente", ubicuo: true, cuarto: "Estudio", pos: [0.3, 1.1, -3.6], rotY: Math.PI / 2,
    parts: [{ s: "box", a: [0.4, 0.75, 0.15], c: "ink" }, { s: "box", a: [0.28, 0.35, 0.02], p: [0, 0.1, 0.08], c: "ink", e: "cyan" }],
    porque: "Se abre con huella, código o celular y registra quién entra: identificación y acceso en cualquier momento.",
  },
];
