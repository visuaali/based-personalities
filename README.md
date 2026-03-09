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
# ✦ Based Personalities

> *Know thyself — on-chain.*

A Web3 personality + astrology app that synthesizes 9 ancient and modern traditions into a single soul map. Built with React + Vite. Payments in USDC on Base. Identity minted as a Soulbound NFT.

-----

## What It Does

Enter your birth date, time, and location. Based Personalities calculates your profile across 9 systems simultaneously:

|System             |What It Reveals                                                |
|-------------------|---------------------------------------------------------------|
|🌞 Western Astrology|Sun sign, 12 houses (5 house systems), modality & element      |
|🕉 Vedic Jyotish    |Rashi, Nakshatra + Pada, Bhava, Vimshottari Dasha timeline     |
|☯ Mayan Tzolkin    |Kin number, Day Sign, Galactic Tone, Haab calendar, Year Bearer|
|☯ Chinese Zodiac   |Animal, element, yin/yang polarity                             |
|⊕ Life Path        |Pythagorean numerology, master numbers 11/22/33                |
|◑ MBTI             |16 personality types, cognitive function stack                 |
|⬡ Enneagram        |9 archetypes, core wound, shadow & growth paths                |
|◈ Big Five (OCEAN) |Percentile scoring across 5 dimensions                         |
|◎ Human Design     |Type, Profile, defined/undefined centers                       |

Then a cross-system **Soul Synthesis** finds patterns across all active traditions — contradictions, resonances, and your core architecture.

-----

## Access Tiers

|Tier           |Price          |NFT           |Unlocks                                          |
|---------------|---------------|--------------|-------------------------------------------------|
|**Soul Seed**  |Free           |◎ Dormant     |Astrology (Western, Mayan, Chinese, Life Path)   |
|**Spark Soul** |$1 USDC / test |◑ Awakening   |Any individual personality test, permanently     |
|**Seeker Soul**|$9 USDC / month|⬡ Illuminated |All tests + AI synthesis (5 analysis sections)   |
|**Oracle Soul**|$12 USDC / year|✦ Transcendent|Everything + Past Lives section ($1/mo effective)|

Every paid action mints or evolves your **Soulbound ERC-721 NFT** on Base — a permanent on-chain record of your soul map. NFTs are non-transferable.

-----

## AI Analysis

The AI panel produces a tiered personality report with sections unlocked by access level:

- **Core Wiring** — how your MBTI + Enneagram combine into a coherent cognitive style *(free preview)*
- **Career & Purpose** — ideal environments, shadow traps, work style *(Spark+)*
- **Love & Relating** — attachment style, relationship needs, growth edge *(Seeker+)*
- **Shadow Work** — core wound, defense mechanisms, integration path *(Seeker+)*
- **Growth Path** — your highest expression across all 9 systems *(Seeker+)*
- **Past Lives / Karmic** — Vedic karmic axis, nodal story *(Oracle only)*

Locked sections are visible but blurred — you can read enough to know you want it.

-----

## Stack

```
React 18 + Vite 5
No external UI library — all CSS-in-JS inline styles
No backend — all calculations run in the browser (pure JS)
USDC on Base (L2) for payments
ERC-721 Soulbound NFTs on Base
Fonts: Cinzel Decorative · Cormorant Garamond · JetBrains Mono
```

-----

## Getting Started

```bash
git clone https://github.com/yourhandle/based-personalities
cd based-personalities
npm install
npm run dev
```

Open <http://localhost:5173>

-----

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
