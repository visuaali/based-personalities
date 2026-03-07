# Based Personalities

**Generate and explore Big Five (OCEAN) personality profiles — instantly, reproducibly, and shareably.**

[**Live demo →**](https://visuaali.github.io/based-personalities/)

---

## Features

- **Big Five model** — openness, conscientiousness, extraversion, agreeableness, neuroticism (each 0–100)
- **Seeded generation** — same seed always produces the same personality (great for NPCs, test fixtures, etc.)
- **Manual mode** — drag sliders to craft a personality by hand
- **Shareable links** — every result encodes to a URL you can copy and share
- **JSON export** — copy the raw trait data with one click
- **Zero dependencies** for the web app — plain HTML, CSS, and JS

---

## Live App

Open [`docs/index.html`](docs/index.html) in any browser, or visit the [GitHub Pages site](https://visuaali.github.io/based-personalities/).

---

## Getting Started (Node.js API)

```bash
npm install
```

```js
const { generatePersonality, validatePersonalityInput } = require('.');

// Random personality
const p = generatePersonality('Alice');
console.log(p.toJSON());

// Reproducible (seeded)
const p2 = generatePersonality('Bob', { seed: 1337 });
console.log(p2.dominanceScore());

// Validate raw input before construction
const { valid, errors } = validatePersonalityInput({ name: 'Carol', traits: { openness: 80 } });
```

### Run tests

```bash
npm test
npm run test:coverage
```

---

## Project Structure

```
based-personalities/
├── src/
│   ├── index.js                  # Public API entry point
│   ├── models/personality.js     # Personality class (OCEAN traits)
│   ├── generators/
│   │   └── personalityGenerator.js  # Seeded random generation (mulberry32)
│   └── validators/
│       └── inputValidator.js     # Input validation (returns errors, doesn't throw)
├── tests/
│   ├── unit/                     # Per-module unit tests
│   └── integration/              # Pipeline integration tests
├── docs/                         # Static web app (GitHub Pages)
│   ├── index.html
│   ├── app.js
│   └── style.css
└── .github/workflows/pages.yml   # Auto-deploy to GitHub Pages on push
```

---

## API Reference

### `generatePersonality(name, options?)`

| Param | Type | Description |
|-------|------|-------------|
| `name` | `string` | Display name for the personality |
| `options.seed` | `number` | Optional integer seed for reproducibility |

Returns a `Personality` instance.

### `Personality`

| Member | Description |
|--------|-------------|
| `.name` | Trimmed display name |
| `.traits` | `{ openness, conscientiousness, extraversion, agreeableness, neuroticism }` — each 0–100 |
| `.toJSON()` | Serialise to a plain object |
| `Personality.fromJSON(data)` | Reconstruct from a plain object |
| `.dominanceScore(weights?)` | Weighted average of traits (default: equal weights) |

### `validatePersonalityInput(input)`

Returns `{ valid: boolean, errors: string[] }`. Never throws.

---

## GitHub Pages Setup

1. Go to **Settings → Pages** in your GitHub repo
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow in `.github/workflows/pages.yml` deploys `docs/` automatically

---

## Contributing

1. Fork and clone the repo
2. `npm install`
3. Make changes with tests (`npm test`)
4. Open a pull request

---

## License

MIT
