import {sendData} from './helpers.js';

/**
 * Initializes OpenAI functionality with performance tracking and data logging.
 *
 * @param {Object} func - The OpenAI function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} token - The authentication token.
 * @param {string} environment - The environment.
 * @param {string} applicationName - The application name.
 * @param {boolean} skipResp - To skip waiting for API resopnse.
 * @return {void}
 *
 * @jsondoc
 * {
 *   "description": "Performance tracking for OpenAI APIs",
 *   "params": [
 *     {"name": "func", "type": "Object", "description": "OpenAI function."},
 *     {"name": "dokuUrl", "type": "string", "description": "The URL"},
 *     {"name": "token", "type": "string", "description": "The auth token."},
 *     {"name": "environment", "type": "string", "description": "The environment."},
 *     {"name": "applicationName", "type": "string", "description": "The application name."},
 *     {"name": "skipResp", "type": "boolean", "description": "To skip waiting for API resopnse."}
 *   ],
 *   "returns": {"type": "void"},
 *   "example": {
 *     "description": "Example usage of init function.",
 *     "code": "init(openaiFunc, 'https://example.com/log', 'authToken');"
 *   }
 * }
 */
export default function initOpenAI(func, { dokuUrl, token, environment, applicationName, skipResp }) {
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

    let formattedMessages = [];
    for (let message of params.messages) {
      let role = message.role;
      let content = message.content;

      if (Array.isArray(content)) {
        let contentStr = content.map(item => {
          if (item.type) {
            return `${item.type}: ${item.text || item.image_url}`;
          } else {
            return `text: ${item.text}`;
          }
        }).join(", ");
        formattedMessages.push(`${role}: ${contentStr}`);
      } else {
        formattedMessages.push(`${role}: ${content}`);
      }
    }
    let prompt = formattedMessages.join("\n");
    const data = {
      environment: environment,
      applicationName: applicationName,
      sourceLanguage: 'Javascript',
      endpoint: 'openai.chat.completions',
      skipResp: skipResp,
      requestDuration: duration,
      model: params.model,
      prompt: prompt,
    };

    if (!params.hasOwnProperty('stream') || params.stream !== true) {
      data.completionTokens = response.usage.completion_tokens;
      data.promptTokens = response.usage.prompt_tokens;
      data.totalTokens = response.usage.total_tokens;
      data.finishReason = response.choices[0].finish_reason;
    }

    if (!params.hasOwnProperty('tools')) {
      if (!params.hasOwnProperty('n') || params.n === 1) {
        data.response = response.choices[0].message.content;
      } else {
        let i = 0;
        while (i < params.n && i < response.choices.length) {
          data.response = response.choices[i].message.content;
          i++;
          sendData(data, dokuUrl, token);
        }
        return response;
      }
    } else {
      data.response = "Function called with tools";
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
      skipResp: skipResp,
      requestDuration: duration,
      model: params.model,
      prompt: params.prompt,
    };

    if (!params.hasOwnProperty('stream') || params.stream !== true) {
      data.completionTokens = response.usage.completion_tokens;
      data.promptTokens = response.usage.prompt_tokens;
      data.totalTokens = response.usage.total_tokens;
      data.finishReason = response.choices[0].finish_reason;
    }

    if (!params.hasOwnProperty('tools')) {
      if (!params.hasOwnProperty('n') || params.n === 1) {
        data.response = response.choices[0].text;
      } else {
        let i = 0;
        while (i < params.n && i < response.choices.length) {
          data.response = response.choices[i].text;
          i++;
          console.log(data);
          // sendData(data, doku_url, token);
        }
        return response;
      }
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
      skipResp: skipResp,
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
      skipResp: skipResp,
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

    const quality = params.quality ?? 'standard';

    for (const item of response.data) {
      const data = {
        environment: environment,
        applicationName: applicationName,
        sourceLanguage: 'Javascript',
        endpoint: 'openai.images.create',
        skipResp: skipResp,
        requestDuration: duration,
        model: model,
        prompt: params.prompt,
        imageSize: size,
        imageQuality: quality,
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
        skipResp: skipResp,
        requestDuration: duration,
        model: model,
        imageSize: size,
        imageQuality: "standard",
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
      skipResp: skipResp,
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
