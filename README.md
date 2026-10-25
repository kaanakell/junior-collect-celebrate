# Collect & Celebrate (Junior assignment)

A small PixiJS + TypeScript demo. Three reward tokens (10, 20, 30) fly from a
play area into a collection container. Each arrival updates the total and the
progress indicator. The third arrival triggers a distinct reward activation
effect, followed by a result window.

## Run

Requirements: Node.js 20.19+ or 22.12+ (newer versions also work) and npm
(developed and checked with Node v24.22.1).

    npm install
    npm run dev       # dev server, usually http://localhost:5173
    npm run build     # type-check + production build

Checked in Opera GX (Chromium 153.0.8010.55) on Windows, at a 1280 x 720 viewport.
Stack: PixiJS 8, TypeScript, Vite.

## Time spent

About 4 hours in total, including setup, checks, the recording and this README.

## Where to change timings

All durations are in `src/config.ts` under `CONFIG.timing` (milliseconds):

| Key                | Value | Meaning                                   |
|--------------------|-------|-------------------------------------------|
| `revealMs`         | 600   | Reveal pulse before any token moves       |
| `launchIntervalMs` | 200   | Delay between consecutive launches        |
| `flightMs`         | 450   | Duration of one token flight              |
| `activationMs`     | 1200  | Reward activation effect                  |
| `hitMs`            | 250   | Ordinary hit effect (my choice)           |

Layout, colours, effect sizes and token values live in the same file.

## How the sequence works

`Game.play()` in `src/game.ts` is one async function that reads top to bottom:

1. Reveal pulse -> 2. staggered launches (flights overlap) -> 3. arrivals ->
4. activation on the third arrival -> 5. result window -> 6. back to ready.

- **One clock.** All timing comes from the Pixi ticker (`src/tween.ts`),
  not from `setTimeout`, so everything is frame-synchronised.
- **State first, effect second.** On arrival, total and progress are updated
  immediately; the visual effect is awaited afterwards.
- **One run at a time.** `play()` checks and sets a `state` flag
  (`ready` / `running` / `result`) with no `await` in between, so repeated
  clicks cannot start a second run. The Play button is also disabled.
- **Depth.** The container is drawn in two layers (back and front). Tokens live
  in a layer between them, so they pass behind the front edge and are fully
  hidden before they are switched off.
- **Result window.** `ResultWindow.show()` returns a Promise that resolves when
  Close is pressed. A full-size backdrop swallows clicks, and Close sits far
  from the Play button, so a double click on Close cannot reach Play.

## Project structure

    src/config.ts         all tunable values (timings, layout, colours)
    src/scene.ts          play area, container (back/front), tokens
    src/hud.ts            total and progress display
    src/effects.ts        hit effect and activation effect
    src/result-window.ts  result window (HTML overlay)
    src/game.ts           state and the play sequence
    src/tween.ts          frame-based animate/wait helpers and easing
    src/main.ts           wiring

## Checks performed

- Played the full sequence more than five times; totals 10 -> 30 -> 60 and progress
   1/3 -> 2/3 -> 3/3, reaching exactly 60 each time.
- Confirmed from the console log that totals change on arrival, not on launch.
- Clicked Play repeatedly during reveal, flights, activation and while the
  result window was open: no second run started (one `run start` per run).
- Also called `play()` twice in the same click handler as a temporary test:
  the state guard still allowed only one run.
- Double-clicked Close: the window closed and no new run started.
  Closed with the keyboard (Enter/Space) as well.
- Changed `flightMs` (1500), `activationMs` (3000) and `hitMs` (800) to check
  that the sequence, totals and cleanup stay correct; then restored the values.
- Checked container edge layering, text readability and cleanup after repeated
  runs (no leftover particles, highlights or totals).
- Resized the window below 1280 x 720, both idle and during a run: the stage 
  scales down and stays fully visible.
- `npm run build` passes.

## Known issues / limitations

- The stage is a fixed 1280 x 720 design that is scaled down uniformly (CSS
  transform) to fit smaller windows. It is not a responsive layout (mobile
  layouts were out of scope for the junior brief), and it never scales up.
- Switching tabs mid-run pauses the animation, because the browser pauses
  `requestAnimationFrame`. Not handled.
- No sound, as specified.

## One AI-generated problem I corrected

The assistant suggested moving the shared button styling from `#play-btn`
into a reusable `.btn` class. This needed a matching `class="btn"` in the HTML
as well as the CSS change. I applied the CSS but missed the HTML class, so the
Play button lost its styling and looked different from the Close button.
I noticed the inconsistency visually, traced it to the missing class on the
Play button and fixed it. Lesson: when a suggested refactor touches several
files, I now check each place it needs to change, and compare the result on screen.

I also hit a tooling problem: the suggested `npm create vite@latest` crashed
on my Node 20.11.1 (`'node:util' does not provide an export named 'styleText'`).
I read the stack trace, upgraded to Node 24, and documented the supported
Node versions in this README.