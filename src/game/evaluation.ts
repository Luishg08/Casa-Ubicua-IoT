import { DEVICES } from "./devices";
import { score, type ScoreResult } from "./scoring";
import { SHOP_ROUNDS } from "./shop";
import { scoreShop, type ShopScoreResult } from "./shop-scoring";

export type Phase = "intro" | "play" | "shop-intro" | "shop" | "result";

export interface EvaluationState {
  phase: Phase;
  student: string;
  selected: Set<string>;
  result: ScoreResult | null;
  shopRound: number;
  shopChoices: (string | null)[];
  /** Tras elegir en una ronda: feedback antes de avanzar. */
  shopPending: { choiceId: string; ok: boolean } | null;
  shopResult: ShopScoreResult | null;
}

export type EvaluationAction =
  | { type: "start"; student: string }
  | { type: "toggle"; id: string }
  | { type: "grade" }
  | { type: "enterShop" }
  | { type: "shopChoose"; optionId: string }
  | { type: "shopNext" };

export function initialEvaluation(): EvaluationState {
  return {
    phase: "intro",
    student: "",
    selected: new Set(),
    result: null,
    shopRound: 0,
    shopChoices: Array(SHOP_ROUNDS.length).fill(null),
    shopPending: null,
    shopResult: null,
  };
}

export function evaluationReducer(state: EvaluationState, action: EvaluationAction): EvaluationState {
  // Resultado final terminal: no se reabre ni se altera.
  if (state.phase === "result") return state;

  if (action.type === "start") {
    const student = action.student.trim();
    return state.phase === "intro" && student ? { ...state, student, phase: "play" } : state;
  }

  if (action.type === "toggle") {
    if (state.phase !== "play") return state;
    if (!DEVICES.some((device) => device.id === action.id)) return state;
    const selected = new Set(state.selected);
    selected.has(action.id) ? selected.delete(action.id) : selected.add(action.id);
    return { ...state, selected };
  }

  if (action.type === "grade") {
    if (state.phase !== "play") return state;
    return {
      ...state,
      phase: "shop-intro",
      result: score(DEVICES, state.selected),
    };
  }

  if (action.type === "enterShop") {
    if (state.phase !== "shop-intro") return state;
    return { ...state, phase: "shop", shopRound: 0, shopPending: null };
  }

  if (action.type === "shopChoose") {
    if (state.phase !== "shop" || state.shopPending) return state;
    const round = SHOP_ROUNDS[state.shopRound];
    if (!round?.opciones.some((o) => o.id === action.optionId)) return state;
    const shopChoices = [...state.shopChoices];
    shopChoices[state.shopRound] = action.optionId;
    return {
      ...state,
      shopChoices,
      shopPending: { choiceId: action.optionId, ok: action.optionId === round.correcta },
    };
  }

  if (action.type === "shopNext") {
    if (state.phase !== "shop" || !state.shopPending) return state;
    const next = state.shopRound + 1;
    if (next >= SHOP_ROUNDS.length) {
      return {
        ...state,
        phase: "result",
        shopPending: null,
        shopResult: scoreShop(state.shopChoices),
      };
    }
    return { ...state, shopRound: next, shopPending: null };
  }

  return state;
}
