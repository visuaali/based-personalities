/**
 * Integration tests — personality pipeline
 *
 * These tests verify that the validator, model, and generator work together
 * correctly end-to-end.
 */

const { validatePersonalityInput } = require('../../src/validators/inputValidator');
const { Personality } = require('../../src/models/personality');
const { generatePersonality } = require('../../src/generators/personalityGenerator');

describe('Personality pipeline — validate → construct', () => {
  test('valid input passes validation and constructs successfully', () => {
    const input = { name: 'Alice', traits: { openness: 80, conscientiousness: 60 } };
    const { valid, errors } = validatePersonalityInput(input);
    expect(valid).toBe(true);

    const p = new Personality(input.name, input.traits);
    expect(p.name).toBe('Alice');
    expect(p.traits.openness).toBe(80);
  });

  test('invalid input fails validation and is never constructed', () => {
    const input = { name: '', traits: { openness: 200 } };
    const { valid } = validatePersonalityInput(input);
    expect(valid).toBe(false);
    // No construction attempted
  });
});

describe('Personality pipeline — generate → serialise → reconstruct', () => {
  test('round-trips a generated personality through JSON without data loss', () => {
    const original = generatePersonality('Bob', { seed: 1337 });
    const json = JSON.stringify(original.toJSON());
    const data = JSON.parse(json);
    const restored = Personality.fromJSON(data);

    expect(restored.name).toBe(original.name);
    expect(restored.traits).toEqual(original.traits);
  });

  test('dominanceScore is stable after a JSON round-trip', () => {
    const original = generatePersonality('Carol', { seed: 7 });
    const restored = Personality.fromJSON(original.toJSON());
    expect(restored.dominanceScore()).toBe(original.dominanceScore());
  });
});

describe('Personality pipeline — batch generation reproducibility', () => {
  test('generates 10 personalities with unique names and valid traits', () => {
    const personalities = Array.from({ length: 10 }, (_, i) =>
      generatePersonality(`Person_${i}`, { seed: i * 100 })
    );

    const names = personalities.map(p => p.name);
    expect(new Set(names).size).toBe(10);

    personalities.forEach(p => {
      Object.values(p.traits).forEach(v => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      });
    });
  });
});
