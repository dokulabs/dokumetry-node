# Doku Node SDK - dokumetry

[![Doku NPM Package](https://img.shields.io/badge/Doku-orange)](https://github.com/dokulabs/doku)
[![License](https://img.shields.io/github/license/dokulabs/dokumetry-node?label=license&logo=github&color=f80&logoColor=fff%22%20alt=%22License)](https://github.com/dokulabs/dokumetry-node/blob/main/LICENSE)
[![Package Version](https://img.shields.io/github/tag/dokulabs/dokumetry-node.svg?&label=Package%20Version&logo=npm)](https://github.com/dokulabs/dokumetry-node/tags)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/dokulabs/dokumetry-node)](https://github.com/dokulabs/dokumetry-node/pulse)
[![GitHub Contributors](https://img.shields.io/github/contributors/dokulabs/dokumetry-node)](https://github.com/dokulabs/dokumetry-node/graphs/contributors)

[![Tests](https://github.com/dokulabs/dokumetry-node/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/dokulabs/dokumetry-node/actions/workflows/tests.yml)
[![Linting](https://github.com/dokulabs/dokumetry-node/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/dokulabs/dokumetry-node/actions/workflows/lint.yml)
[![CodeQL](https://github.com/dokulabs/dokumetry-node/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/dokulabs/dokumetry-node/actions/workflows/github-code-scanning/codeql)

[Doku Node SDK](https://www.npmjs.com/package/dokumetry) (`dokumetry`) empowers you to effortlessly track and monitor language learning model (LLM) usage data and metrics from your Javascript/Typescript code. It seamlessly integrates with major LLM Platforms:

 - ✅ OpenAI
 - ✅ Anthropic
 - ✅ Cohere

All LLM observability usage data is sent directly to the Doku Platform for streamlined tracking. Get started with Doku Node SDK for simplified and effective observability.

## Features

- **User-friendly UI Logs:** Log all your LLM requests in just two lines of code.

- **Cost and Latency Tracking:** Track costs and latencies based on users and custom properties for better analysis.

- **Prompt and Response Feedback:** Iterate on prompts and chat conversations directly in the UI.

- **Collaboration and Sharing:** Share results and collaborate with friends or teammates for more effective teamwork.

- **Very Low Latency Impact** We know latency of your Large-Language Model usage is important to your application's success, that's why we designed Doku SDKs to impact latency as little as possible.

## Installation

```bash
npm install dokumetry
```

## Quick Start ⚡️

### OpenAI

```
import OpenAI from 'openai';
import DokuMetry from 'dokumetry';

const openai = new OpenAI({
  apiKey: 'My API Key', // defaults to process.env["OPENAI_API_KEY"]
});

// Pass the above `openai` object along with your DOKU URL and API key and this will make sure that all OpenAI calls are automatically tracked.
DokuMetry.init({llm: openai, dokuURL: "YOUR_DOKU_URL", apiKey: "YOUR_DOKU_TOKEN"})

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'What are the key to effective observability?' }],
    model: 'gpt-3.5-turbo',
  });
}

main();
```

### Anthropic

```
import Anthropic from '@anthropic-ai/sdk';
import DokuMetry from 'dokumetry';

const anthropic = new Anthropic({
  apiKey: 'my api key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

// Pass the above `anthropic` object along with your DOKU URL and API key and this will make sure that all Anthropic calls are automatically tracked.
DokuMetry.init({llm: anthropic, dokuURL: "YOUR_DOKU_URL", apiKey: "YOUR_DOKU_TOKEN"})

async function main() {
  const completion = await anthropic.completions.create({
    model: 'claude-2',
    max_tokens_to_sample: 300,
    prompt: `${Anthropic.HUMAN_PROMPT} how does a court case get to the Supreme Court?${Anthropic.AI_PROMPT}`,
  });
}

main();
```

### Cohere

```
import { CohereClient } from "cohere-ai";
import DokuMetry from 'dokumetry';

const cohere = new CohereClient({
    apiKey: "YOUR_API_KEY",
});

// Pass the above `cohere` object along with your DOKU URL and API key and this will make sure that all Cohere calls are automatically tracked.
DokuMetry.init({llm: cohere, dokuURL: "YOUR_DOKU_URL", apiKey: "YOUR_DOKU_TOKEN"})

(async () => {
    const prediction = await cohere.generate({
        prompt: "hello",
        maxTokens: 10,
    });
    
    console.log("Received prediction", prediction);
})();
```

## Supported Parameters

| Parameter         | Description                                               | Required      |
|-------------------|-----------------------------------------------------------|---------------|
| llm               | Language Learning Model (LLM) Object to track             | Yes           |
| dokuURL           | URL of your Doku Instance                                 | Yes           |
| apiKey            | Your Doku API key                                         | Yes           |
| environment       | Custom environment tag to include in your metrics         | Optional      |
| applicationName   | Custom application name tag for your metrics              | Optional      |
| skipResp          | Skip response from the Doku Ingester for faster execution | Optional      |


## Semantic Versioning
This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

Changes that only affect static types, without breaking runtime behavior.
Changes to library internals which are technically public but not intended or documented for external use. (Please open a GitHub issue to let us know if you are relying on such internals).
Changes that we do not expect to impact the vast majority of users in practice.
We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.


## Requirements
TypeScript >= 4.5 is supported.

The following runtimes are supported:

- Node.js 18 LTS or later (non-EOL) versions.
- Deno v1.28.0 or higher, 
- using import Anthropic from -"npm:@anthropic-ai/tokenizer".
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the "node" environment ("jsdom" is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Security

Doku NPM Package (`dokumetry`) sends the observability data over HTTP/HTTPS to the Doku Ingester which uses key based authentication mechanism to ensure the security of your data. Be sure to keep your API keys confidential and manage permissions diligently. Refer to our [Security Policy](SECURITY)

## Contributing

We welcome contributions to the Doku NPM Package (`dokumetry`) project. Please refer to [CONTRIBUTING](CONTRIBUTING) for detailed guidelines on how you can participate.

## License

Doku NPM Package (`dokumetry`) is available under the [GPL-3.0](LICENSE).

## Support

For support, issues, or feature requests, submit an issue through the [GitHub issues](https://github.com/dokulabs/dokumetry-node/issues) associated with this repository.
