# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FrameIt is a Picture Frame Calculator — a single-page Next.js app where users input artwork dimensions and frame parameters, and get computed wood cut dimensions with an interactive SVG diagram of the frame assembly.

## Commands

- `npm run dev` — Start dev server (default port 3000)
- `npm run build` — Production build. With `output: "export"` set in `next.config.ts`, this emits a fully static site to `out/` (`index.html`, `404.html`, `_next/static/**`). Also runs TypeScript type checking.
- `npm run start` — Serve production build (rarely useful for a static-export app; prefer `npx serve out`)
- `npm run deploy` — `next build` then `firebase deploy --only hosting`. Requires `firebase-tools` and `firebase login`.

No test framework or linter is currently configured.

## Architecture

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4

The app is a single client-side page with three layers:

- **`app/page.tsx`** — State owner. Holds all calculator inputs in React state, computes derived results via `calculateFrame()`, passes props down.
- **`components/ControlsPanel.tsx`** — Left panel (380px). Artwork size inputs, sliders for mat/frame parameters, and the computed cut list card. Uses `components/Slider.tsx` for styled range inputs.
- **`components/FrameDiagram.tsx`** — Right panel. SVG visualization with proportionally-scaled nested rectangles (frame → mat → artwork), dimension annotation lines, and a corner detail inset.
- **`lib/calculations.ts`** — Pure functions. `calculateFrame()` computes outer dimensions, cut lengths, and total lumber. `formatFraction()` converts decimals to display fractions (e.g., 0.25 → "1/4"). Key formula: outer dimension = artwork + 2×mat + 2×frame (mat overlap does not affect outer size).

## Deployment

The site ships as a **static export** hosted on **Firebase Hosting** (project `frameit-af772`, custom domain `frameit.happilynerdy.com`). Because the app is fully client-side (no API routes, server actions, middleware, or `next/image` remote loaders), `output: "export"` in `next.config.ts` is safe — preserve this constraint. Adding any server-only Next.js feature will break the build.

Auto-deploy is wired via `.github/workflows/firebase-hosting-merge.yml`: every push to `main` runs `npm ci && npm run build` and deploys `out/` to the `live` channel. PR previews come from `.github/workflows/firebase-hosting-pull-request.yml`. Both use the `FIREBASE_SERVICE_ACCOUNT_FRAMEIT_AF772` repo secret.

## Design Source

`design.pen` is the Pencil design file. It is encrypted and must be read/written exclusively through Pencil MCP tools (`batch_get`, `batch_design`, `get_screenshot`, etc.). Never use `Read` or `Grep` on `.pen` files.

## Key Design Tokens

Colors: `#4A6FA5` (primary blue), `#C25B56` (red accent), `#D4933A` (orange), `#2C2C2C` / `#6B6860` / `#9A968E` (text hierarchy), `#F8F6F1` (cream bg), `#D4D0C8` (borders), `#8B7355` / `#A89070` (wood tones).

Fonts: Geist (sans) and Geist Mono (monospace), loaded via `next/font/google`.

@AGENTS.md
