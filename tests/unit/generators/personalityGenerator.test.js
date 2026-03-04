const { generatePersonality, createRng } = require('../../../src/generators/personalityGenerator');
const { TRAITS, TRAIT_MIN, TRAIT_MAX } = require('../../../src/models/personality');

describe('generatePersonality', () => {
  test('returns a Personality with the given name', () => {
    const p = generatePersonality('Alice', { seed: 1 });
    expect(p.name).toBe('Alice');
  });

  test('all trait values are within [TRAIT_MIN, TRAIT_MAX]', () => {
    const p = generatePersonality('Bob', { seed: 42 });
    for (const trait of TRAITS) {
      expect(p.traits[trait]).toBeGreaterThanOrEqual(TRAIT_MIN);
      expect(p.traits[trait]).toBeLessThanOrEqual(TRAIT_MAX);
    }
  });

  test('same seed produces identical trait values', () => {
    const p1 = generatePersonality('Carol', { seed: 99 });
    const p2 = generatePersonality('Carol', { seed: 99 });
    expect(p1.traits).toEqual(p2.traits);
  });

  test('different seeds produce different trait values (probabilistically)', () => {
    const p1 = generatePersonality('Dave', { seed: 1 });
    const p2 = generatePersonality('Dave', { seed: 2 });
    // It is astronomically unlikely that all five traits are identical across different seeds
    const allSame = TRAITS.every(t => p1.traits[t] === p2.traits[t]);
    expect(allSame).toBe(false);
  });

  test('generates a personality without a seed (non-deterministic)', () => {
    const p = generatePersonality('Eve');
    for (const trait of TRAITS) {
      expect(p.traits[trait]).toBeGreaterThanOrEqual(TRAIT_MIN);
      expect(p.traits[trait]).toBeLessThanOrEqual(TRAIT_MAX);
    }
  });
});

describe('createRng', () => {
  test('returns a function', () => {
    expect(typeof createRng(0)).toBe('function');
  });

  test('output is in [0, 1)', () => {
    const rng = createRng(7);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test('same seed yields same sequence', () => {
    const rng1 = createRng(123);
    const rng2 = createRng(123);
    for (let i = 0; i < 10; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  test('different seeds yield different sequences', () => {
    const rng1 = createRng(1);
    const rng2 = createRng(2);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });
});
