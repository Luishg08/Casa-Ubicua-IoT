/** Nivel 2: tienda — el cliente describe sin nombrar; eliges el dispositivo correcto. */
export interface ShopOption {
  id: string;
  label: string;
}

export interface ShopRound {
  id: string;
  cliente: string;
  pedido: string;
  /** Por qué el pedido pide (o no) ubicuidad. */
  pista: string;
  opciones: ShopOption[];
  correcta: string;
  porque: string;
}

export const SHOP_ROUNDS: ShopRound[] = [
  {
    id: "farmacia-rfid",
    cliente: "Farmacéutica",
    pedido:
      "Necesito saber qué medicamentos hay en la estantería y si están vencidos, sin escanear código a código. Que el sistema los reconozca solo.",
    pista: "Identificación automática sin línea de vista: típico de RFID / tags.",
    opciones: [
      { id: "rfid", label: "Etiquetas RFID + lector" },
      { id: "calculadora", label: "Calculadora científica" },
      { id: "radio", label: "Radio analógica" },
      { id: "tostadora", label: "Tostadora" },
    ],
    correcta: "rfid",
    porque:
      "Los transpondedores RFID identifican cada producto sin intervención: tecnología clave de la computación ubicua (Weiser / IoT).",
  },
  {
    id: "wearable",
    cliente: "Deportista",
    pedido:
      "Quiero algo que lleve encima todo el día: que mida el pulso, los pasos y el sueño, y lo mande al celular sin que yo esté pendiente.",
    pista: "Computación vestible: siempre encima, sensores + red.",
    opciones: [
      { id: "reloj", label: "Reloj de pared analógico" },
      { id: "smartwatch", label: "Reloj inteligente" },
      { id: "despertador", label: "Despertador digital" },
      { id: "lampara", label: "Lámpara de pie" },
    ],
    correcta: "smartwatch",
    porque:
      "El smartwatch es wearables: mide señales vitales y sincroniza con la nube. Un reloj de pared o despertador solo marcan la hora.",
  },
  {
    id: "clima",
    cliente: "Padre de familia",
    pedido:
      "No quiero tocar termostatos. Que la casa note el frío, aprenda nuestros horarios y ajuste el clima sola por Wi‑Fi.",
    pista: "Sensores + aprendizaje + actuación remota = contexto.",
    opciones: [
      { id: "ventilador", label: "Ventilador de mesa" },
      { id: "termometro", label: "Termómetro de mercurio" },
      { id: "termostato", label: "Termostato inteligente" },
      { id: "control", label: "Control remoto infrarrojo" },
    ],
    correcta: "termostato",
    porque:
      "El termostato inteligente percibe temperatura, se adapta al uso y actúa en red. El ventilador o el mercurio no ‘desaparecen’ en el entorno.",
  },
  {
    id: "tradicional",
    cliente: "Abuela",
    pedido:
      "Solo quiero oír la emisora del pueblo. Nada de apps, Wi‑Fi ni ‘asistentes’. Un aparato simple, por favor.",
    pista: "Trampa: a veces lo correcto es NO vender ubicuo (over-engineering).",
    opciones: [
      { id: "altavoz", label: "Altavoz inteligente" },
      { id: "radio", label: "Radio analógica" },
      { id: "tablet", label: "Tablet conectada" },
      { id: "enchufe", label: "Enchufe inteligente Wi‑Fi" },
    ],
    correcta: "radio",
    porque:
      "Pedía AM/FM sin red ni contexto. La radio analógica cumple; venderle un altavoz smart sería forzar ubicuidad donde no la pidió.",
  },
  {
    id: "seguridad",
    cliente: "Viajero",
    pedido:
      "Cuando no estoy en casa quiero ver si alguien entra y que me avise al celular al instante, desde cualquier ciudad.",
    pista: "Any time / any place: visión + red + alerta.",
    opciones: [
      { id: "humo", label: "Detector de humo a pilas" },
      { id: "telefono", label: "Teléfono fijo" },
      { id: "camara", label: "Cámara de seguridad IP" },
      { id: "microondas", label: "Microondas convencional" },
    ],
    correcta: "camara",
    porque:
      "La cámara IP detecta, transmite por red y alerta al móvil. El detector a pilas o el teléfono fijo no ofrecen ese monitoreo ubicuo.",
  },
];
