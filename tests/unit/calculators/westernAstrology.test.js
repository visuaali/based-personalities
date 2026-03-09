'use strict';

const { getSunSign, getWesternProfile, SUN_SIGNS } = require('../../../src/calculators/westernAstrology');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_ELEMENTS = new Set(['Fire', 'Earth', 'Air', 'Water']);
const VALID_MODALITIES = new Set(['Cardinal', 'Fixed', 'Mutable']);

// ---------------------------------------------------------------------------
// SUN_SIGNS data table
// ---------------------------------------------------------------------------

describe('SUN_SIGNS', () => {
  test('contains exactly 12 entries', () => {
    expect(SUN_SIGNS).toHaveLength(12);
  });

  test('every entry has required keys', () => {
    const requiredKeys = ['name', 'symbol', 'element', 'modality', 'start', 'end', 'compatibleSigns', 'description'];
    for (const sign of SUN_SIGNS) {
      for (const key of requiredKeys) {
        expect(sign).toHaveProperty(key);
      }
    }
  });

  test('every element is one of the four valid elements', () => {
    for (const sign of SUN_SIGNS) {
      expect(VALID_ELEMENTS).toContain(sign.element);
    }
  });

  test('every modality is one of the three valid modalities', () => {
    for (const sign of SUN_SIGNS) {
      expect(VALID_MODALITIES).toContain(sign.modality);
    }
  });

  test('every compatibleSigns is an array of strings', () => {
    for (const sign of SUN_SIGNS) {
      expect(Array.isArray(sign.compatibleSigns)).toBe(true);
      for (const s of sign.compatibleSigns) {
        expect(typeof s).toBe('string');
      }
    }
  });

  test('all 12 sign names are unique', () => {
    const names = SUN_SIGNS.map(s => s.name);
    expect(new Set(names).size).toBe(12);
  });
});

// ---------------------------------------------------------------------------
// getSunSign — correct sign for first day of each sign
// ---------------------------------------------------------------------------

