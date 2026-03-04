/**
 * Personality model
 *
 * A Personality is defined by five traits, each scored on a scale of 0–100.
 * These map loosely to the Big Five (OCEAN) personality dimensions.
 */

const TRAITS = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
const TRAIT_MIN = 0;
const TRAIT_MAX = 100;

/**
 * Clamp a numeric value to [TRAIT_MIN, TRAIT_MAX].
 * @param {number} value
 * @returns {number}
 */
function clampTrait(value) {
  return Math.min(TRAIT_MAX, Math.max(TRAIT_MIN, value));
}

class Personality {
  /**
   * @param {string} name - Display name for the personality
   * @param {Object} traits - Trait scores (each 0–100)
   */
  constructor(name, traits = {}) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('Personality name must be a non-empty string');
    }

    this.name = name.trim();
    this.traits = {};

    for (const trait of TRAITS) {
      const raw = traits[trait];
      if (raw === undefined || raw === null) {
        this.traits[trait] = 50; // default: neutral
      } else if (typeof raw !== 'number' || Number.isNaN(raw)) {
        throw new Error(`Trait "${trait}" must be a number, got ${typeof raw}`);
      } else {
        this.traits[trait] = clampTrait(raw);
      }
    }
  }

  /**
   * Return a plain object representation suitable for JSON serialisation.
   * @returns {Object}
   */
  toJSON() {
    return { name: this.name, traits: { ...this.traits } };
  }

  /**
   * Reconstruct a Personality from a plain object (e.g. parsed JSON).
   * @param {Object} data
   * @returns {Personality}
   */
  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('fromJSON requires a plain object');
    }
    return new Personality(data.name, data.traits || {});
  }

  /**
   * Compute a single dominance score (0–100) based on trait weighting.
   * @param {Object} weights - Optional custom weights per trait (default: equal)
   * @returns {number}
   */
  dominanceScore(weights = {}) {
    const defaultWeight = 1 / TRAITS.length;
    let total = 0;

    for (const trait of TRAITS) {
      const w = typeof weights[trait] === 'number' ? weights[trait] : defaultWeight;
      total += this.traits[trait] * w;
    }

    return Math.round(total);
  }
}

module.exports = { Personality, TRAITS, TRAIT_MIN, TRAIT_MAX };
