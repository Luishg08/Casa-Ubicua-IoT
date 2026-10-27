import { describe, it, expect } from "vitest";
import { score } from "./scoring";

const devs = [
  { id: "a", ubicuo: true },
  { id: "b", ubicuo: true },
  { id: "c", ubicuo: true },
  { id: "d", ubicuo: true },
  { id: "x", ubicuo: false },
  { id: "y", ubicuo: false },
];

describe("score", () => {
  it("todos los ubicuos sin errores da 5.0", () => {
    expect(score(devs, new Set(["a", "b", "c", "d"])).nota).toBe(5);
  });
  it("cada error resta un acierto", () => {
    expect(score(devs, new Set(["a", "b", "c", "d", "x"])).nota).toBe(3.8);
  });
  it("nunca baja de 0", () => {
    expect(score(devs, new Set(["x", "y"])).nota).toBe(0);
  });
  it("sin seleccionar nada da 0", () => {
    expect(score(devs, new Set()).nota).toBe(0);
  });
});
