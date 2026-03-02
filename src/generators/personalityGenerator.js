/**
 * Personality generator
 *
 * Generates random Personality instances.  A numeric seed can be supplied
 * to produce reproducible results (useful for testing and content seeding).
 */

const { Personality, TRAITS, TRAIT_MIN, TRAIT_MAX } = require('../models/personality');

/**
 * Simple deterministic pseudo-random number generator (mulberry32).
 * @param {number} seed
 * @returns {() => number} function returning a float in [0, 1)
 */
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

/**
 * Generate a random Personality.
 *
 * @param {string} name - Name for the personality
 * @param {Object} [options]
 * @param {number} [options.seed] - Optional seed for reproducibility
 * @returns {Personality}
 */
function generatePersonality(name, { seed } = {}) {
  const rng = createRng(seed !== undefined ? seed : Date.now());
  const traits = {};

  for (const trait of TRAITS) {
    traits[trait] = Math.round(rng() * (TRAIT_MAX - TRAIT_MIN) + TRAIT_MIN);
  }

  return new Personality(name, traits);
}

module.exports = { generatePersonality, createRng };
