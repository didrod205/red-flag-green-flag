// Pure, browser-safe data model — powers the CLI and the web playground.

export type Polarity = "red" | "green";

export type FlagCategory =
  // 🚩 red
  | "avoidant" // commitment-dodging
  | "manipulation" // gaslighting, guilt
  | "dishonesty" // lies, "my ex is crazy"
  | "disrespect" // dismissive, belittling
  | "unavailable" // breadcrumbs, low effort
  | "controlling" // jealousy, isolation
  // 🟢 green
  | "communication" // talks, apologizes
  | "respect" // boundaries, consent
  | "growth" // self-aware, accountable
  | "effort" // plans, listens
  | "care"; // safety, kindness

export interface Finding {
  polarity: Polarity;
  category: FlagCategory;
  /** The matched phrase. */
  match: string;
  start: number;
  end: number;
  weight: number;
  /** What it really means. */
  decode: string;
}

export type Band = "green" | "mixed" | "warning" | "run" | "unknown";

export interface Verdict {
  /** 0–100 display meters per side. */
  redScore: number;
  greenScore: number;
  /** Needle 0 (all green) … 50 (even) … 100 (all red). */
  tilt: number;
  band: Band;
  label: string;
}

export interface Report {
  chars: number;
  words: number;
  findings: Finding[];
  red: { match: string; count: number; category: FlagCategory; decode: string }[];
  green: { match: string; count: number; category: FlagCategory; decode: string }[];
  verdict: Verdict;
}

export interface Config {
  ignore: FlagCategory[];
}

export const CATEGORY_LABELS: Record<FlagCategory, string> = {
  avoidant: "Commitment-avoidant",
  manipulation: "Manipulation",
  dishonesty: "Dishonesty",
  disrespect: "Disrespect",
  unavailable: "Emotionally unavailable",
  controlling: "Controlling",
  communication: "Communicates",
  respect: "Respects boundaries",
  growth: "Self-aware",
  effort: "Makes an effort",
  care: "Caring",
};

export const POLARITY_OF: Record<FlagCategory, Polarity> = {
  avoidant: "red",
  manipulation: "red",
  dishonesty: "red",
  disrespect: "red",
  unavailable: "red",
  controlling: "red",
  communication: "green",
  respect: "green",
  growth: "green",
  effort: "green",
  care: "green",
};
