const { Personality, TRAITS, TRAIT_MIN, TRAIT_MAX } = require('../../../src/models/personality');

describe('Personality — construction', () => {
  test('creates a personality with a valid name and default trait values', () => {
    const p = new Personality('Alice');
    expect(p.name).toBe('Alice');
    for (const trait of TRAITS) {
      expect(p.traits[trait]).toBe(50);
    }
  });

  test('trims whitespace from the name', () => {
    const p = new Personality('  Bob  ');
    expect(p.name).toBe('Bob');
  });

  test('accepts explicit trait values', () => {
    const p = new Personality('Carol', { openness: 80, conscientiousness: 30 });
    expect(p.traits.openness).toBe(80);
    expect(p.traits.conscientiousness).toBe(30);
    expect(p.traits.extraversion).toBe(50); // default
  });

  test('throws when name is empty', () => {
    expect(() => new Personality('')).toThrow('non-empty string');
  });

  test('throws when name is whitespace-only', () => {
    expect(() => new Personality('   ')).toThrow('non-empty string');
  });

  test('throws when name is not a string', () => {
    expect(() => new Personality(42)).toThrow('non-empty string');
  });

  test('throws when a trait value is not a number', () => {
    expect(() => new Personality('Dave', { openness: 'high' })).toThrow('"openness"');
  });

  test('throws when a trait value is NaN', () => {
    expect(() => new Personality('Eve', { openness: NaN })).toThrow('"openness"');
  });
});

describe('Personality — trait clamping', () => {
  test('clamps trait values above TRAIT_MAX to TRAIT_MAX', () => {
    const p = new Personality('Frank', { openness: TRAIT_MAX + 50 });
    expect(p.traits.openness).toBe(TRAIT_MAX);
  });

  test('clamps trait values below TRAIT_MIN to TRAIT_MIN', () => {
    const p = new Personality('Grace', { openness: TRAIT_MIN - 10 });
    expect(p.traits.openness).toBe(TRAIT_MIN);
  });

  test('preserves trait values exactly at TRAIT_MIN', () => {
    const p = new Personality('Hank', { openness: TRAIT_MIN });
    expect(p.traits.openness).toBe(TRAIT_MIN);
  });

  test('preserves trait values exactly at TRAIT_MAX', () => {
    const p = new Personality('Iris', { openness: TRAIT_MAX });
    expect(p.traits.openness).toBe(TRAIT_MAX);
  });
});

describe('Personality — serialisation', () => {
  test('toJSON returns a plain object with name and traits', () => {
    const p = new Personality('Jack', { openness: 70 });
    const json = p.toJSON();
    expect(json).toEqual({ name: 'Jack', traits: expect.objectContaining({ openness: 70 }) });
  });

  test('toJSON result does not share reference with internal traits', () => {
    const p = new Personality('Kate');
    const json = p.toJSON();
    json.traits.openness = 99;
    expect(p.traits.openness).toBe(50);
  });

  test('fromJSON reconstructs an equivalent personality', () => {
    const original = new Personality('Leo', { openness: 60, neuroticism: 20 });
    const roundTripped = Personality.fromJSON(original.toJSON());
    expect(roundTripped.name).toBe(original.name);
    expect(roundTripped.traits).toEqual(original.traits);
  });

  test('fromJSON throws on non-object input', () => {
    expect(() => Personality.fromJSON(null)).toThrow();
    expect(() => Personality.fromJSON('string')).toThrow();
  });

  test('fromJSON defaults to empty traits when traits property is missing', () => {
    const p = Personality.fromJSON({ name: 'NoTraits' });
    expect(p.name).toBe('NoTraits');
    expect(p.traits.openness).toBe(50);
  });
});

describe('Personality — dominanceScore', () => {
  test('returns a number between TRAIT_MIN and TRAIT_MAX', () => {
    const p = new Personality('Mia', { openness: 80, conscientiousness: 60, extraversion: 40, agreeableness: 90, neuroticism: 10 });
    const score = p.dominanceScore();
    expect(score).toBeGreaterThanOrEqual(TRAIT_MIN);
    expect(score).toBeLessThanOrEqual(TRAIT_MAX);
  });

  test('returns 50 for a fully neutral personality', () => {
    const p = new Personality('Neutral');
    expect(p.dominanceScore()).toBe(50);
  });

  test('respects custom weights', () => {
    const p = new Personality('Ned', {
      openness: 100, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0
    });
    // Weighting openness at 1 and everything else at 0 should yield ~100
    const score = p.dominanceScore({ openness: 1, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 });
    expect(score).toBe(100);
  });
});
