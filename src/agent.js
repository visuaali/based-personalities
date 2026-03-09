'use strict';

/**
 * Personality Analysis Agent
 *
 * Uses the Claude Agent SDK to analyse a Personality and return a written
 * report covering trait interpretation, strengths, blind-spots, and growth
 * suggestions based on the Big Five (OCEAN) model.
 *
 * Usage:
 *   const { analysePersonality } = require('./agent');
 *   const { generatePersonality } = require('./generators/personalityGenerator');
 *
 *   const p = generatePersonality('Alice', { seed: 42 });
 *   const report = await analysePersonality(p);
 *   console.log(report);
 */

const { query } = require('@anthropic-ai/claude-agent-sdk');

/**
 * Analyse a Personality instance and return a written report.
 *
 * @param {import('./models/personality').Personality} personality
 * @returns {Promise<string>} Markdown-formatted analysis report
 */
async function analysePersonality(personality) {
  const { name, traits } = personality;

  const prompt = `You are an expert psychologist specialising in the Big Five (OCEAN) personality model.

Analyse the following personality profile and write a concise, insightful report covering:
1. **Trait Overview** — interpret each trait score in plain language
2. **Core Strengths** — what this person is likely to excel at
3. **Blind Spots & Challenges** — potential pitfalls or areas to watch
4. **Growth Suggestions** — practical, actionable recommendations

Keep the tone warm and non-judgmental. Be specific — reference the actual scores, not just generic descriptions.

---

Name: ${name}
Big Five trait scores (0 = very low, 100 = very high):
- Openness to Experience: ${traits.openness}
- Conscientiousness: ${traits.conscientiousness}
- Extraversion: ${traits.extraversion}
- Agreeableness: ${traits.agreeableness}
- Neuroticism (emotional reactivity): ${traits.neuroticism}`;

  let result = '';

  for await (const message of query({
    prompt,
    options: {
      allowedTools: [],
      maxTurns: 1,
    },
  })) {
    if ('result' in message) {
      result = message.result;
    }
  }

  if (!result) throw new Error('No result returned from analysis agent');
  return result;
}

module.exports = { analysePersonality };
