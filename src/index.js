import initOpenAI from './openai.js';
import initCohere from './cohere.js';
import initAnthropic from './anthropic.js';

/**
 * Represents the configuration for Doku.
 * @class DokuConfig
 */
class DokuConfig {
  static dokuUrl = null;
  static token = null;
  static llm = null;
  static environment = null;
  static applicationName = null;
  static skipResp = null;
}

/**
 * Initializes OpenAI functionality with performance tracking and data logging.
 *
 * @param {Object} llm - The OpenAI function object.
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
 *     {"name": "llm", "type": "Object", "description": "OpenAI function."},
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
function init({ llm, dokuUrl, token, environment="default", applicationName="default", skipResp=false }) {
  DokuConfig.dokuUrl = dokuUrl;
  DokuConfig.token = token;
  DokuConfig.llm = llm;
  DokuConfig.environment = environment;
  DokuConfig.applicationName = applicationName;
  DokuConfig.skipResp = skipResp;

  if (llm.fineTuning && typeof llm.completions.create === 'function') {
    initOpenAI({ llm, dokuUrl, token, environment, applicationName, skipResp });
  } else if (llm.generate && typeof llm.rerank === 'function') {
    initCohere({ llm, dokuUrl, token, environment, applicationName, skipResp });
  } else if (typeof llm.summarize=== 'function') {
    initAnthropic({ llm, dokuUrl, token, environment, applicationName, skipResp });
  }
}

// Setting up the dokumetry namespace object
const DokuMetry = {
  init: init,
};

export default DokuMetry;