# SAGE Smart Budgeting — Interactive Prototype

HCDE Capstone 2026 · UW Research × ORIS

An interactive prototype layered on top of the [Figma wireframes](https://www.figma.com/design/6DGhaN3FEcfwAi3ucDi76N) so reviewers can click through the flow and feel the interactions, not just see the screens.

> **Live demo:** https://hcdeorbit.netlify.app/
> **Figma source of truth:** https://www.figma.com/design/6DGhaN3FEcfwAi3ucDi76N
> **Live mockup (legacy):** https://sage-uw-312654455232.us-west1.run.app

## What this is

Four screens implementing the green/purple memo features from the Capstone trust-mapping board:

| Screen | What it shows |
|---|---|
| **Summary** | eGC1 vs NoA delta, shortfall callout, AI disclaimer, primary CTA to settings |
| **Budget Settings** | Pre-fill source labels, identical SAGE layout, hover-source preview popovers |
| **Budget Worksheet** | Excel-embedded grid + SAGE Add-In side panel, live reconciliation, multi-issue Mismatch panel, AI confidence chips, source tags, stale-data indicators, AI value suggestions, PDF preview with doc↔row link |
| **Import to SAGE** | Mapping preview, pre-submission checklist with PI SFI gate, comment thread, Submit ASR |

Try the toggles and CTAs. The AI assist toggle (top of Worksheet) makes the system's auto-derivations visible/invisible — flip it off and watch the salary cells go blank with `Enter manually` placeholders.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (color tokens defined in `src/index.css` `@theme` block, sampled directly from the wireframe PNGs)
- **Inter** typeface (loaded from rsms.me/inter)
- No router — single-page state-based screen switching (intentional; this is a prototype, not a product)

## Project structure

```
src/
├── App.tsx        State management + screen routing
├── ui.tsx         Shared atoms (Button, Pill, ConfidenceChip, IssuesPanel, Sidebar, Header, etc.)
├── screens.tsx    The four screens (SummaryScreen, SettingsScreen, WorksheetScreen, ImportScreen)
├── index.css      Tailwind + SAGE theme tokens
└── main.tsx       Entry point
```

## How to collaborate

**Designers / sponsors / advisors → just open the live URL.** No installs.
- Visual feedback → leave it in Figma (the source of truth)
- Interaction feedback → leave it in Slack or in a GitHub Issue

**Code contributors → branch + PR.**
- Each branch gets a Netlify Deploy Preview at `https://deploy-preview-{n}--{site}.netlify.app/`
- Type-check runs in CI on every PR (`.github/workflows/typecheck.yml`)
- Tokens come from Figma — do **not** invent new colors in code

## Local development (only if you're touching code)

```bash
npm install
npm run dev          # starts Vite at http://localhost:5174/
npm run build        # production build into dist/
```

## Deploy

Pushes to `main` auto-deploy to Netlify (production).
Pull requests get preview URLs.

Build configuration is in `netlify.toml`:
- Build command: `npm run build`
- Publish dir: `dist`
- Single-page-app fallback to `/index.html`

## License

This prototype is for academic + sponsor review (UW Capstone 2026). Not for redistribution.
