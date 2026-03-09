'use strict';

const { getChineseSign, getChineseProfile, CHINESE_SIGNS } = require('../../../src/calculators/chineseZodiac');

const VALID_ELEMENTS = new Set(['Metal', 'Water', 'Wood', 'Fire', 'Earth']);
const VALID_POLARITIES = new Set(['Yang', 'Yin']);

// ---------------------------------------------------------------------------
// CHINESE_SIGNS data table
// ---------------------------------------------------------------------------

describe('CHINESE_SIGNS', () => {
  test('contains exactly 12 entries', () => {
    expect(CHINESE_SIGNS).toHaveLength(12);
  });

  test('every entry has required keys', () => {
    const requiredKeys = ['name', 'symbol', 'compatibleAnimals', 'description'];
    for (const sign of CHINESE_SIGNS) {
      for (const key of requiredKeys) {
        expect(sign).toHaveProperty(key);
      }
    }
  });

  test('all 12 animal names are unique', () => {
    const names = CHINESE_SIGNS.map(s => s.name);
    expect(new Set(names).size).toBe(12);
  });

  test('every compatibleAnimals is a non-empty array of strings', () => {
    for (const sign of CHINESE_SIGNS) {
      expect(Array.isArray(sign.compatibleAnimals)).toBe(true);
      expect(sign.compatibleAnimals.length).toBeGreaterThan(0);
      for (const a of sign.compatibleAnimals) {
        expect(typeof a).toBe('string');
      }
    }
  });

  test('first entry is Rat (index 0, reference year 1900)', () => {
    expect(CHINESE_SIGNS[0].name).toBe('Rat');
  });
});

// ---------------------------------------------------------------------------
// getChineseSign — 12 reference years 1900–1911 (one per animal)
// ---------------------------------------------------------------------------

