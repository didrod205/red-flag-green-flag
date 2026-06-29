# red-flag-green-flag 🚩🟢

**Paste what your date said or did. Get the red flags 🚩 and green flags 🟢 decoded into what they actually mean — with zero AI.**

> “Doesn’t believe in labels” → 🚩 *wants you available, but never accountable.*
> “We don’t need a title” → 🚩 *I want plausible deniability.*
> “Text me when you get home safe” → 🟢 *genuinely cares whether you’re okay.*
> “I’m sorry, that was on me” → 🟢 *accountability without being dragged to it.*

A tiny, **100% local, rule-based** tool that scans a text/chat against a curated
database of dating red and green flags, decodes each one, and **calls it** —
🚩 *Run*, 🟢 *Keep them*, or 🤔 *Mixed signals*. No API key, no model,
**nothing leaves your machine** (which matters when you’re pasting the texts).

### 🌐 [**Try it in your browser →**](https://didrod205.github.io/red-flag-green-flag/)

Paste the texts. Watch the flags split left (🟢) and right (🚩). Nothing is uploaded — the whole engine runs client-side.

```bash
npx red-flag-green-flag "he said he doesn't believe in labels, but he texts me when I get home safe"
```

```
  Mixed signals 🤔
  🟢 ██████████░░░░░░░░░░ 🚩
  1 red · 1 green

  🚩 Red flags → what it really means
    “doesn't believe in labels” · Commitment-avoidant
      ↳ Wants you available, but never accountable.

  🟢 Green flags → what it really means
    “texts me when I get home safe” · Caring
      ↳ Genuinely cares whether you're okay.
```

## Why

“Red flag or green flag?” is how a whole generation talks about dating. This puts
a tiny engine behind the meme: it highlights the tells in what someone said or
did, sorts them into 🚩 and 🟢, decodes each into plain language, and tilts a
needle toward *run* or *keep them*.

It’s **a meme, not couples therapy.** A single phrase is never a verdict on a
person — “I hate drama” from your funniest friend is a joke; from the person who
starts all the drama, it’s a flag. Read the flags here; read the room yourself.

## Install

```bash
npm i -g red-flag-green-flag     # then:  red-flag-green-flag chat.txt
# or zero-install:
npx red-flag-green-flag chat.txt
```

## Usage

```bash
red-flag-green-flag "paste what they said right here"   # a string
red-flag-green-flag chat.txt                            # a file
pbpaste | red-flag-green-flag                            # the clipboard (macOS)
red-flag-green-flag chat.txt --md > flags.md             # Markdown tables
red-flag-green-flag chat.txt --json                      # machine-readable
```

`flagcheck` is a shorter alias for the same command.

### Flags

| Flag | What it does |
| --- | --- |
| `--md [file]` | Markdown tables (🚩 red and 🟢 green) |
| `--json [file]` | Full report as JSON |
| `--ignore <category>` | Skip a category (repeatable) |
| `--fail-on-red` | Exit `1` if the verdict leans red (for the scripters) |
| `--quiet` | No pretty output |
| `--no-color` | Disable ANSI colors |

## The flags

| 🚩 Red | 🟢 Green |
| --- | --- |
| **Commitment-avoidant** — “let’s keep it casual”, “we don’t need a title” | **Communicates** — “can we talk about it”, “I was wrong” |
| **Manipulation** — “you’re overreacting”, “if you really loved me” | **Respects boundaries** — “only if you want to”, “what are you comfortable with” |
| **Dishonesty** — “my ex is crazy”, “it’s complicated” | **Self-aware** — “I talked to my therapist about it” |
| **Disrespect** — “k”, “it was just a joke” | **Makes an effort** — “I made a reservation”, “I remembered you said” |
| **Emotionally unavailable** — “u up”, “we should hang out sometime” | **Caring** — “text me when you get home safe”, “I’m proud of you” |
| **Controlling** — “who were you with”, “why didn’t you reply” | |

## Library

The core is pure and browser-safe (no `node:*`):

```ts
import { analyze } from "red-flag-green-flag";

const r = analyze("doesn't believe in labels, but texts me good morning every day");
r.verdict.band;   // "mixed"
r.verdict.tilt;   // 0 (all green) … 50 (even) … 100 (all red)
r.red[0];         // { match: "doesn't believe in labels", category: "avoidant", decode: "…", count: 1 }
r.green;          // [...]
```

## How the verdict works

Each flag carries a weight. We sum the red weights and the green weights
separately (no length normalization — a flag is a flag in a one-liner or a
paragraph), tilt a needle by their ratio, and call it:

| Verdict | When | |
| --- | --- | --- |
| **Green flag — keep them** | green clearly outweighs red | 🟢 |
| **Mixed signals** | both sides show up | 🤔 |
| **Leaning red** | red edges ahead | 🚩 |
| **Red flag. Run.** | red runs away with it | 🚩🏃 |

## Privacy

Everything runs locally — CLI and playground both. Open the network tab on the
site; nothing leaves. No telemetry, no account, no upload. The screenshots you
take are the only thing that goes anywhere, and that’s your call.

## Contributing

The most useful contribution is **a new flag** — the phrase, whether it’s 🚩 or
🟢, the category, and an honest, funny-but-true decode. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © [didrod205](https://github.com/didrod205)

---

<sub>A rule-based decoder, not a relationship oracle. It reads the *clichés* — your judgment reads the room.</sub>

## 💖 Sponsor

Find this useful? [**Sponsor on GitHub**](https://github.com/sponsors/didrod205) — it keeps these projects maintained.

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-db61a2?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/didrod205)
