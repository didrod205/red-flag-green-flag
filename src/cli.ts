#!/usr/bin/env node
import { cac } from "cac";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Config, FlagCategory } from "./types.js";
import { analyze } from "./analyze.js";
import { loadConfig } from "./load-config.js";
import { toJSON } from "./report/json.js";
import { toMarkdown } from "./report/markdown.js";

const VERSION = "0.1.0";

interface Flags {
  stdin?: boolean;
  ignore?: string | string[];
  failOnRed?: boolean;
  json?: boolean | string;
  md?: boolean | string;
  quiet?: boolean;
  color?: boolean;
}

function fail(message: string): never {
  process.stderr.write(`\nred-flag-green-flag: ${message}\n\n`);
  process.exit(2);
}

function readInput(input: string | undefined, flags: Flags): { text: string } {
  if (flags.stdin) return { text: readFileSync(0, "utf8") };
  if (input) {
    const abs = resolve(input);
    if (existsSync(abs) && !input.includes("\n")) return { text: readFileSync(abs, "utf8") };
    return { text: input };
  }
  if (!process.stdin.isTTY) return { text: readFileSync(0, "utf8") };
  fail('Paste what they said or did, or point me at a file:\n  red-flag-green-flag "he said he doesn\'t believe in labels"\n  red-flag-green-flag chat.txt\n  pbpaste | red-flag-green-flag');
}

async function run(input: string | undefined, flags: Flags): Promise<void> {
  let config: Config;
  try {
    config = loadConfig(process.cwd());
  } catch (e) {
    fail((e as Error).message);
  }
  const extra = flags.ignore === undefined ? [] : Array.isArray(flags.ignore) ? flags.ignore : [flags.ignore];
  if (extra.length) config = { ignore: [...config.ignore, ...(extra as FlagCategory[])] };

  const { text } = readInput(input, flags);
  if (text.trim() === "") fail("That's empty.");
  const report = analyze(text, config);

  if (flags.color === false) process.env["NO_COLOR"] = "1";

  if (flags.json !== undefined) {
    const out = toJSON(report);
    if (typeof flags.json === "string") writeFileSync(resolve(flags.json), out + "\n", "utf8");
    else process.stdout.write(out + "\n");
  } else if (flags.md !== undefined) {
    const out = toMarkdown(report);
    if (typeof flags.md === "string") writeFileSync(resolve(flags.md), out, "utf8");
    else process.stdout.write(out);
  } else if (!flags.quiet) {
    const { renderConsole } = await import("./report/console.js");
    process.stdout.write(renderConsole(report, text));
  }

  const reddish = report.verdict.band === "run" || report.verdict.band === "warning";
  process.exitCode = flags.failOnRed && reddish ? 1 : 0;
}

const cli = cac("red-flag-green-flag");

cli
  .command("[input]", "Decode the 🚩 red and 🟢 green flags in what they said or did (a string, a file, or stdin)")
  .option("--stdin", "Read the text from stdin")
  .option("--fail-on-red", "Exit 1 if the verdict leans red (for the scripters)")
  .option("--ignore <category>", "Skip a category (e.g. controlling, care) — repeatable")
  .option("--json [file]", "JSON output")
  .option("--md [file]", "Markdown output")
  .option("--quiet", "No pretty output")
  .option("--no-color", "Disable colors")
  .action(run);

cli.help();
cli.version(VERSION);

try {
  cli.parse();
} catch (err) {
  fail((err as Error).message);
}
