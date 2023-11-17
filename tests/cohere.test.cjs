const {CohereClient} = require('cohere-ai');
const {expect} = require('chai');

const cohere = new CohereClient({
  token: process.env.COHERE_API_TOKEN,
});

describe('Cohere Test', () => {
  before(async () => {
    const module = await import('../src/cohere.js');
    initCohere = module.default;
    initCohere(cohere, process.env.DOKU_URL, process.env.DOKU_TOKEN);
  });

  it('should return a response with "created" field', async () => {
    const text =
    'Ice cream is a sweetened frozen food eaten as a snack or dessert. ' +
    'It may be made from milk or cream and is flavoured with a sweetener, ' +
    'either sugar or an alternative, and a spice, such as cocoa or vanilla, ' +
    'or with fruit such as strawberries or peaches. ' +
    'It can be made by whisking a cream base and liquid nitrogen together. ' +
    'Food coloring is sometimes added, in addition to stabilizers. ' +
    'The mixture is cooled to freezing point and stirred to add air spaces ' +
    'and to prevent ice crystals from forming. The result is a smooth, ' +
    'semi-solid foam that is solid at low temperatures. ' +
    'It becomes more malleable as its temperature increases.\n\n' +
    'The meaning of the name "ice cream" varies from one country to another. ' +
    'In some countries, "ice cream" applies only to a specific variety, ' +
    'and governments regulate the use of the various terms according to the ' +
    'relative quantities of the main ingredients. ' +
    'Products that do not meet the criteria are sometimes labelled ' +
    '"frozen dairy dessert" instead. In other countries, ' +
    'one word is used fo\r all. Analogues made from dairy alternatives, ' +
    'such as goat or sheep milk, or milk substitutes ' +
    ', are available for those who are ' +
    'lactose intolerant, allergic to dairy protein or vegan.';

    const summarizeResp = await cohere.summarize({
      text: text,
    });

    expect(summarizeResp.id).to.exist;
  }).timeout(10000);

  it('should return a response with prompt as "Doku"', async () => {
    const generate = await cohere.generate({
      prompt: 'Doku',
      maxTokens: 10,
    });

    expect(generate.prompt).to.equal('Doku');
  }).timeout(10000);

  it('should return a response with object as "embed"', async () => {
    const embeddings = await cohere.embed({
      texts: ['This is a test'],
    });

    expect(embeddings.id).to.exist;
  }).timeout(10000);

  it('should return a response with object as "chat"', async () => {
    const chatResponse = await cohere.chat({
      message: 'Say this is a test',
      model: 'command',
    });

    expect(chatResponse.response_id).to.exist;
  }).timeout(10000);
});
