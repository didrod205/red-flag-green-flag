# Contributing to red-flag-green-flag

Thanks for your interest! The most welcome contribution is a **new flag** — a
phrase people actually say or text, whether it’s 🚩 red or 🟢 green, the category
it belongs to, and an honest decode of what it really signals.

## Getting started

```bash
git clone https://github.com/didrod205/red-flag-green-flag.git
cd red-flag-green-flag
npm install
npm test            # vitest
npm run typecheck
npm run build       # tsup → dist/
npm run dev         # the playground at localhost:5173
npm run example     # score the bundled red sample
```

## Project layout

```
src/
  flags.ts      # the curated database: { text, category, weight, decode } (pure)
  analyze.ts    # run the flags → red/green findings + dedupe overlaps (pure)
  score.ts      # two-sided weight → tilt + verdict band (pure)
  highlight.ts  # findings → plain/flagged segments for rendering (pure)
  config.ts / load-config.ts
  report/       # console (two columns) / markdown (two tables) / json
  cli.ts        # cac CLI
web/            # the Vite playground (reuses src/ directly)
tests/          # detection + calibration + comma/apostrophe/span checks
```

## Adding a flag

Add an entry to `FLAGS` in `src/flags.ts`:

```ts
{ text: "i don't usually open up like this", category: "manipulation", weight: 3,
  decode: "Love-bombing — manufactured intimacy, fast." },
```

- **`text`** — lowercase, straight apostrophes (`'`), written the way the person
  would actually say it (usually first-person: “I made a reservation”). Spaces
  match any whitespace **and** an optional comma, and `i'm` matches `i’m`.
- **`category`** decides the **polarity** automatically (see `POLARITY_OF` in
  `src/types.ts`): `avoidant | manipulation | dishonesty | disrespect | unavailable | controlling`
  are 🚩 red; `communication | respect | growth | effort | care` are 🟢 green.
- **`weight`** — roughly 1 (mild) to 4 (blaring). “If you really loved me” is a 4.
- **`decode`** — the honest, funny-but-*true* translation. Short and sharp.

Add a test: the flag fires on an obvious example, and the calibration tests stay
green (the red sample says *run*, the green sample says *keep them*).

## The one rule

This is **a meme, not couples therapy.** Don’t add flags that fire on warm,
ordinary messages — a sweet “good morning” must not get someone branded. Tone is
context: a phrase earns a place only if it’s a widely-recognized tell, and the
decode has to be *true*, not just cynical. False positives turn a fun tool into
one that makes people paranoid about their relationships.

## Quality bar

- [ ] `npm run typecheck && npm test && npm run build` pass.
- [ ] Calibration holds (ordinary kind messages stay green/neutral).
- [ ] The core imports no `node:*` — keep it browser-safe (the playground needs it).
