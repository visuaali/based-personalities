'use strict';

const { Personality, TRAITS, TRAIT_MIN, TRAIT_MAX } = require('./models/personality');
const { generatePersonality, createRng } = require('./generators/personalityGenerator');
const { validatePersonalityInput, NAME_MAX_LENGTH } = require('./validators/inputValidator');
const { analysePersonality } = require('./agent');
const { getSunSign, getWesternProfile, SUN_SIGNS } = require('./calculators/westernAstrology');
const { getChineseSign, getChineseProfile, CHINESE_SIGNS } = require('./calculators/chineseZodiac');

module.exports = {
  Personality,
  TRAITS,
  TRAIT_MIN,
  TRAIT_MAX,
  generatePersonality,
  createRng,
  validatePersonalityInput,
  NAME_MAX_LENGTH,
  analysePersonality,
  getSunSign,
  getWesternProfile,
  SUN_SIGNS,
  getChineseSign,
  getChineseProfile,
  CHINESE_SIGNS,
};
