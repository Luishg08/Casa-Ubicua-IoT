import { describe, expect, it } from "vitest";
import { promedioNotas, scoreShop } from "./shop-scoring";
import { SHOP_ROUNDS } from "./shop";

describe("shop scoring", () => {
  it("da 5.0 si acierta las cinco rondas", () => {
    const perfect = SHOP_ROUNDS.map((r) => r.correcta);
    expect(scoreShop(perfect)).toMatchObject({ aciertos: 5, total: 5, nota: 5 });
  });

  it("da 0 si falla todas", () => {
    const wrong = SHOP_ROUNDS.map((r) => r.opciones.find((o) => o.id !== r.correcta)!.id);
    expect(scoreShop(wrong).nota).toBe(0);
  });

  it("cuenta 3 aciertos como 3.0", () => {
    const mixed = SHOP_ROUNDS.map((r, i) => (i < 3 ? r.correcta : r.opciones.find((o) => o.id !== r.correcta)!.id));
    expect(scoreShop(mixed)).toMatchObject({ aciertos: 3, nota: 3 });
  });

  it("promedia casa y tienda a un decimal", () => {
    expect(promedioNotas(4.3, 5)).toBe(4.7);
  });
});
