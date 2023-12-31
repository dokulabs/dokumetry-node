/**
 * Sends data to the specified Doku URL using the provided authentication apiKey.
 *
 * @param {Object} data - The data to be sent.
 * @param {string} dokuUrl - The Doku URL for sending data.
 * @param {string} authToken - The authentication apiKey.
 * @return {Promise<Response>} - A Promise that resolves to the HTTP response.
 *
 * @jsondoc
 * {
 *   "description": "Sends data to the Doku URL using the provided apiKey.",
 *   "params": [
 *     {"name": "data", "type": "Object", "description": "data to be sent."},
 *     {"name": "dokuUrl", "type": "string", "description": "Doku URL"},
 *     {"name": "authToken", "type": "string", "description": "Auth apiKey."}
 *   ],
 *   "returns": {
 *     "type": "Promise<Response>",
 *     "description": "A Promise that resolves to the HTTP response."
 *   },
 *   "example": {
 *     "description": "Example usage of sendData function.",
 *     "code": sendData(data, 'https://example.com/doku', 'authToken');
 *   }
 * }
 */
export async function sendData(data, dokuUrl, authToken) {
  // Remove trailing slash if present
  const url = dokuUrl.endsWith('/') ? dokuUrl.slice(0, -1) : dokuUrl;
  try {
    const response = await fetch(`${url}/api/push`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error sending Data: HTTP status ${response.status}`);
    }
    return response;
    
  } catch (err) {
    throw new Error(`Error sending Metrics: ${err}`);
  }
}
