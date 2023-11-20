import {sendData} from './helpers.js';
import {countTokens} from '@anthropic-ai/tokenizer';

/**
 * Initializes Anthropic functionality with performance tracking.
 *
 * @param {Object} func - The Anthropic function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} token - The authentication token.
 * @param {string} environment - The environment.
 * @param {string} applicationName - The application name.
 * @return {void}
 *
 * @jsondoc
 * {
 *   "description": "Initializes Anthropic function and performance tracking",
 *   "params": [
 *     {"name": "dokuUrl", "type": "string", "description": "Doku URL"},
 *     {"name": "token", "type": "string", "description": "Auth Token"},
 *     {"name": "func", "type": "Object", "description": "The Anthropic object"}
 *   ],
 *   "returns": {"type": "void"},
 *   "example": {
 *     "description": "Example usage of init function.",
 *     "code": "init('https://example.com/log', 'authToken', anthropicFunc);"
 *   }
 * }
 */
export default function init(func, dokuUrl, token, environment, applicationName) {
  const originalCompletionsCreate = func.completions.create;

  // Define wrapped method
  func.completions.create = async function(params) {
    const start = performance.now();
    const response = await originalCompletionsCreate.apply(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'anthropic.completions',
      completionTokens: countTokens(response.completion),
      promptTokens: countTokens(prompt),
      requestDuration: duration,
      model: params.model,
      prompt: params.prompt,
      finishReason: response.stop_reason,
      response: response.completion,
    };

    sendData(data, dokuUrl, token);

    return response;
  };
}
