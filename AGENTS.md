<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FrameIt

## Project Overview

FrameIt is a Picture Frame Calculator — a single-page Next.js app where users pin one dimension (artwork, frame outer, or mat board) and get computed wood cut dimensions, mat/glass orders, and an interactive SVG diagram of the frame assembly for the rest.

## Commands

- `npm run dev` — Start dev server (default port 3000)
- `npm run build` — Production build. With `output: "export"` set in `next.config.ts`, this emits a fully static site to `out/` (`index.html`, `404.html`, `_next/static/**`). Also runs TypeScript type checking.
- `npm run start` — Serve production build (rarely useful for a static-export app; prefer `npx serve out`)
- `npm run deploy` — `next build` then `firebase deploy --only hosting`. Requires `firebase-tools` and `firebase login`.

No test framework or linter is currently configured.

## Architecture

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

The app is a single client-side page with three layers:

- **`app/page.tsx`** — State owner. Holds `FrameInputs` in React state, memoizes a single `FrameGeometry` via `frameGeometry()`, passes it as one `geo` prop to each child. Hydrates from `localStorage` under `frameit:inputs:v2` with a one-shot migration from the pre-modes `v1` shape.
- **`components/ControlsPanel.tsx`** — Left panel (380px). Mode segmented control (Artwork / Frame / Mat), dimension inputs whose meaning depends on `geo.mode`, sliders for mat/frame parameters, and the computed cut list card. Reads `geo` for both input values (echoed via `geo.inputWidth`/`inputHeight`) and derived dimensions. Uses `components/Slider.tsx` for styled range inputs.
- **`components/FrameDiagram.tsx`** — Right panel. SVG visualization with proportionally-scaled nested rectangles (frame → mat → artwork), dimension annotation lines, and Mat/Glass Overview inset panels. All dimensions read from `geo` — no inline arithmetic, mode-agnostic.
- **`lib/calculations.ts`** — Pure functions and the single source of truth for geometry. `FrameInputs` carries a `mode: "artwork" | "frameOuter" | "matBoard"` discriminator plus one `inputWidth`/`inputHeight` pair whose interpretation depends on mode. `frameGeometry(inputs)` derives canonical artwork dimensions by inverting when mode ≠ artwork, clamps non-positive results to a tiny minimum, and sets `geo.artInvalid` so the UI can warn. Downstream formulas are invariant: mat opening = artwork − 2×overlap; mat board = opening + 2×mat + 2×rabbet; frame outer = opening + 2×mat + 2×frame (rabbet excluded — the board tucks behind the frame lip). `switchMode(prev, next)` is a pure helper that re-seeds `inputWidth`/`inputHeight` from current geometry so toggling modes leaves the diagram pinned. `formatFraction()` / `formatPair()` handle display.

## Deployment

The site ships as a **static export** hosted on **Firebase Hosting** (project `frameit-af772`, custom domain `frameit.happilynerdy.com`). Because the app is fully client-side (no API routes, server actions, middleware, or `next/image` remote loaders), `output: "export"` in `next.config.ts` is safe — preserve this constraint. Adding any server-only Next.js feature will break the build.

Auto-deploy is wired via `.github/workflows/firebase-hosting-merge.yml`: every push to `main` runs `npm ci && npm run build` and deploys `out/` to the `live` channel. PR previews come from `.github/workflows/firebase-hosting-pull-request.yml`. Both use the `FIREBASE_SERVICE_ACCOUNT_FRAMEIT_AF772` repo secret.

## Design Source

`design.pen` is the Pencil design file. It is encrypted and must be read/written exclusively through Pencil MCP tools (`batch_get`, `batch_design`, `get_screenshot`, etc.). Never use `Read` or `Grep` on `.pen` files.

## Key Design Tokens

Colors: `#4A6FA5` (primary blue), `#C25B56` (red accent), `#D4933A` (orange), `#2C2C2C` / `#6B6860` / `#9A968E` (text hierarchy), `#F8F6F1` (cream bg), `#D4D0C8` (borders), `#8B7355` / `#A89070` (wood tones).

Fonts: Geist (sans) and Geist Mono (monospace), loaded via `next/font/google`.
