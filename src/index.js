'use strict';

const { Personality, TRAITS, TRAIT_MIN, TRAIT_MAX } = require('./models/personality');
const { generatePersonality, createRng } = require('./generators/personalityGenerator');
const { validatePersonalityInput, NAME_MAX_LENGTH } = require('./validators/inputValidator');

module.exports = {
  Personality,
  TRAITS,
  TRAIT_MIN,
  TRAIT_MAX,
  generatePersonality,
  createRng,
  validatePersonalityInput,
  NAME_MAX_LENGTH,
};
