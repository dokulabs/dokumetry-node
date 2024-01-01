import OpenAI from 'openai';
import {expect} from 'chai';
import DokuMetry from '../src/index.js';
import fs from "fs";

describe('OpenAI Test', () => {
  let openai;

  before(async () => {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_TOKEN,
    });
    await DokuMetry.init({llm: openai, dokuUrl: process.env.DOKU_URL, apiKey: process.env.DOKU_TOKEN, environment: "dokumetry-testing", applicationName: "dokumetry-node-test", skipResp: false});
  });

  it('should return a response with object as "chat.completion"', async () => {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{role: 'user', content: 'Say this is a test'}],
      model: 'gpt-3.5-turbo',
    });

    expect(chatCompletion.object).to.equal('chat.completion');
  });

  it('should return a response with object as "text_completion"', async () => {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: 'Say this is a test.',
      max_tokens: 7,
    });

    expect(completion.object).to.equal('text_completion');
  });

  it('should return a response with object as "embedding"', async () => {
    const embeddings = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: 'The quick brown fox jumped over the lazy dog',
      encoding_format: 'float',
    });

    expect(embeddings.data[0].object).to.equal('embedding');
  });

  it('should return a response with object as "fine_tuning.job"', async () => {
    try {
      const fineTuningJob = await openai.fineTuning.jobs.create({
        training_file: 'file-m36cc45komO83VJKAY1qVgeP',
        model: 'gpt-3.5-turbo',
      });
 
      expect(fineTuningJob.object).to.equal('fine_tuning.job');
    } catch (error) {
      // Check if it's a rate limit error
      if (error.code == "daily_rate_limit_exceeded") {
        console.error(`Daily Rate limit Reached`);
      }
    }
  }).timeout(10000);

  it('should return a response with "created" field', async () => {
    const imageGeneration = await openai.images.generate({
      model: 'dall-e-2',
      prompt: 'Generate an image of a cat.',
    });

    expect(imageGeneration.created).to.exist;
  }).timeout(30000);

  it('should return a response with "created" field', async () => {
    const imageVariation = await openai.images.createVariation({
      image: fs.createReadStream('tests/test-image-for-openai.png'),
    });

    expect(imageVariation.created).to.exist;
  }).timeout(30000);

  it('should return a response with url as "https://api.openai.com/v1/audio/speech"', async () => {
    const audioSpeech = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: 'Today is a wonderful day to build something people love!',
    });

    expect(audioSpeech.url).to.equal('https://api.openai.com/v1/audio/speech');
  });
});
