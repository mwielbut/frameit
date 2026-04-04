# FRAMEIT

A picture frame calculator that computes wood cut dimensions for custom frames. Enter your artwork size and frame parameters, and get an instant cut list with an interactive assembly diagram.

Live at **[frameit.happilynerdy.com](https://frameit.happilynerdy.com)**.

![FRAMEIT Screenshot](public/screenshot.png)

## Features

- Artwork dimension inputs (width & height)
- Adjustable mat width, mat overlap, frame width, and rabbet depth via sliders
- Real-time cut list: long/short side lengths, miter angle, outer dimensions, total lumber
- Interactive SVG diagram showing frame assembly top-down view with dimension annotations and corner detail

## Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

Produces a static site in `out/` (configured via `output: "export"` in `next.config.ts`). Preview it locally with any static server, e.g. `npx serve out`.

## Deployment

Hosted on Firebase Hosting. Pushes to `main` auto-deploy via GitHub Actions (`.github/workflows/firebase-hosting-merge.yml`); pull requests get preview URLs via `.github/workflows/firebase-hosting-pull-request.yml`. To deploy manually:

```bash
npm run deploy
```
