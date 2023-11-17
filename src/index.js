/**
 * Represents the configuration for Doku.
 * @class DokuConfig
 */
class DokuConfig {
  static dokuUrl = null;
  static token = null;
  static func = null;
}

/**
 * Initializes OpenAI functionality with performance tracking and data logging.
 *
 * @param {Object} func - The OpenAI function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} token - The authentication token.
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
export default function init(func, dokuUrl, token) {
  DokuConfig.dokuUrl = dokuUrl;
  DokuConfig.token = token;
  DokuConfig.func = func;

  if (func.chat && typeof func.chat.completions.create === 'function') {
    initOpenAI(func, dokuUrl, token);
  } else if (func.generate && typeof func.generate === 'function') {
    initCohere(func, dokuUrl, token);
  } else if (typeof func.summarize=== 'function') {
    initAnthropic(func, dokuUrl, token);
  }
}

// module.exports = init;
