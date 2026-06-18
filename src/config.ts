import type { Config, FlagCategory } from "./types.js";

export const CATEGORIES: FlagCategory[] = [
  "avoidant",
  "manipulation",
  "dishonesty",
  "disrespect",
  "unavailable",
  "controlling",
  "communication",
  "respect",
  "growth",
  "effort",
  "care",
];

export function normalizeConfig(input: Partial<Config> | undefined): Config {
  const ignore = (input?.ignore ?? []).filter((c): c is FlagCategory =>
    CATEGORIES.includes(c as FlagCategory),
  );
  return { ignore };
}
