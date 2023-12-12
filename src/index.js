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
  static func = null;
  static environment = null;
  static applicationName = null;
  static skipResp = null;
}

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
export default function init(func, {dokuUrl, token, environment="default", applicationName="default", skipResp=false}) {
  DokuConfig.dokuUrl = dokuUrl;
  DokuConfig.token = token;
  DokuConfig.func = func;
  DokuConfig.environment = environment;
  DokuConfig.applicationName = applicationName;
  DokuConfig.skipResp = skipResp;

  if (func.fineTuning && typeof func.completions.create === 'function') {
    initOpenAI(func, { dokuUrl, token, environment, applicationName, skipResp });
  } else if (func.generate && typeof func.rerank === 'function') {
    initCohere(func, {dokuUrl, token, environment, applicationName, skipResp});
  } else if (typeof func.summarize=== 'function') {
    initAnthropic(func, {dokuUrl, token, environment, applicationName, skipResp});
  }
}
