# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

**Theo** is a Progressive Web App (PWA) contraction timer for pregnancy labor monitoring. Built with Vite + React + TypeScript. Free, ad-free, fully offline, data stored locally in the browser.

## Build & Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server on port 3000
npm run build     # TypeScript check + production build to dist/
npm run preview   # Preview production build locally
```

## Deployment

Deployed to GitHub Pages via GitHub Actions. Push to `main` or `feat/nate/beginning` triggers auto-deploy.

Live at: `https://hellonathanchung.github.io/theo/`

## Project Structure

```
theo/
├── index.html              # Entry HTML with PWA meta tags
├── vite.config.ts          # Vite config (base: /theo/ for GH Pages)
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker (offline support)
│   └── icon-*.png          # App icons
├── src/
│   ├── main.tsx            # React entry point + SW registration
│   ├── App.tsx             # Root component with tab navigation
│   ├── index.css           # Global styles + CSS variables
│   ├── types.ts            # TypeScript interfaces
│   ├── components/
│   │   ├── TimerScreen.tsx     # Main timer with start/stop button
│   │   ├── HistoryScreen.tsx   # Full contraction list + stats
│   │   ├── SettingsScreen.tsx  # Presets (5-1-1, 4-1-1) + custom thresholds
│   │   └── AlertBanner.tsx     # Slide-down alert when thresholds met
│   ├── hooks/
│   │   ├── useContractions.ts  # Core state management
│   │   └── useTimer.ts        # Timestamp-based timer logic
│   └── utils/
│       ├── alerts.ts           # Pure function: evaluate thresholds
│       ├── format.ts           # Time formatting helpers
│       └── storage.ts          # localStorage persistence
└── .github/workflows/
    └── deploy.yml          # GitHub Pages deploy action
```

## Features

- **Track Contractions** — Start/end timing with color-shifting visual feedback
- **Local Storage** — All data in localStorage, no accounts, no backend
- **Alert Presets** — 5-1-1 and 4-1-1 rules, plus fully custom thresholds
- **Smooth Transitions** — Background shifts cream → green as urgency increases
- **Notifications** — Web push when thresholds are met
- **PWA** — Installable to home screen, works offline
- **Free & Ad-Free** — No cost, no tracking, no ads

## Color Theme (Pastel Green)

- **Cream**: #F5FAF5 (background)
- **Beige**: #E8F0E8 (alternating rows)
- **Soft Green**: #C8E6C9 (active contraction bg)
- **Medium Green**: #A5D6A7 (approaching alert bg)
- **Green**: #81C784 (button resting)
- **Deep Green**: #4CAF50 (accent, active tab)

## Notes

- Portrait mode only (pregnancy labor monitoring)
- Contractions stored until manually cleared
- Free and ad-free by design
