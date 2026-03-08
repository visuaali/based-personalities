'use strict';

const { Personality } = require('../../src/models/personality');

// ── Mock the SDK before requiring the module under test ──────────────────────
let mockQuery;
jest.mock('@anthropic-ai/claude-agent-sdk', () => ({
  query: (...args) => mockQuery(...args),
}));

const { analysePersonality } = require('../../src/agent');

// Helper: build an async iterable from a list of messages
async function* makeStream(...messages) {
  yield* messages;
}

// Shared test fixture
let personality;
beforeEach(() => {
  personality = new Personality('Alice', {
    openness: 80,
    conscientiousness: 60,
    extraversion: 40,
    agreeableness: 70,
    neuroticism: 30,
  });
  mockQuery = jest.fn();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('analysePersonality — result extraction', () => {
  test('returns the result string when a { result } message is yielded', async () => {
    mockQuery.mockReturnValue(makeStream({ result: 'Great analysis!' }));
    const output = await analysePersonality(personality);
    expect(output).toBe('Great analysis!');
  });

  test('returns the last result when multiple { result } messages are yielded', async () => {
    mockQuery.mockReturnValue(
      makeStream(
        { type: 'text', text: 'thinking…' },
        { result: 'First result' },
        { result: 'Final result' },
      ),
    );
    const output = await analysePersonality(personality);
    expect(output).toBe('Final result');
  });

  test('returns empty string when no message has a result key', async () => {
    mockQuery.mockReturnValue(
      makeStream({ type: 'text', text: 'hello' }, { type: 'tool_use' }),
    );
    const output = await analysePersonality(personality);
    expect(output).toBe('');
  });

  test('returns empty string when the async iterable yields no messages', async () => {
    mockQuery.mockReturnValue(makeStream());
    const output = await analysePersonality(personality);
    expect(output).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('analysePersonality — prompt content', () => {
  let capturedPrompt;

  beforeEach(() => {
    mockQuery.mockImplementation(({ prompt }) => {
      capturedPrompt = prompt;
      return makeStream({ result: '' });
    });
  });

  test('prompt includes the personality name', async () => {
    await analysePersonality(personality);
    expect(capturedPrompt).toContain('Alice');
  });

  test('prompt includes the openness score', async () => {
    await analysePersonality(personality);
    expect(capturedPrompt).toContain('80');
  });

  test('prompt includes the conscientiousness score', async () => {
    await analysePersonality(personality);
    expect(capturedPrompt).toContain('60');
  });

  test('prompt includes the extraversion score', async () => {
    await analysePersonality(personality);
    expect(capturedPrompt).toContain('40');
  });

  test('prompt includes the agreeableness score', async () => {
    await analysePersonality(personality);
    expect(capturedPrompt).toContain('70');
  });

  test('prompt includes the neuroticism score', async () => {
    await analysePersonality(personality);
    expect(capturedPrompt).toContain('30');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('analysePersonality — query options', () => {
  let capturedOptions;

  beforeEach(() => {
    mockQuery.mockImplementation(({ options }) => {
      capturedOptions = options;
      return makeStream({ result: '' });
    });
  });

  test('calls query with allowedTools: []', async () => {
    await analysePersonality(personality);
    expect(capturedOptions.allowedTools).toEqual([]);
  });

  test('calls query with maxTurns: 1', async () => {
    await analysePersonality(personality);
    expect(capturedOptions.maxTurns).toBe(1);
  });
});