describe('getSunSign — first day of each sign', () => {
  const cases = [
    [1, 20, 'Aquarius'],
    [2, 19, 'Pisces'],
    [3, 21, 'Aries'],
    [4, 20, 'Taurus'],
    [5, 21, 'Gemini'],
    [6, 21, 'Cancer'],
    [7, 23, 'Leo'],
    [8, 23, 'Virgo'],
    [9, 23, 'Libra'],
    [10, 23, 'Scorpio'],
    [11, 22, 'Sagittarius'],
    [12, 22, 'Capricorn'],
  ];

  test.each(cases)('month %i day %i → %s', (month, day, expected) => {
    expect(getSunSign(month, day).name).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// getSunSign — correct sign for last day of each sign
// ---------------------------------------------------------------------------

describe('getSunSign — last day of each sign', () => {
  const cases = [
    [1, 19, 'Capricorn'],
    [2, 18, 'Aquarius'],
    [3, 20, 'Pisces'],
    [4, 19, 'Aries'],
    [5, 20, 'Taurus'],
    [6, 20, 'Gemini'],
    [7, 22, 'Cancer'],
    [8, 22, 'Leo'],
    [9, 22, 'Virgo'],
    [10, 22, 'Libra'],
    [11, 21, 'Scorpio'],
    [12, 21, 'Sagittarius'],
  ];

  test.each(cases)('month %i day %i → %s', (month, day, expected) => {
    expect(getSunSign(month, day).name).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// getSunSign — Capricorn year-boundary edge cases
// ---------------------------------------------------------------------------

describe('getSunSign — Capricorn year-boundary', () => {
  test('Dec 22 → Capricorn', () => {
    expect(getSunSign(12, 22).name).toBe('Capricorn');
  });

  test('Jan 19 → Capricorn', () => {
    expect(getSunSign(1, 19).name).toBe('Capricorn');
  });

  test('Dec 21 → Sagittarius (day before Capricorn starts)', () => {
    expect(getSunSign(12, 21).name).toBe('Sagittarius');
  });

  test('Jan 20 → Aquarius (day after Capricorn ends)', () => {
    expect(getSunSign(1, 20).name).toBe('Aquarius');
  });
});

// ---------------------------------------------------------------------------
// getSunSign — mid-sign spot checks
// ---------------------------------------------------------------------------

describe('getSunSign — mid-sign dates', () => {
  test('Jun 15 → Gemini', () => {
    expect(getSunSign(6, 15).name).toBe('Gemini');
  });

  test('Dec 25 → Capricorn', () => {
    expect(getSunSign(12, 25).name).toBe('Capricorn');
  });

  test('Jan 1 → Capricorn', () => {
    expect(getSunSign(1, 1).name).toBe('Capricorn');
  });
});

// ---------------------------------------------------------------------------
// getSunSign — invalid inputs (must throw)
// ---------------------------------------------------------------------------

describe('getSunSign — invalid inputs', () => {
  test('month = 0 throws', () => {
    expect(() => getSunSign(0, 15)).toThrow();
  });

  test('month = 13 throws', () => {
    expect(() => getSunSign(13, 15)).toThrow();
  });

  test('day = 0 throws', () => {
    expect(() => getSunSign(6, 0)).toThrow();
  });

  test('day = 32 throws', () => {
    expect(() => getSunSign(6, 32)).toThrow();
  });

  test('non-number month throws', () => {
    expect(() => getSunSign('March', 15)).toThrow();
  });

  test('null day throws', () => {
    expect(() => getSunSign(6, null)).toThrow();
  });

  test('NaN month throws', () => {
    expect(() => getSunSign(NaN, 15)).toThrow();
  });

  test('Infinity day throws', () => {
    expect(() => getSunSign(6, Infinity)).toThrow();
  });

  test('float month throws', () => {
    expect(() => getSunSign(3.5, 21)).toThrow();
  });

  test('float day throws', () => {
    expect(() => getSunSign(3, 21.5)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// getWesternProfile — output shape
// ---------------------------------------------------------------------------

describe('getWesternProfile', () => {
  const REQUIRED_KEYS = ['sign', 'symbol', 'element', 'modality', 'compatibleSigns', 'description', 'dateRange'];

  test('returns an object with all required keys', () => {
    const profile = getWesternProfile(3, 21);
    for (const key of REQUIRED_KEYS) {
      expect(profile).toHaveProperty(key);
    }
  });

  test('sign is a non-empty string', () => {
    const { sign } = getWesternProfile(7, 4);
    expect(typeof sign).toBe('string');
    expect(sign.length).toBeGreaterThan(0);
  });

  test('element is one of the four valid elements', () => {
    const { element } = getWesternProfile(5, 1);
    expect(VALID_ELEMENTS).toContain(element);
  });

  test('modality is one of the three valid modalities', () => {
    const { modality } = getWesternProfile(10, 10);
    expect(VALID_MODALITIES).toContain(modality);
  });

  test('compatibleSigns is an array of strings', () => {
    const { compatibleSigns } = getWesternProfile(1, 25);
    expect(Array.isArray(compatibleSigns)).toBe(true);
    for (const s of compatibleSigns) {
      expect(typeof s).toBe('string');
    }
  });

  test('dateRange is a non-empty string containing –', () => {
    const { dateRange } = getWesternProfile(3, 21);
    expect(typeof dateRange).toBe('string');
    expect(dateRange.length).toBeGreaterThan(0);
    expect(dateRange).toContain('–');
  });

  test('Aries profile has correct values', () => {
    const profile = getWesternProfile(3, 21);
    expect(profile.sign).toBe('Aries');
    expect(profile.symbol).toBe('♈');
    expect(profile.element).toBe('Fire');
    expect(profile.modality).toBe('Cardinal');
  });

  test('Capricorn profile correct for Dec 25', () => {
    const profile = getWesternProfile(12, 25);
    expect(profile.sign).toBe('Capricorn');
    expect(profile.element).toBe('Earth');
  });

  test('mutating returned compatibleSigns does not affect SUN_SIGNS data', () => {
    const profile = getWesternProfile(3, 21);
    const originalLength = profile.compatibleSigns.length;
    profile.compatibleSigns.push('Capricorn');
    // Fetch again — should not have been mutated
    const fresh = getWesternProfile(3, 21);
    expect(fresh.compatibleSigns).toHaveLength(originalLength);
  });

  test('throws for invalid input (delegates to getSunSign)', () => {
    expect(() => getWesternProfile(0, 1)).toThrow();
    expect(() => getWesternProfile(1, 32)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// getSunSign — data-driven: all 12 signs reachable from their own start date
// ---------------------------------------------------------------------------

describe('getSunSign — data-driven: all 12 signs reachable from their start date', () => {
  test.each(SUN_SIGNS.map(s => [s.name, s.start.month, s.start.day]))(
    '%s is returned when querying its own start date (%i/%i)',
    (name, month, day) => {
      expect(getSunSign(month, day).name).toBe(name);
    }
  );
});
