'use strict';

const express = require('express');
const { Personality, validatePersonalityInput, analysePersonality } = require('./src/index');

const app = express();
app.use(express.json());

// Allow the docs/ web app (opened as a local file or any origin) to reach this server
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('/analyse', (_req, res) => res.sendStatus(204));

app.post('/analyse', async (req, res) => {
  const { name, traits } = req.body || {};

  const { valid, errors } = validatePersonalityInput({ name, traits });
  if (!valid) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  try {
    const personality = new Personality(name, traits);
    const report = await analysePersonality(personality);
    res.json({ report });
  } catch (err) {
    console.error('analysePersonality error:', err);
    res.status(500).json({ error: 'Analysis failed.' });
  }
});

module.exports = { app };

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
