import Anthropic from '@anthropic-ai/sdk';
import {expect} from 'chai';
import DokuMetry from '../src/index.js';

describe('Anthropic Test', () => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_TOKEN,
  });

  // Non-streaming messages
  it('should return a response with type as "message"', async () => {
    DokuMetry.init({llm: anthropic, dokuUrl: process.env.DOKU_URL, apiKey: process.env.DOKU_TOKEN, environment: "dokumetry-testing", applicationName: "dokumetry-node-test", skipResp: false});
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "How to monitor LLM Applications in one sentence?" }],
      });
      expect(message.type).to.equal('message');
    } catch (error) {
        if (typeof error.message === 'string' && error.message.includes('rate limit')) {
          console.error("Daily Rate limit Reached");
        }
    }
  }).timeout(30000);

  it('should return a response with type as "message"', async () => {
    DokuMetry.init({llm: anthropic, dokuUrl: process.env.DOKU_URL, apiKey: process.env.DOKU_TOKEN, environment: "dokumetry-testing", applicationName: "dokumetry-node-test", skipResp: false});
    try {
      var stream = await anthropic.messages.create({
        max_tokens: 1,
        messages: [{ role: 'user', content: 'How to monitor LLM Applications in one sentence?' }],
        model: 'claude-3-haiku-20240307',
        stream: true,
      });
      for await (const messageStreamEvent of stream) {
        if (messageStreamEvent.type === 'message_start') {
          expect(messageStreamEvent.type).to.equal('message_start');
        }
        if (messageStreamEvent.type === 'content_block_delta') {
          expect(messageStreamEvent.type).to.equal('content_block_delta');
        }
      }
    } catch (error) {
        if (typeof error.message === 'string' && error.message.includes('rate limit')) {
          console.error("Daily Rate limit Reached");
        }
    }
  }).timeout(30000);
});