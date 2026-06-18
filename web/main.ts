import { analyze, toSegments, CATEGORY_LABELS } from "../src/index.js";
import type { Report } from "../src/index.js";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const input = $<HTMLTextAreaElement>("input");
const result = $<HTMLElement>("result");
const card = document.querySelector(".verdict-card") as HTMLElement;
const labelEl = $<HTMLElement>("label");
const tiltGreen = $<HTMLElement>("tilt-green");
const tiltRed = $<HTMLElement>("tilt-red");
const tallyGreen = $<HTMLElement>("tally-green");
const tallyRed = $<HTMLElement>("tally-red");
const redList = $<HTMLElement>("red-list");
const greenList = $<HTMLElement>("green-list");
const highlighted = $<HTMLElement>("highlighted");

const EMOJI: Record<string, string> = { run: "🚩🏃", warning: "🚩", mixed: "🤔", green: "🟢", unknown: "❔" };

const RED_SAMPLE = `He texted "u up" at 2am. Again.

When I brought it up he said "calm down, you're overreacting" and that "you're too sensitive." He doesn't believe in labels and says "we don't need a title — let's keep it casual."

All my exes are crazy, apparently. When I asked, he hit me with "who were you with" and "why didn't you reply." It's complicated.`;

const GREEN_SAMPLE = `"No rush, take your time — only if you want to."

"Can we talk about it? I was wrong, I'm sorry that was on me."

"I made a reservation for Friday. I remembered you said you wanted to try that place. Text me when you get home safe, okay? I'm proud of you."`;

const MIXED_SAMPLE = `"I'm sorry that was on me — can we talk about it?"

"But honestly, you're overreacting. It's complicated."`;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function rows(items: Report["red"]): string {
  if (items.length === 0) return `<div class="col-empty">— none spotted —</div>`;
  return items
    .map(
      (t) => `<div class="flag-row">
        <div class="said"><span class="q">“${escapeHtml(t.match)}”</span>${t.count > 1 ? ` <span class="x">×${t.count}</span>` : ""}</div>
        <div class="cat">${escapeHtml(CATEGORY_LABELS[t.category])}</div>
        <div class="means">${escapeHtml(t.decode)}</div>
      </div>`,
    )
    .join("");
}

function render(): void {
  const text = input.value;
  if (text.trim() === "") {
    result.classList.add("hidden");
    return;
  }
  result.classList.remove("hidden");
  const r = analyze(text);

  card.className = "verdict-card band-" + r.verdict.band;
  labelEl.textContent = `${r.verdict.label} ${EMOJI[r.verdict.band] ?? ""}`.trim();
  tiltGreen.style.width = `${100 - r.verdict.tilt}%`;
  tiltRed.style.width = `${r.verdict.tilt}%`;
  tallyGreen.textContent = `${r.green.length} green`;
  tallyRed.textContent = `${r.red.length} red`;

  redList.innerHTML = rows(r.red);
  greenList.innerHTML = rows(r.green);

  highlighted.innerHTML = toSegments(text, r.findings)
    .map((seg) =>
      seg.finding
        ? `<mark class="flag ${seg.finding.polarity}" title="${escapeHtml(seg.finding.decode)}">${escapeHtml(seg.text)}</mark>`
        : escapeHtml(seg.text),
    )
    .join("");
}

input.addEventListener("input", render);
$<HTMLButtonElement>("sample-red").addEventListener("click", () => { input.value = RED_SAMPLE; render(); });
$<HTMLButtonElement>("sample-green").addEventListener("click", () => { input.value = GREEN_SAMPLE; render(); });
$<HTMLButtonElement>("sample-mixed").addEventListener("click", () => { input.value = MIXED_SAMPLE; render(); });
$<HTMLButtonElement>("clear").addEventListener("click", () => { input.value = ""; render(); input.focus(); });

input.value = RED_SAMPLE;
render();
