'use strict';

/**
 * Western Astrology calculator
 *
 * Calculates the Sun sign and full profile for a given birth month and day.
 * Based on the tropical zodiac. No external dependencies — pure date arithmetic.
 */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** @type {Array<Object>} */
const SUN_SIGNS = [
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    start: { month: 12, day: 22 },
    end: { month: 1, day: 19 },
    compatibleSigns: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    description: 'Disciplined, ambitious, and deeply committed to long-term goals.',
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    start: { month: 1, day: 20 },
    end: { month: 2, day: 18 },
    compatibleSigns: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
    description: 'Innovative, humanitarian, and fiercely independent.',
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    start: { month: 2, day: 19 },
    end: { month: 3, day: 20 },
    compatibleSigns: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
    description: 'Empathetic, imaginative, and deeply in tune with emotions.',
  },
  {
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    start: { month: 3, day: 21 },
    end: { month: 4, day: 19 },
    compatibleSigns: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    description: 'Bold, ambitious, and full of pioneering energy.',
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    start: { month: 4, day: 20 },
    end: { month: 5, day: 20 },
    compatibleSigns: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    description: 'Reliable, patient, and devoted to comfort and beauty.',
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    start: { month: 5, day: 21 },
    end: { month: 6, day: 20 },
    compatibleSigns: ['Libra', 'Aquarius', 'Aries', 'Leo'],
    description: 'Curious, versatile, and endlessly communicative.',
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    start: { month: 6, day: 21 },
    end: { month: 7, day: 22 },
    compatibleSigns: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
    description: 'Nurturing, intuitive, and fiercely protective of loved ones.',
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    start: { month: 7, day: 23 },
    end: { month: 8, day: 22 },
    compatibleSigns: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    description: 'Charismatic, confident, and natural born leader.',
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    start: { month: 8, day: 23 },
    end: { month: 9, day: 22 },
    compatibleSigns: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    description: 'Analytical, practical, and devoted to service and detail.',
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    start: { month: 9, day: 23 },
    end: { month: 10, day: 22 },
    compatibleSigns: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    description: 'Diplomatic, fair-minded, and drawn to harmony and beauty.',
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    start: { month: 10, day: 23 },
    end: { month: 11, day: 21 },
    compatibleSigns: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    description: 'Intense, perceptive, and driven by deep transformation.',
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    start: { month: 11, day: 22 },
    end: { month: 12, day: 21 },
    compatibleSigns: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    description: 'Adventurous, optimistic, and in pursuit of truth and freedom.',
  },
];

/**
 * Validate that month and day are integers within accepted ranges.
 * @param {*} month
 * @param {*} day
 */
function validateInput(month, day) {
  if (typeof month !== 'number' || !Number.isFinite(month) || !Number.isInteger(month)) {
    throw new Error(`month must be an integer, got ${month}`);
  }
  if (typeof day !== 'number' || !Number.isFinite(day) || !Number.isInteger(day)) {
    throw new Error(`day must be an integer, got ${day}`);
  }
  if (month < 1 || month > 12) {
    throw new Error(`month must be between 1 and 12, got ${month}`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`day must be between 1 and 31, got ${day}`);
  }
}

/**
 * Look up the Western astrology Sun sign for a given birth date.
 *
 * @param {number} month - 1–12
 * @param {number} day   - 1–31
 * @returns {Object} sign object from SUN_SIGNS
 * @throws {Error} if month or day are out of valid range or not integers
 */
function getSunSign(month, day) {
  validateInput(month, day);

  // Encode the date as a comparable integer (MMDD) for non-boundary signs
  const mmdd = month * 100 + day;

  for (const sign of SUN_SIGNS) {
    const { start, end } = sign;

    if (start.month > end.month) {
      // Year-boundary sign (Capricorn: Dec 22 – Jan 19)
      const startMmdd = start.month * 100 + start.day;
      const endMmdd = end.month * 100 + end.day;
      if (mmdd >= startMmdd || mmdd <= endMmdd) {
        return sign;
      }
    } else {
      const startMmdd = start.month * 100 + start.day;
      const endMmdd = end.month * 100 + end.day;
      if (mmdd >= startMmdd && mmdd <= endMmdd) {
        return sign;
      }
    }
  }

  // Should never reach here with valid month/day inputs
  throw new Error(`Could not determine Sun sign for month=${month} day=${day}`);
}

/**
 * Format a {month, day} object as a short string, e.g. "Mar 21".
 * @param {{ month: number, day: number }} date
 * @returns {string}
 */
function formatDate(date) {
  return `${MONTH_NAMES[date.month - 1]} ${date.day}`;
}

/**
 * Return a full Western astrology profile for a given birth date.
 *
 * @param {number} month - 1–12
 * @param {number} day   - 1–31
 * @returns {{ sign: string, symbol: string, element: string, modality: string,
 *             compatibleSigns: string[], description: string, dateRange: string }}
 */
function getWesternProfile(month, day) {
  const sign = getSunSign(month, day);
  return {
    sign: sign.name,
    symbol: sign.symbol,
    element: sign.element,
    modality: sign.modality,
    compatibleSigns: sign.compatibleSigns.slice(),
    description: sign.description,
    dateRange: `${formatDate(sign.start)} – ${formatDate(sign.end)}`,
  };
}

module.exports = { getSunSign, getWesternProfile, SUN_SIGNS };
