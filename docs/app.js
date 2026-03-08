/* ─── API config ─────────────────────────────────────────────────────────── */
// Set window.ANALYSE_API_URL before this script loads to point at a deployed
// backend, e.g.: <script>window.ANALYSE_API_URL = 'https://my-server.example.com/analyse';</script>
const ANALYSE_API_URL = (typeof window !== 'undefined' && window.ANALYSE_API_URL) || 'http://localhost:3000/analyse';

/* ─── Core logic (inlined from src/ — no build step required) ────────────── */

const TRAITS = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
const TRAIT_MIN = 0;
const TRAIT_MAX = 100;
const NAME_MAX_LENGTH = 100;

/** mulberry32 PRNG — same algorithm as src/generators/personalityGenerator.js */
function createRng(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampTrait(v) {
  return Math.min(TRAIT_MAX, Math.max(TRAIT_MIN, v));
}

/** Generate traits from a seed (or Date.now() when seed is undefined). */
function generateTraits(seed) {
  const rng = createRng(seed !== undefined ? seed : Date.now());
  const traits = {};
  for (const trait of TRAITS) {
    traits[trait] = Math.round(rng() * (TRAIT_MAX - TRAIT_MIN) + TRAIT_MIN);
  }
  return traits;
}

/** Weighted dominance score (equal weights by default). */
function dominanceScore(traits) {
  const w = 1 / TRAITS.length;
  let total = 0;
  for (const trait of TRAITS) total += traits[trait] * w;
  return Math.round(total);
}

/** Validate name input — returns an error string or null. */
function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required.';
  if (name.trim() === '') return 'Name must not be empty.';
  if (name.length > NAME_MAX_LENGTH) return `Name must be at most ${NAME_MAX_LENGTH} characters.`;
  return null;
}

/* ─── DOM refs ───────────────────────────────────────────────────────────── */
const inputName     = document.getElementById('input-name');
const inputSeed     = document.getElementById('input-seed');
const nameError     = document.getElementById('name-error');
const toggleSliders = document.getElementById('toggle-sliders');
const slidersPanel  = document.getElementById('sliders-panel');
const sliderList    = document.getElementById('slider-list');
const btnGenerate   = document.getElementById('btn-generate');
const btnReset      = document.getElementById('btn-reset');
const resultsCard   = document.getElementById('results');
const resultName    = document.getElementById('result-name');
const resultDom     = document.getElementById('result-dominance');
const traitBars     = document.getElementById('trait-bars');
const btnCopyJson   = document.getElementById('btn-copy-json');
const btnShare      = document.getElementById('btn-share');
const btnAnalyse    = document.getElementById('btn-analyse');
const analyseSection = document.getElementById('analyse-section');
const copyFeedback  = document.getElementById('copy-feedback');

/* ─── Build trait sliders ────────────────────────────────────────────────── */
const sliderInputs = {};
for (const trait of TRAITS) {
  const row = document.createElement('div');
  row.className = 'slider-row';

  const label = document.createElement('span');
  label.className = 'trait-label';
  label.textContent = trait;

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = TRAIT_MIN;
  slider.max = TRAIT_MAX;
  slider.value = 50;
  slider.id = `slider-${trait}`;

  const valDisplay = document.createElement('span');
  valDisplay.className = 'slider-val';
  valDisplay.textContent = '50';

  slider.addEventListener('input', () => { valDisplay.textContent = slider.value; });

  row.appendChild(label);
  row.appendChild(slider);
  row.appendChild(valDisplay);
  sliderList.appendChild(row);
  sliderInputs[trait] = slider;
}

/* ─── Toggle sliders panel ───────────────────────────────────────────────── */
toggleSliders.addEventListener('change', () => {
  slidersPanel.classList.toggle('open', toggleSliders.checked);
});

/* ─── State ──────────────────────────────────────────────────────────────── */
let lastResult = null;

/* ─── Generate ───────────────────────────────────────────────────────────── */
function generate() {
  const nameRaw = inputName.value.trim();
  const err = validateName(nameRaw);
  nameError.textContent = err || '';
  if (err) return;

  let traits;
  let usedSeed;

  if (toggleSliders.checked) {
    // Manual mode — read slider values
    traits = {};
    for (const trait of TRAITS) {
      traits[trait] = clampTrait(Number(sliderInputs[trait].value));
    }
    usedSeed = null;
  } else {
    // Random / seeded mode
    const seedRaw = inputSeed.value.trim();
    if (seedRaw !== '') {
      const parsed = parseInt(seedRaw, 10);
      usedSeed = isNaN(parsed) ? undefined : Math.abs(parsed);
    }
    traits = generateTraits(usedSeed);

    // If no seed was provided, store the timestamp-based seed so sharing works.
    // We derive it by re-generating: since we already have the traits, record the
    // actual numeric seed used. When seed is undefined we used Date.now() inside
    // generateTraits — for sharing we'll just embed the trait values directly.
    if (usedSeed === undefined) usedSeed = null;
  }

  lastResult = { name: nameRaw, traits, seed: usedSeed };
  renderResult(lastResult);
}

