import {sendData} from './helpers.js';

/**
 * Counts the number of tokens in the given text.
 *
 * @param {string} text - The input text.
 * @return {number} - The calculated number of tokens.
 *
 * @jsondoc
 * {
 *   "description": "Counts the number of tokens in the given text",
 *   "params": [{"name": "text", "type": "string", "description": "Text"}],
 *   "returns": {"type": "number", "description": "Number of tokens."}
 * }
 */
function countTokens(text) {
  const tokensPerWord = 2;

  // Split the text into words
  const words = text.split(/\s+/);

  // Calculate the number of tokens
  const numTokens = Math.round(words.length * tokensPerWord);

  return numTokens;
}
/**
 * Initializes Cohere functionality with performance tracking and data logging.
 *
 * @param {Object} llm - The Cohere function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} token - The authentication token.
 * @param {string} environment - The environment.
 * @param {string} applicationName - The application name.
 * @param {boolean} skipResp - To skip waiting for API resopnse.
 * @return {void}
 *
 * @jsondoc
 * {
 *   "description": "Initializes Cohere functionality and performance tracking",
 *   "params": [
 *     {"name": "llm", "type": "Object", "description": "Cohere object"},
 *     {"name": "dokuUrl", "type": "string", "description": "URL for Doku"},
 *     {"name": "token", "type": "string", "description": "Auth token."},
 *     {"name": "environment", "type": "string", "description": "Environment."},
 *     {"name": "applicationName", "type": "string", "description": "Application name."},
 *     {"name": "skipResp", "type": "boolean", "description": "To skip waiting for API resopnse."}
 *   ],
 *   "returns": {"type": "void"},
 *   "example": {
 *     "description": "Example usage of init function.",
 *     "code": "init(cohereFunc, 'https://example.com/log', 'authToken');"
 *   }
 * }
 */
export default function initCohere({ llm, dokuUrl, token, environment, applicationName, skipResp }) {
  const originalGenerate = llm.generate;
  const originalEmbed = llm.embed;
  const originalChat = llm.chat;
  const originalSummarize = llm.summarize;

  // Define wrapped methods
  llm.generate = async function(params) {
    const start = performance.now();
    const response = await originalGenerate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const model = params.model || 'command';
    const prompt = params.prompt;

    for (const generation of response.generations) {
      const data = {
        environment: environment,
        applicationName: applicationName,
        sourceLanguage: 'Javascript',
        endpoint: 'cohere.generate',
        skipResp: skipResp,
        completionTokens: countTokens(generation.text),
        promptTokens: countTokens(prompt),
        requestDuration: duration,
        model: model,
        prompt: prompt,
        response: generation.text,
      };

      if (!params.hasOwnProperty('stream') || params.stream !== true) {
        data.finishReason = generation.finish_reason;
      }
      await sendData(data, dokuUrl, token);
    }

    return response;
  };

  llm.embed = async function(params) {
    const start = performance.now();
    const response = await originalEmbed.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const model = params.model || 'embed-english-v2.0';
    const prompt = params.texts.toString();

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'cohere.embed',
      skipResp: skipResp,
      requestDuration: duration,
      model: model,
      prompt: prompt,
    };

    await sendData(data, dokuUrl, token);

    return response;
  };

  llm.chat = async function(params) {
    const start = performance.now();
    const response = await originalChat.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const model = params.model || 'command';
    const prompt = params.message;
    const cost = response.token_count['billed_tokens'] * 0.000002;

    if (!params.hasOwnProperty('stream') || params.stream !== true) {
      const data = {
        environment: environment,
        applicationName: applicationName,
        sourceLanguage: 'Javascript',
        endpoint: 'cohere.chat',
        skipResp: skipResp,
        requestDuration: duration,
        completionTokens: response.token_count['response_tokens'],
        promptTokens: response.token_count['prompt_tokens'],
        totalTokens: response.token_count['total_tokens'],
        usageCost: cost,
        model: model,
        prompt: prompt,
        response: response.text,
      };

      await sendData(data, dokuUrl, token);
    }

    return response;
  };

  llm.summarize = async function(params) {
    const start = performance.now();
    const response = await originalSummarize.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const model = params.model || 'command';
    const prompt = params.text;

    if (!params.hasOwnProperty('stream') || params.stream !== true) {
      const data = {
        environment: environment,
        applicationName: applicationName,
        sourceLanguage: 'Javascript',
        endpoint: 'cohere.summarize',
        skipResp: skipResp,
        requestDuration: duration,
        completionTokens: countTokens(response.summary),
        promptTokens: countTokens(prompt),
        model: model,
        prompt: prompt,
        response: response.summary,
      };

      await sendData(data, dokuUrl, token);
    }

    return response;
  };
}
