// Node-only: read an optional red-flag-green-flag.json from disk. Kept out of
// index.ts so the browser bundle stays free of node:* imports.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeConfig } from "./config.js";
import type { Config } from "./types.js";

export function loadConfig(cwd = process.cwd()): Config {
  for (const name of ["red-flag-green-flag.json", ".flagcheckrc.json"]) {
    try {
      const raw = readFileSync(resolve(cwd, name), "utf8");
      return normalizeConfig(JSON.parse(raw));
    } catch {
      // try next / fall through to defaults
    }
  }
  return normalizeConfig(undefined);
}
