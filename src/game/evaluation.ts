import { DEVICES } from "./devices";
import { score, type ScoreResult } from "./scoring";

export interface EvaluationState {
  phase: "intro" | "play" | "result";
  student: string;
  selected: Set<string>;
  result: ScoreResult | null;
}

export type EvaluationAction =
  | { type: "start"; student: string }
  | { type: "toggle"; id: string }
  | { type: "grade" };

export function initialEvaluation(): EvaluationState {
  return { phase: "intro", student: "", selected: new Set(), result: null };
}

export function evaluationReducer(state: EvaluationState, action: EvaluationAction): EvaluationState {
  // Submission is terminal: neither another start nor selection can reopen it.
  if (state.phase === "result") return state;
  if (action.type === "start") {
    const student = action.student.trim();
    return state.phase === "intro" && student ? { ...state, student, phase: "play" } : state;
  }
  if (state.phase !== "play") return state;
  if (action.type === "grade") return { ...state, phase: "result", result: score(DEVICES, state.selected) };
  if (!DEVICES.some((device) => device.id === action.id)) return state;
  const selected = new Set(state.selected);
  selected.has(action.id) ? selected.delete(action.id) : selected.add(action.id);
  return { ...state, selected };
}