import pc from "picocolors";
import type { Band, Report } from "../types.js";
import { CATEGORY_LABELS } from "../types.js";
import { toSegments } from "../highlight.js";

function bandPaint(band: Band, s: string): string {
  if (band === "green") return pc.green(s);
  if (band === "mixed") return pc.yellow(s);
  if (band === "warning") return pc.yellow(s);
  if (band === "run") return pc.red(s);
  return pc.dim(s);
}

function bandEmoji(band: Band): string {
  if (band === "green") return "🟢";
  if (band === "mixed") return "🤔";
  if (band === "warning") return "🚩";
  if (band === "run") return "🚩🏃";
  return "❔";
}

// A 20-cell bar: green on the left, red on the right, split by tilt.
function tiltBar(tilt: number): string {
  const redCells = Math.round((tilt / 100) * 20);
  const greenCells = 20 - redCells;
  return pc.green("█".repeat(greenCells)) + pc.red("█".repeat(redCells));
}

export function renderConsole(r: Report, text: string): string {
  const L: string[] = [];
  const ind = "  ";
  L.push("");

  // highlighted message (red flags underlined red, green underlined green)
  if (text.length <= 4000 && r.findings.length > 0) {
    const body = toSegments(text, r.findings)
      .map((seg) => {
        if (!seg.finding) return seg.text;
        return seg.finding.polarity === "red"
          ? pc.red(pc.underline(seg.text))
          : pc.green(pc.underline(seg.text));
      })
      .join("");
    L.push(body.split("\n").map((line) => ind + line).join("\n"));
    L.push("");
  }

  // verdict
  L.push(`${ind}${bandPaint(r.verdict.band, pc.bold(r.verdict.label))} ${bandEmoji(r.verdict.band)}`);
  L.push(`${ind}${pc.green("🟢")} ${tiltBar(r.verdict.tilt)} ${pc.red("🚩")}`);
  L.push(`${ind}${pc.dim(`${r.red.length} red · ${r.green.length} green`)}`);
  L.push("");

  if (r.red.length > 0) {
    L.push(`${ind}${pc.red(pc.bold("🚩 Red flags"))} ${pc.dim("→ what it really means")}`);
    for (const t of r.red) {
      L.push(`${ind}  ${pc.red(`“${t.match}”`)}${t.count > 1 ? pc.dim(" ×" + t.count) : ""} ${pc.dim("· " + CATEGORY_LABELS[t.category])}`);
      L.push(`${ind}    ${pc.dim("↳ " + t.decode)}`);
    }
    L.push("");
  }

  if (r.green.length > 0) {
    L.push(`${ind}${pc.green(pc.bold("🟢 Green flags"))} ${pc.dim("→ what it really means")}`);
    for (const t of r.green) {
      L.push(`${ind}  ${pc.green(`“${t.match}”`)}${t.count > 1 ? pc.dim(" ×" + t.count) : ""} ${pc.dim("· " + CATEGORY_LABELS[t.category])}`);
      L.push(`${ind}    ${pc.dim("↳ " + t.decode)}`);
    }
    L.push("");
  }

  if (r.findings.length === 0) {
    L.push(`${ind}${pc.dim("No flags either way in our database — paste more of what they said or did.")}`);
    L.push("");
  } else {
    L.push(`${ind}${pc.dim("rule-based, no AI, nothing left your machine. it's a meme, not couples therapy — context wins.")}`);
    L.push("");
  }
  return L.join("\n");
}
