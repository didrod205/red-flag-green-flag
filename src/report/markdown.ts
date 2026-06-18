import type { Report } from "../types.js";
import { CATEGORY_LABELS } from "../types.js";

export function toMarkdown(r: Report): string {
  const L: string[] = [];
  L.push(`# red-flag-green-flag — ${r.verdict.label}`);
  L.push("");
  L.push(`> 🚩 **${r.red.length} red** · 🟢 **${r.green.length} green**  ·  tilt ${r.verdict.tilt}/100 toward red`);
  L.push("");
  if (r.red.length > 0) {
    L.push("## 🚩 Red flags");
    L.push("");
    L.push("| Phrase | Count | Type | What it really means |");
    L.push("| --- | --- | --- | --- |");
    for (const t of r.red) L.push(`| \`${t.match}\` | ×${t.count} | ${CATEGORY_LABELS[t.category]} | ${t.decode} |`);
    L.push("");
  }
  if (r.green.length > 0) {
    L.push("## 🟢 Green flags");
    L.push("");
    L.push("| Phrase | Count | Type | What it really means |");
    L.push("| --- | --- | --- | --- |");
    for (const t of r.green) L.push(`| \`${t.match}\` | ×${t.count} | ${CATEGORY_LABELS[t.category]} | ${t.decode} |`);
    L.push("");
  }
  if (r.findings.length === 0) {
    L.push("No flags either way from our database. Paste more of what they said or did.");
    L.push("");
  }
  L.push("---");
  L.push("<sub>scored locally by [red-flag-green-flag](https://github.com/didrod205/red-flag-green-flag) — rule-based, no AI, nothing uploaded. A meme, not couples therapy.</sub>");
  return L.join("\n") + "\n";
}
