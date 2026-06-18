import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { analyze } from "../src/analyze.js";

const read = (f: string) => readFileSync(resolve(__dirname, "..", "examples", f), "utf8");

describe("flag detection", () => {
  it("flags 'doesn't believe in labels' as a red avoidant flag", () => {
    const r = analyze("He doesn't believe in labels.");
    const f = r.findings.find((x) => x.match.toLowerCase() === "doesn't believe in labels");
    expect(f?.polarity).toBe("red");
    expect(f?.category).toBe("avoidant");
  });

  it("flags 'text me when you get home safe' as a green care flag", () => {
    const r = analyze("She said text me when you get home safe.");
    const f = r.findings.find((x) => x.match.toLowerCase() === "text me when you get home safe");
    expect(f?.polarity).toBe("green");
    expect(f?.category).toBe("care");
  });

  it("separates findings into red and green groups", () => {
    const r = analyze("let's keep it casual, but text me when you get home safe");
    expect(r.red.some((t) => t.match.toLowerCase() === "let's keep it casual")).toBe(true);
    expect(r.green.some((t) => t.match.toLowerCase() === "text me when you get home safe")).toBe(true);
  });

  it("tolerates an optional comma ('no rush, take your time')", () => {
    const r = analyze("No rush, take your time.");
    expect(r.green.some((t) => t.category === "respect")).toBe(true);
  });

  it("treats a curly apostrophe like a straight one", () => {
    const r = analyze("I don’t want anything serious.");
    expect(r.red.some((t) => t.category === "avoidant")).toBe(true);
  });

  it("does not fire inside larger words", () => {
    const r = analyze("We kayaked to the dockyard and chilled by the lake.");
    // 'k', 'chill' must not match inside 'kayaked'/'dockyard'/'chilled'
    expect(r.findings.length).toBe(0);
  });

  it("respects ignored categories", () => {
    const r = analyze("who were you with — text me when you get home safe", { ignore: ["controlling"] });
    expect(r.red.some((t) => t.match.toLowerCase() === "who were you with")).toBe(false);
    expect(r.green.length).toBeGreaterThan(0);
  });

  it("produces non-overlapping, ordered spans", () => {
    const r = analyze(read("red.txt"));
    for (let i = 1; i < r.findings.length; i++) {
      expect(r.findings[i]!.start).toBeGreaterThanOrEqual(r.findings[i - 1]!.end);
    }
  });
});

describe("verdict calibration", () => {
  it("a red-stuffed chat says run", () => {
    const r = analyze(read("red.txt"));
    expect(r.verdict.band).toBe("run");
    expect(r.verdict.tilt).toBeGreaterThan(80);
  });

  it("a green-stuffed chat says keep them", () => {
    const r = analyze(read("green.txt"));
    expect(r.verdict.band).toBe("green");
    expect(r.verdict.tilt).toBeLessThan(20);
  });

  it("a balanced chat says mixed signals", () => {
    const r = analyze(read("mixed.txt"));
    expect(r.verdict.band).toBe("mixed");
  });

  it("empty text is unknown with a centered needle", () => {
    const r = analyze("");
    expect(r.findings).toHaveLength(0);
    expect(r.verdict.band).toBe("unknown");
    expect(r.verdict.tilt).toBe(50);
  });
});
