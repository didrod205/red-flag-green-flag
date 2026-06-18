import type { Band, Verdict } from "./types.js";

// Two accumulated weights — one per side. We don't normalize by length: a flag
// is a flag whether it's a one-line text or a paragraph, so the verdict stays
// predictable and we can always show exactly which lines produced it.
const K = 4.5;

const LABELS: Record<Band, string> = {
  run: "Red flag. Run.",
  warning: "Leaning red",
  mixed: "Mixed signals",
  green: "Green flag — keep them",
  unknown: "Not enough to go on",
};

export function verdictFor(redRaw: number, greenRaw: number): Verdict {
  const redScore = Math.max(0, Math.min(100, Math.round(redRaw * K)));
  const greenScore = Math.max(0, Math.min(100, Math.round(greenRaw * K)));
  const total = redRaw + greenRaw;
  const tilt = total === 0 ? 50 : Math.round((redRaw / total) * 100);
  const net = redRaw - greenRaw;

  let band: Band;
  if (total === 0) band = "unknown";
  else if (greenRaw === 0) band = redRaw >= 6 ? "run" : "warning";
  else if (redRaw === 0) band = "green";
  else if (net >= 6) band = "run";
  else if (net >= 2) band = "warning";
  else if (net <= -4) band = "green";
  else band = "mixed";

  return { redScore, greenScore, tilt, band, label: LABELS[band] };
}
