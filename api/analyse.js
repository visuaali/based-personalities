'use strict';

const { Personality, validatePersonalityInput, analysePersonality } = require('../src/index');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, traits } = req.body || {};

  const { valid, errors } = validatePersonalityInput({ name, traits });
  if (!valid) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  try {
    const personality = new Personality(name, traits);
    const report = await analysePersonality(personality);
    res.status(200).json({ report });
  } catch (err) {
    console.error('analysePersonality error:', err);
    res.status(500).json({ error: 'Analysis failed.' });
  }
};
