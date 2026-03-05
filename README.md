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
├── CLAUDE.md              ← AI context file (architecture map for Claude Code)
├── index.html             ← Font preloads
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx           ← React entry point
    └── App.jsx            ← Full app (~2500 lines, single file)
```

### Inside App.jsx

**Data layer** (top of file):

- `getWesternSign(month, day)` — tropical zodiac with cutoffs lookup table
- `getVedicData(month, day, year)` — Lahiri ayanamsa, sidereal Rashi + Nakshatra
- `getMayanTzolkin(year, month, day)` — Dreamspell, anchored Jul 26 1987 = Kin 1
- `getCZ(year)`, `getLP(dateStr)` — Chinese zodiac, Life Path numerology
- `MBTI_D`, `ENNEA`, `HD_TYPES`, `B5_DIMS`, `BQ` — personality system data

**Access system**:

- `TIERS` — free / test / monthly / annual definitions
- `NFT_LEVELS` — 4 soul card levels tied to tiers
- `ANALYSIS_LEVELS` — maps tier to unlocked AI sections
- `getAccessLevel(purchasedTests, plan)` → 0–3
- `canAccess(testId, purchasedTests, plan)` → boolean

-----

## Astrology Calculation Notes

**Western** — Tropical zodiac. Fixed cutoff lookup table (corrected Nov 2024 — previous formula had an off-by-one error that broke all 12 signs).

**Vedic** — Lahiri ayanamsa. Year-aware formula:

```
ayanamsa = 23.8567° + (year − 2000) × 0.01396°
```

Grows ~50.3 arcseconds/year. Nakshatra calculated from sidereal longitude with Pada (1–4).

**Mayan Dreamspell** — Epoch: **Jul 26, 1987 = Kin 1 (1 Imix)**. Verified: Aug 16, 1987 (Harmonic Convergence) = Kin 22 (9 Ik/Wind) ✓. Includes Galactic Spin counter.

**Life Path** — Pythagorean (sum all digits, reduce, preserve master numbers 11/22/33).

-----

## Big Five — Manual Entry

If you already know your OCEAN scores from another assessment, choose **“I Know My Scores”** on the Big Five screen. Quick-fill presets (INTJ-ish, ENFP-ish, etc.) let you calibrate before adjusting sliders.

Recommended free assessments to get valid scores:

- [IPIP-NEO](https://ipip.ori.org) — 60 questions, research-grade
- [16Personalities](https://16personalities.com) — includes OCEAN breakdown
- [Open Psychometrics](https://openpsychometrics.org) — anonymous, academic

-----

## Roadmap

- [ ] Split `App.jsx` into `data/`, `components/`, `hooks/`
- [ ] Real wallet connection — wagmi + viem
- [ ] Real USDC payments — Base mainnet
- [ ] Real NFT minting — thirdweb or Zora SDK
- [ ] Real AI analysis — Anthropic API backend route
- [ ] Farcaster auth — farcaster-auth-client
- [ ] Rising sign — requires birth time + lat/lng house cusp calculation
- [ ] Compatibility reports — cross-user soul map comparison
- [ ] State persistence — localStorage or on-chain

-----

## Philosophy

Most personality apps give you one lens. Based Personalities gives you nine — and then looks for what they agree on.

The soul synthesis engine finds patterns across traditions that developed independently across millennia: where your Vedic Nakshatra lord matches your Enneagram core wound, where your Mayan Galactic Tone resonates with your MBTI cognitive stack, where contradictions in your chart reveal your growth edge.

The NFT isn’t a flex. It’s a timestamped, immutable record of where you were in your self-understanding at this moment. It evolves as you do.

-----

## License

MIT — build on it, fork it, make it yours.

-----

*Built with Claude · Deployed on Base · Minted on-chain*