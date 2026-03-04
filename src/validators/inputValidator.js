/**
 * Input validator
 *
 * Validates raw user / API input before it is used to construct a Personality.
 * Returns a structured result rather than throwing, so callers can surface
 * user-friendly error messages.
 */

const { TRAITS, TRAIT_MIN, TRAIT_MAX } = require('../models/personality');

const NAME_MAX_LENGTH = 100;

/**
 * Validate a raw personality payload.
 *
 * @param {*} input - Raw input (expected to be a plain object)
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validatePersonalityInput(input) {
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    errors.push('Input must be a plain object');
    return { valid: false, errors };
  }

  // Validate name
  if (!input.name) {
    errors.push('name is required');
  } else if (typeof input.name !== 'string') {
    errors.push('name must be a string');
  } else if (input.name.trim() === '') {
    errors.push('name must not be empty');
  } else if (input.name.length > NAME_MAX_LENGTH) {
    errors.push(`name must be at most ${NAME_MAX_LENGTH} characters`);
  }

  // Validate traits (optional — defaults applied by the model)
  if (input.traits !== undefined) {
    if (typeof input.traits !== 'object' || Array.isArray(input.traits) || input.traits === null) {
      errors.push('traits must be a plain object');
    } else {
      for (const trait of TRAITS) {
        const value = input.traits[trait];
        if (value !== undefined) {
          if (typeof value !== 'number' || Number.isNaN(value)) {
            errors.push(`traits.${trait} must be a number`);
          } else if (!Number.isFinite(value)) {
            errors.push(`traits.${trait} must be a finite number`);
          } else if (value < TRAIT_MIN || value > TRAIT_MAX) {
            errors.push(`traits.${trait} must be between ${TRAIT_MIN} and ${TRAIT_MAX}`);
          }
        }
      }

      // Warn about unknown trait keys
      const unknownKeys = Object.keys(input.traits).filter(k => !TRAITS.includes(k));
      for (const key of unknownKeys) {
        errors.push(`traits.${key} is not a recognised trait`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validatePersonalityInput, NAME_MAX_LENGTH };
