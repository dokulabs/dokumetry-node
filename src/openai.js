import {sendData} from './helpers.js';

/**
 * Initializes OpenAI functionality with performance tracking and data logging.
 *
 * @param {Object} func - The OpenAI function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} token - The authentication token.
 * @param {string} environment - The environment.
 * @param {string} applicationName - The application name.
 * @return {void}
 *
 * @jsondoc
 * {
 *   "description": "Performance tracking for OpenAI APIs",
 *   "params": [
 *     {"name": "func", "type": "Object", "description": "OpenAI function."},
 *     {"name": "dokuUrl", "type": "string", "description": "The URL"},
 *     {"name": "token", "type": "string", "description": "The auth token."}
 *   ],
 *   "returns": {"type": "void"},
 *   "example": {
 *     "description": "Example usage of init function.",
 *     "code": "init(openaiFunc, 'https://example.com/log', 'authToken');"
 *   }
 * }
 */
export default function init(func, dokuUrl, token, environment, applicationName) {
  // Save original method
  const originalChatCreate = func.chat.completions.create;
  const originalCompletionsCreate = func.completions.create;
  const originalEmbeddingsCreate = func.embeddings.create;
  const originalFineTuningJobsCreate = func.fineTuning.jobs.create;
  const originalImagesCreate = func.images.generate;
  const originalImagesCreateVariation = func.images.createVariation;
  const originalAudioSpeechCreate = func.audio.speech.create;

  // Define wrapped method
  func.chat.completions.create = async function(params) {
    const start = performance.now();
    // Call original method
    const response = await originalChatCreate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'openai.chat.completions',
      requestDuration: duration,
      model: params.model,
      prompt: params.messages[0].content,
    };

    if (!params.hasOwnProperty('stream') || params.stream !== true) {
      data.completionTokens = response.usage.completion_tokens;
      data.promptTokens = response.usage.prompt_tokens;
      data.totalTokens = response.usage.total_tokens;
      data.finishReason = response.choices[0].finish_reason;
      data.response = response.choices[0].message.content;
    }

    sendData(data, dokuUrl, token);
    return response;
  };

  func.completions.create = async function(params) {
    const start = performance.now();
    const response = await originalCompletionsCreate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'openai.completions',
      requestDuration: duration,
      model: params.model,
      prompt: params.prompt,
    };

    if (!params.hasOwnProperty('stream') || params.stream !== true) {
      data.completionTokens = response.usage.completion_tokens;
      data.promptTokens = response.usage.prompt_tokens;
      data.totalTokens = response.usage.total_tokens;
      data.finishReason = response.choices[0].finish_reason;
      data.response = response.choices[0].text;
    }

    sendData(data, dokuUrl, token);

    return response;
  };

  func.embeddings.create = async function(params) {
    const start = performance.now();
    const response = await originalEmbeddingsCreate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'openai.embeddings',
      requestDuration: duration,
      model: params.model,
      prompt: params.input,
      promptTokens: response.usage.prompt_tokens,
      totalTokens: response.usage.total_tokens,
    };

    sendData(data, dokuUrl, token);

    return response;
  };

  func.fineTuning.jobs.create = async function(params) {
    const start = performance.now();
    const response = await originalFineTuningJobsCreate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'openai.fine_tuning',
      requestDuration: duration,
      model: params.model,
      finetuneJobId: response.id,
      finetuneJobStatus: response.status,
    };

    sendData(data, dokuUrl, token);

    return response;
  };

  func.images.generate = async function(params) {
    const start = performance.now();
    const response = await originalImagesCreate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;
    const size = params.size || '10324x1024';
    const model = params.model || 'dall-e-2';
    let imageFormat = 'url';

    if (params.response_format && params.response_format === 'b64_json') {
      imageFormat = 'b64_json';
    }

    for (const item of response.data) {
      const data = {
        environment: environment,
        applicationName: applicationName,
        sourceLanguage: 'Javascript',
        endpoint: 'openai.images.create',
        requestDuration: duration,
        model: model,
        prompt: params.prompt,
        imageSize: size,
        revisedPrompt: item.revised_prompt || null,
        image: item[imageFormat],
      };

      sendData(data, dokuUrl, token);
    }

    return response;
  };

  func.images.createVariation = async function(params) {
    const start = performance.now();
    const response = await originalImagesCreateVariation.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;
    const size = params.size || '10324x1024'; // Default size if not provided
    const model = params.model || 'dall-e-2';
    let imageFormat = 'url';
    if (params.response_format && params.response_format === 'b64_json') {
      imageFormat = 'b64_json';
    }
    for (const item of response.data) {
      const data = {
        environment: environment,
        applicationName: applicationName,
        sourceLanguage: 'Javascript',
        endpoint: 'openai.images.create.variations',
        requestDuration: duration,
        model: model,
        imageSize: size,
        image: item[imageFormat],
      };

      sendData(data, dokuUrl, token);
    }

    return response;
  };

  func.audio.speech.create = async function(params) {
    const start = performance.now();
    const response = await originalAudioSpeechCreate.call(this, params);
    const end = performance.now();
    const duration = (end - start) / 1000;

    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'openai.audio.speech.create',
      requestDuration: duration,
      model: params.model,
      prompt: params.input,
      audioVoice: params.voice,
      promptTokens: params.input.length,
    };

    sendData(data, dokuUrl, token);

    return response;
  };
}
