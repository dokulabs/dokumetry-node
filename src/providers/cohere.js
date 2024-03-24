import { sendData } from "../helpers/api.js";

/**
 * Initializes Cohere functionality with performance tracking and data logging.
 *
 * @param {Object} llm - The Cohere function object.
 * @param {string} dokuUrl - The URL for logging data.
 * @param {string} apiKey - The authentication apiKey.
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
 *     {"name": "apiKey", "type": "string", "description": "Auth apiKey."},
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
export default function initCohere({
	llm,
	dokuUrl,
	apiKey,
	environment,
	applicationName,
	skipResp,
}) {
	const originalGenerate = llm.generate;
	const originalEmbed = llm.embed;
	const originalChat = llm.chat;
	const originalChatStream = llm.chatStream;
	const originalSummarize = llm.summarize;

	// Define wrapped methods
	llm.generate = async function (params) {
		const start = performance.now();
		const response = await originalGenerate.call(this, params);
		const end = performance.now();
		const duration = (end - start) / 1000;

		const model = params.model || "command";
		const prompt = params.prompt;

		for (const generation of response.generations) {
			const data = {
				llmReqId: generation.id,
				environment: environment,
				applicationName: applicationName,
				sourceLanguage: "Javascript",
				endpoint: "cohere.generate",
				skipResp: skipResp,
				completionTokens: response.meta["billedUnits"]["outputTokens"],
				promptTokens: response.meta["billedUnits"]["inputTokens"],
				requestDuration: duration,
				model: model,
				prompt: prompt,
				response: generation.text,
			};
			data.totalTokens = data.promptTokens + data.completionTokens;

			if (!params.hasOwnProperty("stream") || params.stream !== true) {
				data.finishReason = generation.finish_reason;
			}

			await sendData(data, dokuUrl, apiKey);
		}

		return response;
	};

	llm.embed = async function (params) {
		const start = performance.now();
		const response = await originalEmbed.call(this, params);
		const end = performance.now();
		const duration = (end - start) / 1000;

		const model = params.model || "embed-english-v2.0";
		const prompt = params.texts.toString();

		const data = {
			environment: environment,
			applicationName: applicationName,
			sourceLanguage: "Javascript",
			endpoint: "cohere.embed",
			skipResp: skipResp,
			requestDuration: duration,
			model: model,
			prompt: prompt,
			promptTokens: response.meta["billedUnits"]["inputTokens"],
			totalTokens: response.meta["billedUnits"]["inputTokens"],
		};

		await sendData(data, dokuUrl, apiKey);

		return response;
	};

	llm.chat = async function (params) {
		const start = performance.now();
		const response = await originalChat.call(this, params);
		const end = performance.now();
		const duration = (end - start) / 1000;

		const model = params.model || "command";
		const prompt = params.message;

		const data = {
			llmReqId: response.response_id,
			environment: environment,
			applicationName: applicationName,
			sourceLanguage: "Javascript",
			endpoint: "cohere.chat",
			skipResp: skipResp,
			requestDuration: duration,
			model: model,
			prompt: prompt,
			promptTokens: response.meta["billed_units"]["output_tokens"],
			completionTokens: response.meta["billed_units"]["input_tokens"],
			totalTokens: response.token_count["billed_tokens"],
			response: response.text,
		};

		await sendData(data, dokuUrl, apiKey);

		return response;
	};

	llm.chatStream = async function* (params) {
		const start = performance.now();
		const response = await originalChatStream.call(this, params);

		const model = params.model || "command";
		const prompt = params.message;

		const data = {
			environment: environment,
			applicationName: applicationName,
			sourceLanguage: "Javascript",
			endpoint: "cohere.chat",
			skipResp: skipResp,
			model: model,
			prompt: prompt,
		};

		data.response = "";
		for await (const message of response) {
			if (message.eventType === "stream-end") {
				data.llmReqId = message.response.response_id;
				data.promptTokens = message.response.meta.billed_units["input_tokens"];
				data.completionTokens =
					message.response.meta.billed_units["output_tokens"];
			}
			data.response +=
				message.eventType === "text-generation" ? message.text : "";
			// Pass the message along so it's not consumed
			yield message; // this allows the message to flow back to the original caller
		}
		data.totalTokens = data.promptTokens + data.completionTokens;

		const end = performance.now();
		data.requestDuration = (end - start) / 1000;

		await sendData(data, dokuUrl, apiKey);

		return response;
	};

	llm.summarize = async function (params) {
		const start = performance.now();
		const response = await originalSummarize.call(this, params);
		const end = performance.now();
		const duration = (end - start) / 1000;

		const model = params.model || "command";
		const prompt = params.text;

		const data = {
			llmReqId: response.id,
			environment: environment,
			applicationName: applicationName,
			sourceLanguage: "Javascript",
			endpoint: "cohere.summarize",
			skipResp: skipResp,
			requestDuration: duration,
			completionTokens: response.meta["billedUnits"]["outputTokens"],
			promptTokens: response.meta["billedUnits"]["inputTokens"],
			model: model,
			prompt: prompt,
			response: response.summary,
		};
		data.totalTokens = data.promptTokens + data.completionTokens;

		await sendData(data, dokuUrl, apiKey);

		return response;
	};
}
