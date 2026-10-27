import { SHOP_ROUNDS } from "./shop";

export interface ShopScoreResult {
  aciertos: number;
  total: number;
  nota: number;
  detalle: { roundId: string; elegida: string; correcta: string; ok: boolean }[];
}

/** Nota = 5 × aciertos / 5 rondas → cada acierto vale 1.0 sobre 5. */
export function scoreShop(choices: (string | null)[]): ShopScoreResult {
  const detalle = SHOP_ROUNDS.map((round, i) => {
    const elegida = choices[i] ?? "";
    const ok = elegida === round.correcta;
    return { roundId: round.id, elegida, correcta: round.correcta, ok };
  });
  const aciertos = detalle.filter((d) => d.ok).length;
  const total = SHOP_ROUNDS.length;
  const nota = Math.round(((5 * aciertos) / total) * 10) / 10;
  return { aciertos, total, nota, detalle };
}

export function promedioNotas(casa: number, tienda: number): number {
  return Math.round(((casa + tienda) / 2) * 10) / 10;
}