describe('getChineseSign — reference years 1900–1911', () => {
  const cases = [
    [1900, 'Rat'],
    [1901, 'Ox'],
    [1902, 'Tiger'],
    [1903, 'Rabbit'],
    [1904, 'Dragon'],
    [1905, 'Snake'],
    [1906, 'Horse'],
    [1907, 'Goat'],
    [1908, 'Monkey'],
    [1909, 'Rooster'],
    [1910, 'Dog'],
    [1911, 'Pig'],
  ];

  test.each(cases)('%i → %s', (year, expected) => {
    expect(getChineseSign(year).name).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// getChineseSign — modern reference years
// ---------------------------------------------------------------------------

describe('getChineseSign — modern reference years', () => {
  test('1984 → Rat', () => {
    expect(getChineseSign(1984).name).toBe('Rat');
  });

  test('1990 → Horse', () => {
    expect(getChineseSign(1990).name).toBe('Horse');
  });

  test('2000 → Dragon', () => {
    expect(getChineseSign(2000).name).toBe('Dragon');
  });

  test('2024 → Dragon', () => {
    expect(getChineseSign(2024).name).toBe('Dragon');
  });
});

// ---------------------------------------------------------------------------
// getChineseSign — 12-year cycle repeats
// ---------------------------------------------------------------------------

describe('getChineseSign — 12-year cycle', () => {
  test('1900 and 1912 are both Rat', () => {
    expect(getChineseSign(1900).name).toBe(getChineseSign(1912).name);
  });

  test('1990 and 2002 are both Horse', () => {
    expect(getChineseSign(1990).name).toBe(getChineseSign(2002).name);
  });

  test('any year and year+12 return the same animal', () => {
    const years = [1950, 1976, 2010, 2023];
    for (const y of years) {
      expect(getChineseSign(y).name).toBe(getChineseSign(y + 12).name);
    }
  });
});

// ---------------------------------------------------------------------------
// getChineseSign — years before 1900 (negative modulo handling)
// ---------------------------------------------------------------------------

describe('getChineseSign — years before 1900', () => {
  test('1888 → Rat  (1900 − 12, same cycle position)', () => {
    expect(getChineseSign(1888).name).toBe('Rat');
  });

  test('1800 → Monkey  (index 8 via modulo)', () => {
    // (1800 - 1900) = -100; ((-100 % 12) + 12) % 12 = ((-4) + 12) % 12 = 8
    expect(getChineseSign(1800).name).toBe('Monkey');
  });

  test('1899 → Pig  (one year before 1900 Rat → last animal in cycle)', () => {
    // (1899 - 1900) = -1; ((-1 % 12) + 12) % 12 = 11 → Pig
    expect(getChineseSign(1899).name).toBe('Pig');
  });
});

// ---------------------------------------------------------------------------
// getChineseSign — invalid inputs (must throw)
// ---------------------------------------------------------------------------

describe('getChineseSign — invalid inputs', () => {
  test('string throws', () => {
    expect(() => getChineseSign('1990')).toThrow();
  });

  test('null throws', () => {
    expect(() => getChineseSign(null)).toThrow();
  });

  test('undefined throws', () => {
    expect(() => getChineseSign(undefined)).toThrow();
  });

  test('NaN throws', () => {
    expect(() => getChineseSign(NaN)).toThrow();
  });

  test('Infinity throws', () => {
    expect(() => getChineseSign(Infinity)).toThrow();
  });

  test('-Infinity throws', () => {
    expect(() => getChineseSign(-Infinity)).toThrow();
  });

  test('float throws', () => {
    expect(() => getChineseSign(1990.5)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// getChineseProfile — element calculation
// ---------------------------------------------------------------------------

describe('getChineseProfile — element', () => {
  const cases = [
    [1900, 'Metal'],  // last digit 0
    [1901, 'Metal'],  // last digit 1
    [1902, 'Water'],  // last digit 2
    [1903, 'Water'],  // last digit 3
    [1904, 'Wood'],   // last digit 4
    [1905, 'Wood'],   // last digit 5
    [1906, 'Fire'],   // last digit 6
    [1907, 'Fire'],   // last digit 7
    [1908, 'Earth'],  // last digit 8
    [1909, 'Earth'],  // last digit 9
  ];

  test.each(cases)('%i → %s', (year, expected) => {
    expect(getChineseProfile(year).element).toBe(expected);
  });

  test('1990 → Metal (last digit 0)', () => {
    expect(getChineseProfile(1990).element).toBe('Metal');
  });

  test('2000 → Metal (last digit 0)', () => {
    expect(getChineseProfile(2000).element).toBe('Metal');
  });

  test('element is always one of the five valid elements', () => {
    for (let y = 1900; y < 1910; y++) {
      expect(VALID_ELEMENTS).toContain(getChineseProfile(y).element);
    }
  });
});

// ---------------------------------------------------------------------------
// getChineseProfile — polarity
// ---------------------------------------------------------------------------

describe('getChineseProfile — polarity', () => {
  test('1900 (even) → Yang', () => {
    expect(getChineseProfile(1900).polarity).toBe('Yang');
  });

  test('1901 (odd) → Yin', () => {
    expect(getChineseProfile(1901).polarity).toBe('Yin');
  });

  test('1990 (even) → Yang', () => {
    expect(getChineseProfile(1990).polarity).toBe('Yang');
  });

  test('1991 (odd) → Yin', () => {
    expect(getChineseProfile(1991).polarity).toBe('Yin');
  });

  test('polarity is always Yang or Yin', () => {
    for (let y = 1900; y < 1912; y++) {
      expect(VALID_POLARITIES).toContain(getChineseProfile(y).polarity);
    }
  });
});

// ---------------------------------------------------------------------------
// getChineseProfile — output shape
// ---------------------------------------------------------------------------

describe('getChineseProfile — output shape', () => {
  const REQUIRED_KEYS = ['animal', 'symbol', 'element', 'polarity', 'compatibleAnimals', 'description'];

  test('returns an object with all required keys', () => {
    const profile = getChineseProfile(1990);
    for (const key of REQUIRED_KEYS) {
      expect(profile).toHaveProperty(key);
    }
  });

  test('animal is a non-empty string', () => {
    expect(typeof getChineseProfile(2000).animal).toBe('string');
    expect(getChineseProfile(2000).animal.length).toBeGreaterThan(0);
  });

  test('compatibleAnimals is a fresh array (mutation does not affect source)', () => {
    const profile = getChineseProfile(1990);
    const originalLength = profile.compatibleAnimals.length;
    profile.compatibleAnimals.push('Fake');
    const fresh = getChineseProfile(1990);
    expect(fresh.compatibleAnimals).toHaveLength(originalLength);
  });

  test('throws for invalid input (delegates to getChineseSign)', () => {
    expect(() => getChineseProfile('1990')).toThrow();
    expect(() => getChineseProfile(1990.5)).toThrow();
  });

  test('1990 profile has correct animal and element', () => {
    const profile = getChineseProfile(1990);
    expect(profile.animal).toBe('Horse');
    expect(profile.element).toBe('Metal');
    expect(profile.polarity).toBe('Yang');
  });
});

// ---------------------------------------------------------------------------
// getChineseSign — data-driven: all 12 signs reachable via 1900+index
// ---------------------------------------------------------------------------

describe('getChineseSign — data-driven: all 12 signs reachable', () => {
  test.each(CHINESE_SIGNS.map((s, i) => [s.name, 1900 + i]))(
    '%s is returned for year %i',
    (name, year) => {
      expect(getChineseSign(year).name).toBe(name);
    }
  );
});
