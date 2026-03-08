'use strict';

const request = require('supertest');

// Mock src/index to avoid loading src/agent.js → Claude Agent SDK (ESM).
// Provide real Personality + validatePersonalityInput, and a jest.fn() for
// analysePersonality that we control per-test.
jest.mock('../../src/index', () => {
  const { Personality } = jest.requireActual('../../src/models/personality');
  const { validatePersonalityInput } = jest.requireActual('../../src/validators/inputValidator');
  return {
    Personality,
    validatePersonalityInput,
    analysePersonality: jest.fn(),
  };
});

const { analysePersonality } = require('../../src/index');
const { app } = require('../../server');

const VALID_BODY = {
  name: 'Alice',
  traits: {
    openness: 80,
    conscientiousness: 60,
    extraversion: 40,
    agreeableness: 70,
    neuroticism: 30,
  },
};

beforeEach(() => {
  analysePersonality.mockResolvedValue('## Analysis report');
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /analyse — success', () => {
  test('returns 200 with { report } for a valid body', async () => {
    const res = await request(app).post('/analyse').send(VALID_BODY);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ report: '## Analysis report' });
  });

  test('report value comes from analysePersonality', async () => {
    analysePersonality.mockResolvedValue('Custom report text');
    const res = await request(app).post('/analyse').send(VALID_BODY);
    expect(res.body.report).toBe('Custom report text');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /analyse — validation errors (400)', () => {
  test('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/analyse')
      .send({ traits: VALID_BODY.traits });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when name is empty', async () => {
    const res = await request(app)
      .post('/analyse')
      .send({ ...VALID_BODY, name: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 when a trait value is out of range', async () => {
    const res = await request(app)
      .post('/analyse')
      .send({ ...VALID_BODY, traits: { ...VALID_BODY.traits, openness: 200 } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 for an empty body', async () => {
    const res = await request(app).post('/analyse').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /analyse — agent failure (500)', () => {
  test('returns 500 when analysePersonality throws', async () => {
    analysePersonality.mockRejectedValue(new Error('SDK error'));
    const res = await request(app).post('/analyse').send(VALID_BODY);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('OPTIONS /analyse — CORS preflight', () => {
  test('returns 204', async () => {
    const res = await request(app).options('/analyse');
    expect(res.status).toBe(204);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('CORS headers', () => {
  test('sets Access-Control-Allow-Origin: * on a POST response', async () => {
    const res = await request(app).post('/analyse').send(VALID_BODY);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  test('sets Access-Control-Allow-Headers on a POST response', async () => {
    const res = await request(app).post('/analyse').send(VALID_BODY);
    expect(res.headers['access-control-allow-headers']).toBe('Content-Type');
  });
});
