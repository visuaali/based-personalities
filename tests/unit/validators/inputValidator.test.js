const { validatePersonalityInput, NAME_MAX_LENGTH } = require('../../../src/validators/inputValidator');

describe('validatePersonalityInput — valid inputs', () => {
  test('accepts a minimal valid payload (name only)', () => {
    const result = validatePersonalityInput({ name: 'Alice' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('accepts a payload with all traits at boundary values', () => {
    const result = validatePersonalityInput({
      name: 'Bob',
      traits: { openness: 0, conscientiousness: 100, extraversion: 50, agreeableness: 0, neuroticism: 100 }
    });
    expect(result.valid).toBe(true);
  });

  test('accepts a payload with a subset of traits', () => {
    const result = validatePersonalityInput({ name: 'Carol', traits: { openness: 75 } });
    expect(result.valid).toBe(true);
  });

  test('accepts a name at exactly the maximum length', () => {
    const result = validatePersonalityInput({ name: 'x'.repeat(NAME_MAX_LENGTH) });
    expect(result.valid).toBe(true);
  });
});

describe('validatePersonalityInput — invalid name', () => {
  test('rejects missing name', () => {
    const result = validatePersonalityInput({ traits: {} });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('name')]));
  });

  test('rejects null name', () => {
    const result = validatePersonalityInput({ name: null });
    expect(result.valid).toBe(false);
  });

  test('rejects numeric name', () => {
    const result = validatePersonalityInput({ name: 42 });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('string')]));
  });

  test('rejects empty string name', () => {
    const result = validatePersonalityInput({ name: '' });
    expect(result.valid).toBe(false);
  });

  test('rejects whitespace-only name', () => {
    const result = validatePersonalityInput({ name: '   ' });
    expect(result.valid).toBe(false);
  });

  test('rejects a name one character over the maximum length', () => {
    const result = validatePersonalityInput({ name: 'x'.repeat(NAME_MAX_LENGTH + 1) });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining(`${NAME_MAX_LENGTH}`)]));
  });
});

describe('validatePersonalityInput — invalid traits', () => {
  test('rejects traits as an array', () => {
    const result = validatePersonalityInput({ name: 'Dave', traits: [80] });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('plain object')]));
  });

  test('rejects a trait value below TRAIT_MIN', () => {
    const result = validatePersonalityInput({ name: 'Eve', traits: { openness: -1 } });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('openness')]));
  });

  test('rejects a trait value above TRAIT_MAX', () => {
    const result = validatePersonalityInput({ name: 'Frank', traits: { openness: 101 } });
    expect(result.valid).toBe(false);
  });

  test('rejects a non-numeric trait value', () => {
    const result = validatePersonalityInput({ name: 'Grace', traits: { openness: 'high' } });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('number')]));
  });

  test('rejects Infinity as a trait value', () => {
    const result = validatePersonalityInput({ name: 'Hank', traits: { openness: Infinity } });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('finite')]));
  });

  test('rejects NaN as a trait value', () => {
    const result = validatePersonalityInput({ name: 'Iris', traits: { openness: NaN } });
    expect(result.valid).toBe(false);
  });

  test('rejects unknown trait keys', () => {
    const result = validatePersonalityInput({ name: 'Jack', traits: { mood: 70 } });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('mood')]));
  });

  test('accumulates multiple errors', () => {
    const result = validatePersonalityInput({ name: '', traits: { openness: -5, mood: 10 } });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('validatePersonalityInput — invalid top-level input', () => {
  test('rejects null', () => {
    const result = validatePersonalityInput(null);
    expect(result.valid).toBe(false);
  });

  test('rejects a string', () => {
    const result = validatePersonalityInput('Alice');
    expect(result.valid).toBe(false);
  });

  test('rejects an array', () => {
    const result = validatePersonalityInput([]);
    expect(result.valid).toBe(false);
  });
});
