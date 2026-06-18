// Public, browser-safe API. No node:* imports here — the web playground imports
// this file directly.
export { analyze } from "./analyze.js";
export { verdictFor } from "./score.js";
export { toSegments } from "./highlight.js";
export type { Segment } from "./highlight.js";
export { COMPILED_FLAGS } from "./flags.js";
export type { Flag, CompiledFlag } from "./flags.js";
export { CATEGORIES, normalizeConfig } from "./config.js";
export { CATEGORY_LABELS, POLARITY_OF } from "./types.js";
export type {
  Band,
  Config,
  FlagCategory,
  Finding,
  Polarity,
  Report,
  Verdict,
} from "./types.js";
