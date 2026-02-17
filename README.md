# iPG Upgraded — YC Interview Simulator

A modern, upgraded version of [iPG](https://github.com/jamescun/iPG) by James Cunningham and Colin Hayhurst. Practice answering Y-Combinator–style interview questions with a timer and tips.

## Features

- **Timer options** — 15s, 30s, 45s, 1 min, 2 min, or no timer
- **Question categories** — Product, Traction & Growth, Team, Business & Money, Competition, General. Choose which categories to practice.
- **Session length** — 10, 20, 30, 50 questions or all
- **Pro tips** — Rotating advice (concise answers, match their tempo, etc.)
- **Session summary** — After finishing, see how many questions you did and total time
- **Light/dark theme** — Toggle and preference is saved
- **Keyboard** — `Enter` = next question, `Space` = restart timer
- **No dependencies** — Vanilla HTML, CSS, and JavaScript. No jQuery or build step.

## How to run

Open `index.html` in a browser (double-click or use a local server):

```bash
# Optional: serve locally to avoid CORS with file://
npx serve .
# or: python -m http.server 8000
```

Then go to the URL shown (e.g. http://localhost:3000).

## File structure

- `index.html` — Markup and structure
- `style.css` — Layout, theming, responsive styles
- `data.js` — Questions (with categories) and tips
- `app.js` — Timer, session flow, keyboard, settings

## Credits

Original iPG by James Cunningham and Colin Hayhurst for [GoScale](https://goscale.com)’s YC S12 interview. This version is an independent upgrade with more options and a modern UI.
