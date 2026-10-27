import { describe, expect, it } from "vitest";
import { evaluationReducer, initialEvaluation } from "./evaluation";
import { SHOP_ROUNDS } from "./shop";

describe("student evaluation", () => {
  it("requires a nonblank student name before playing", () => {
    expect(evaluationReducer(initialEvaluation(), { type: "start", student: "   " }).phase).toBe("intro");
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "  Ana Pérez  " });
    expect(started.phase).toBe("play");
    expect(started.student).toBe("Ana Pérez");
  });

  it("tras calificar la casa pasa al intro de la tienda, no al resultado final", () => {
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "Ana Pérez" });
    const selected = evaluationReducer(started, { type: "toggle", id: "altavoz" });
    const graded = evaluationReducer(selected, { type: "grade" });
    expect(graded.student).toBe("Ana Pérez");
    expect(graded.result?.nota).toBe(0.3);
    expect(graded.phase).toBe("shop-intro");
  });

  it("completa la tienda y deja el resultado final terminal", () => {
    let s = evaluationReducer(initialEvaluation(), { type: "start", student: "Ana Pérez" });
    s = evaluationReducer(s, { type: "grade" });
    s = evaluationReducer(s, { type: "enterShop" });
    expect(s.phase).toBe("shop");

    for (const round of SHOP_ROUNDS) {
      s = evaluationReducer(s, { type: "shopChoose", optionId: round.correcta });
      expect(s.shopPending?.ok).toBe(true);
      s = evaluationReducer(s, { type: "shopNext" });
    }

    expect(s.phase).toBe("result");
    expect(s.shopResult?.nota).toBe(5);
    expect(evaluationReducer(s, { type: "start", student: "Otra" })).toBe(s);
    expect(evaluationReducer(s, { type: "toggle", id: "altavoz" })).toBe(s);
    expect(evaluationReducer(s, { type: "shopChoose", optionId: "radio" })).toBe(s);
  });

  it("no deja cambiar la casa después de calificarla", () => {
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "Ana Pérez" });
    const selected = evaluationReducer(started, { type: "toggle", id: "altavoz" });
    const graded = evaluationReducer(selected, { type: "grade" });
    expect(evaluationReducer(graded, { type: "toggle", id: "altavoz" }).selected.has("altavoz")).toBe(true);
    expect(evaluationReducer(graded, { type: "grade" }).phase).toBe("shop-intro");
  });
});
