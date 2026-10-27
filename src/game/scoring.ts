export interface ScoreResult {
  aciertos: number; // ubicuos marcados
  errores: number; // no ubicuos marcados
  omitidos: number; // ubicuos no marcados
  totalUbicuos: number;
  nota: number; // 0 a 5, un decimal
}

/** Nota = 5 × (aciertos − errores) / total de ubicuos, limitada a [0, 5]. */
export function score(
  devices: { id: string; ubicuo: boolean }[],
  selected: Set<string>,
): ScoreResult {
  const totalUbicuos = devices.filter((d) => d.ubicuo).length;
  let aciertos = 0;
  let errores = 0;
  for (const d of devices) {
    if (!selected.has(d.id)) continue;
    if (d.ubicuo) aciertos++;
    else errores++;
  }
  const raw = totalUbicuos ? (5 * (aciertos - errores)) / totalUbicuos : 0;
  const nota = Math.round(Math.min(5, Math.max(0, raw)) * 10) / 10;
  return { aciertos, errores, omitidos: totalUbicuos - aciertos, totalUbicuos, nota };
}
