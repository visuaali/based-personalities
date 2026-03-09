'use strict';

/**
 * Chinese Zodiac calculator
 *
 * Calculates the animal sign, element, and polarity for a given Gregorian
 * birth year. Based on the 12-year animal cycle and 10-year heavenly stem
 * (element + yin/yang) cycle.
 *
 * NOTE: The Chinese New Year falls in late January or mid-February. This
 * calculator uses the Gregorian year throughout. People born in January or
 * early February before the Lunar New Year belong to the previous year's
 * animal — this edge case is not handled here.
 *
 * Reference epoch: 1900 = Metal Rat (Yang).
 */

/** @type {Array<Object>} */
const CHINESE_SIGNS = [
  {
    name: 'Rat',
    symbol: '🐭',
    compatibleAnimals: ['Dragon', 'Monkey', 'Ox'],
    description: 'Quick-witted, resourceful, and charming.',
  },
  {
    name: 'Ox',
    symbol: '🐮',
    compatibleAnimals: ['Rat', 'Snake', 'Rooster'],
    description: 'Dependable, strong, and determined.',
  },
  {
    name: 'Tiger',
    symbol: '🐯',
    compatibleAnimals: ['Horse', 'Dog', 'Pig'],
    description: 'Brave, competitive, and unpredictable.',
  },
  {
    name: 'Rabbit',
    symbol: '🐰',
    compatibleAnimals: ['Goat', 'Pig', 'Dog'],
    description: 'Gentle, elegant, and alert.',
  },
  {
    name: 'Dragon',
    symbol: '🐲',
    compatibleAnimals: ['Rat', 'Monkey', 'Rooster'],
    description: 'Confident, intelligent, and enthusiastic.',
  },
  {
    name: 'Snake',
    symbol: '🐍',
    compatibleAnimals: ['Ox', 'Rooster', 'Monkey'],
    description: 'Enigmatic, wise, and intuitive.',
  },
  {
    name: 'Horse',
    symbol: '🐴',
    compatibleAnimals: ['Tiger', 'Goat', 'Dog'],
    description: 'Animated, active, and energetic.',
  },
  {
    name: 'Goat',
    symbol: '🐑',
    compatibleAnimals: ['Rabbit', 'Horse', 'Pig'],
    description: 'Calm, gentle, and sympathetic.',
  },
  {
    name: 'Monkey',
    symbol: '🐵',
    compatibleAnimals: ['Rat', 'Dragon', 'Snake'],
    description: 'Clever, curious, and mischievous.',
  },
  {
    name: 'Rooster',
    symbol: '🐓',
    compatibleAnimals: ['Ox', 'Dragon', 'Snake'],
    description: 'Observant, hardworking, and courageous.',
  },
  {
    name: 'Dog',
    symbol: '🐶',
    compatibleAnimals: ['Tiger', 'Rabbit', 'Horse'],
    description: 'Loyal, honest, and diligent.',
  },
  {
    name: 'Pig',
    symbol: '🐷',
    compatibleAnimals: ['Tiger', 'Rabbit', 'Goat'],
    description: 'Compassionate, generous, and diligent.',
  },
];

// Element lookup by last digit of the year (0–9)
const ELEMENTS = ['Metal', 'Metal', 'Water', 'Water', 'Wood',
  'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];

/**
 * Derive the heavenly-stem element from a year.
 * @param {number} year
 * @returns {string}
 */
function getElement(year) {
  const digit = ((year % 10) + 10) % 10; // handles negative years safely
  return ELEMENTS[digit];
}

/**
 * Derive the yin/yang polarity from a year.
 * Even years are Yang; odd years are Yin.
 * @param {number} year
 * @returns {'Yang' | 'Yin'}
 */
function getPolarity(year) {
  return (((year % 2) + 2) % 2 === 0) ? 'Yang' : 'Yin';
}

/**
 * Look up the Chinese Zodiac animal sign for a given birth year.
 *
 * NOTE: Uses Gregorian year. People born in January or early February before
 * the Lunar New Year may belong to the previous year's animal.
 *
 * @param {number} year - Full Gregorian birth year (e.g. 1990)
 * @returns {Object} entry from CHINESE_SIGNS
 * @throws {Error} if year is not a finite integer
 */
function getChineseSign(year) {
  if (typeof year !== 'number' || !Number.isFinite(year) || !Number.isInteger(year)) {
    throw new Error(`year must be a finite integer, got ${year}`);
  }

  const index = (((year - 1900) % 12) + 12) % 12;
  return CHINESE_SIGNS[index];
}

/**
 * Return a full Chinese Zodiac profile for a given birth year.
 *
 * @param {number} year - Full Gregorian birth year (e.g. 1990)
 * @returns {{
 *   animal: string,
 *   symbol: string,
 *   element: string,
 *   polarity: 'Yin' | 'Yang',
 *   compatibleAnimals: string[],
 *   description: string
 * }}
 * @throws {Error} if year is not a finite integer
 */
function getChineseProfile(year) {
  const sign = getChineseSign(year);
  return {
    animal: sign.name,
    symbol: sign.symbol,
    element: getElement(year),
    polarity: getPolarity(year),
    compatibleAnimals: sign.compatibleAnimals.slice(),
    description: sign.description,
  };
}

module.exports = { getChineseSign, getChineseProfile, CHINESE_SIGNS };
