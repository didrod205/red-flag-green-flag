import type { Finding } from "./types.js";

export interface Segment {
  text: string;
  finding?: Finding;
}

/** Split text into plain + flagged segments (non-overlapping findings) for rendering. */
export function toSegments(text: string, findings: Finding[]): Segment[] {
  const sorted = [...findings].sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let cursor = 0;
  for (const f of sorted) {
    if (f.start < cursor) continue; // safety: skip any overlap
    if (f.start > cursor) out.push({ text: text.slice(cursor, f.start) });
    out.push({ text: text.slice(f.start, f.end), finding: f });
    cursor = f.end;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor) });
  return out;
}
