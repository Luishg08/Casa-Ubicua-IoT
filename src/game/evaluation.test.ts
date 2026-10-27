import { describe, expect, it } from "vitest";
import { evaluationReducer, initialEvaluation } from "./evaluation";

describe("student evaluation", () => {
  it("requires a nonblank student name before playing", () => {
    expect(evaluationReducer(initialEvaluation(), { type: "start", student: "   " }).phase).toBe("intro");
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "  Ana Pérez  " });
    expect(started.phase).toBe("play");
    expect(started.student).toBe("Ana Pérez");
  });

  it("retains the student next to their final grade", () => {
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "Ana Pérez" });
    const selected = evaluationReducer(started, { type: "toggle", id: "altavoz" });
    const graded = evaluationReducer(selected, { type: "grade" });
    expect(graded.student).toBe("Ana Pérez");
    expect(graded.result?.nota).toBe(0.3);
    expect(graded.phase).toBe("result");
  });

  it("cannot return to the house or start over after grading", () => {
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "Ana Pérez" });
    const graded = evaluationReducer(started, { type: "grade" });
    const attemptedRestart = evaluationReducer(graded, { type: "start", student: "Otra persona" });
    expect(attemptedRestart).toBe(graded);
    expect(attemptedRestart.phase).toBe("result");
  });

  it("cannot alter selections or recalculate a final grade", () => {
    const started = evaluationReducer(initialEvaluation(), { type: "start", student: "Ana Pérez" });
    const selected = evaluationReducer(started, { type: "toggle", id: "altavoz" });
    const graded = evaluationReducer(selected, { type: "grade" });
    expect(evaluationReducer(graded, { type: "toggle", id: "altavoz" })).toBe(graded);
    expect(evaluationReducer(graded, { type: "grade" })).toBe(graded);
    expect(graded.selected.has("altavoz")).toBe(true);
  });
});