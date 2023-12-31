import {sendData} from './helpers.js';
import {countTokens} from '@anthropic-ai/tokenizer';

/**
 * Initializes Anthropic functionality with performance tracking.
 *
 * @param {Object} llm - The Anthropic function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} apiKey - The authentication apiKey.
 * @param {string} environment - The environment.
 * @param {string} applicationName - The application name.
 * @param {boolean} skipResp - To skip waiting for API resopnse.
 * @return {void}
 *
 * @jsondoc
 * {
 *   "description": "Initializes Anthropic function and performance tracking",
 *   "params": [
 *     {"name": "dokuUrl", "type": "string", "description": "Doku URL"},
 *     {"name": "apiKey", "type": "string", "description": "Auth apiKey"},
 *     {"name": "llm", "type": "Object", "description": "The Anthropic object"},
 *     {"name": "environment", "type": "string", "description": "Environment"},
 *     {"name": "applicationName", "type": "string", "description": "Application Name"},
 *     {"name": "skipResp", "type": "boolean", "description": "To skip waiting for API resopnse."}
 *   ],
 *   "returns": {"type": "void"},
 *   "example": {
 *     "description": "Example usage of init function.",
 *     "code": "init('https://example.com/log', 'authToken', anthropicFunc);"
 *   }
 * }
 */
export default function initAnthropic({ llm, dokuUrl, apiKey, environment, applicationName, skipResp }) {
  const originalCompletionsCreate = llm.completions.create;

  // Define wrapped method
  llm.completions.create = async function(params) {
    const start = performance.now();
    const response = await originalCompletionsCreate.apply(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'anthropic.completions',
      skipResp: skipResp,
      completionTokens: countTokens(response.completion),
      promptTokens: countTokens(prompt),
      requestDuration: duration,
      model: params.model,
      prompt: params.prompt,
      finishReason: response.stop_reason,
      response: response.completion,
    };

    await sendData(data, dokuUrl, apiKey);

    return response;
  };
}