function renderResult({ name, traits }) {
  resultName.textContent = name;
  resultDom.textContent = `Dominance: ${dominanceScore(traits)}`;

  traitBars.innerHTML = '';
  for (const trait of TRAITS) {
    const value = traits[trait];
    const row = document.createElement('div');
    row.className = 'trait-bar-row';
    row.innerHTML = `
      <div class="trait-bar-header">
        <span class="trait-name">${trait}</span>
        <span class="trait-score">${value}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${trait}" style="width:0%"></div>
      </div>`;
    traitBars.appendChild(row);
  }

  resultsCard.style.display = 'block';

  // Trigger animation after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      traitBars.querySelectorAll('.bar-fill').forEach((fill, i) => {
        fill.style.width = traits[TRAITS[i]] + '%';
      });
    });
  });
}

/* ─── AI Analysis ────────────────────────────────────────────────────────── */
async function analyseWithAi() {
  if (!lastResult) return;

  analyseSection.innerHTML = '<p class="analyse-loading">Analysing…</p>';
  btnAnalyse.disabled = true;

  try {
    const res = await fetch(ANALYSE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: lastResult.name, traits: lastResult.traits }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Server error');
    analyseSection.innerHTML = `<pre class="analyse-report">${escapeHtml(data.report)}</pre>`;
  } catch (err) {
    analyseSection.innerHTML = `<p class="analyse-error">Error: ${escapeHtml(err.message)}</p>`;
  } finally {
    btnAnalyse.disabled = false;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ─── Reset ──────────────────────────────────────────────────────────────── */
function resetAll() {
  inputName.value = '';
  inputSeed.value = '';
  nameError.textContent = '';
  toggleSliders.checked = false;
  slidersPanel.classList.remove('open');
  for (const trait of TRAITS) {
    sliderInputs[trait].value = 50;
    sliderInputs[trait].nextElementSibling.textContent = '50';
  }
  resultsCard.style.display = 'none';
  analyseSection.innerHTML = '';
  lastResult = null;
  history.replaceState(null, '', location.pathname);
}

/* ─── Copy JSON ──────────────────────────────────────────────────────────── */
function copyJson() {
  if (!lastResult) return;
  const payload = JSON.stringify({ name: lastResult.name, traits: lastResult.traits }, null, 2);
  navigator.clipboard.writeText(payload).then(() => showFeedback('Copied!'));
}

/* ─── Share link ─────────────────────────────────────────────────────────── */
function shareLink() {
  if (!lastResult) return;
  const params = new URLSearchParams();
  params.set('name', lastResult.name);
  if (lastResult.seed !== null) {
    params.set('seed', lastResult.seed);
  } else {
    // Manual or unseeded — embed trait values so the link is reproducible
    for (const trait of TRAITS) {
      params.set(trait, lastResult.traits[trait]);
    }
  }
  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(url).then(() => {
    history.replaceState(null, '', `?${params.toString()}`);
    showFeedback('Link copied!');
  });
}

function showFeedback(msg) {
  copyFeedback.textContent = msg;
  copyFeedback.classList.add('show');
  setTimeout(() => copyFeedback.classList.remove('show'), 2000);
}

/* ─── Event listeners ────────────────────────────────────────────────────── */
btnGenerate.addEventListener('click', generate);
btnReset.addEventListener('click', resetAll);
btnCopyJson.addEventListener('click', copyJson);
btnShare.addEventListener('click', shareLink);
btnAnalyse.addEventListener('click', analyseWithAi);

inputName.addEventListener('keydown', (e) => { if (e.key === 'Enter') generate(); });

/* ─── Auto-load from URL params ──────────────────────────────────────────── */
(function loadFromUrl() {
  const params = new URLSearchParams(location.search);
  const name = params.get('name');
  if (!name) return;

  inputName.value = name;

  const seed = params.get('seed');
  if (seed !== null) {
    inputSeed.value = seed;
    const parsedSeed = parseInt(seed, 10);
    const numericSeed = isNaN(parsedSeed) ? undefined : Math.abs(parsedSeed);
    lastResult = { name: name.trim(), traits: generateTraits(numericSeed), seed: numericSeed !== undefined ? numericSeed : null };
    renderResult(lastResult);
    return;
  }

  // Check for embedded trait values
  const hasTraits = TRAITS.every(t => params.has(t));
  if (hasTraits) {
    const traits = {};
    for (const trait of TRAITS) {
      traits[trait] = clampTrait(Number(params.get(trait)));
    }
    toggleSliders.checked = true;
    slidersPanel.classList.add('open');
    for (const trait of TRAITS) {
      sliderInputs[trait].value = traits[trait];
      sliderInputs[trait].nextElementSibling.textContent = traits[trait];
    }
    lastResult = { name: name.trim(), traits, seed: null };
    renderResult(lastResult);
  }
})();
