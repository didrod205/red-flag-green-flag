import { COMPILED_FLAGS } from "./flags.js";
import { verdictFor } from "./score.js";
import type { Config, FlagCategory, Finding, Polarity, Report } from "./types.js";

const DEFAULT_CONFIG: Config = { ignore: [] };

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary phrase match that tolerates an optional comma between words
// ("no rush, take your time") and treats straight/curly apostrophes as equal.
function phraseRegex(text: string): RegExp {
  const body = escapeRe(text)
    .replace(/\s+/g, "[\\s,]+")
    .replace(/'/g, "['’]");
  return new RegExp(`(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])`, "gi");
}

const COMPILED = COMPILED_FLAGS.map((f) => ({ ...f, re: phraseRegex(f.text) }));

function countWords(text: string): number {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

// Keep the longest / heaviest match when spans overlap.
function dedupe(found: Finding[]): Finding[] {
  const sorted = [...found].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const lenA = a.end - a.start;
    const lenB = b.end - b.start;
    if (lenA !== lenB) return lenB - lenA;
    return b.weight - a.weight;
  });
  const kept: Finding[] = [];
  let lastEnd = -1;
  for (const f of sorted) {
    if (f.start >= lastEnd) {
      kept.push(f);
      lastEnd = f.end;
    }
  }
  return kept;
}

function group(findings: Finding[], polarity: Polarity) {
  const groups = new Map<string, { match: string; count: number; category: FlagCategory; decode: string }>();
  for (const f of findings) {
    if (f.polarity !== polarity) continue;
    const norm = f.match.replace(/\s+/g, " ");
    const key = norm.toLowerCase();
    const g = groups.get(key);
    if (g) g.count++;
    else groups.set(key, { match: norm, count: 1, category: f.category, decode: f.decode });
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || b.match.length - a.match.length);
}

export function analyze(text: string, config: Partial<Config> = {}): Report {
  const cfg: Config = { ...DEFAULT_CONFIG, ...config };
  const ignore = new Set<FlagCategory>(cfg.ignore);

  const raw: Finding[] = [];
  for (const f of COMPILED) {
    if (ignore.has(f.category)) continue;
    f.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = f.re.exec(text)) !== null) {
      raw.push({
        polarity: f.polarity,
        category: f.category,
        match: m[0],
        start: m.index,
        end: m.index + m[0].length,
        weight: f.weight,
        decode: f.decode,
      });
      if (m.index === f.re.lastIndex) f.re.lastIndex++;
    }
  }

  const findings = dedupe(raw).sort((a, b) => a.start - b.start);
  const red = group(findings, "red");
  const green = group(findings, "green");

  const redRaw = findings.filter((f) => f.polarity === "red").reduce((s, f) => s + f.weight, 0);
  const greenRaw = findings.filter((f) => f.polarity === "green").reduce((s, f) => s + f.weight, 0);

  const words = countWords(text);
  const verdict = verdictFor(redRaw, greenRaw);

  return { chars: text.length, words, findings, red, green, verdict };
}
