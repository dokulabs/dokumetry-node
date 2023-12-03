# Doku Node SDK

An NPM Package designed for tracking and monitoring Language Learning Model (LLM) usage, providing comprehensive observability features for 
 - [] OpenAI
 - [] Anthropic
 - [] Cohere

## Features

- **User-friendly UI Logs:** Log all your LLM requests in just two lines of code.

- **Cost and Latency Tracking:** Track costs and latencies based on users and custom properties for better analysis.

- **Prompt and Response Feedback:** Iterate on prompts and chat conversations directly in the UI.

- **Collaboration and Sharing:** Share results and collaborate with friends or teammates for more effective teamwork.

- **Very Low Latency Impact** We know latency of your Large-Language Model usage is important to your application's success, that's why we designed Doku SDKs to impact latency as little as possible.

## Installation

```bash
npm install dokulabs
```

## Quick Use

### OpenAI

```
import OpenAI from 'openai';
import 'dokulabs';

const openai = new OpenAI({
  apiKey: 'My API Key', // defaults to process.env["OPENAI_API_KEY"]
});

// Pass the above `openai` object along with your DOKU URL and Token and this will make sure that all OpenAI calls are automatically tracked.
dokulabs.init(openai, {dokuURL: "YOUR_DOKU_URL", token: "YOUR_DOKU_TOKEN"})

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
import 'dokulabs';

const anthropic = new Anthropic({
  apiKey: 'my api key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

// Pass the above `anthropic` object along with your DOKU URL and Token and this will make sure that all Anthropic calls are automatically tracked.
dokulabs.init(anthropic, {dokuURL: "YOUR_DOKU_URL", token: "YOUR_DOKU_TOKEN"})

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
import 'dokulabs';

const cohere = new CohereClient({
    token: "YOUR_API_KEY",
});

// Pass the above `cohere` object along with your DOKU URL and Token and this will make sure that all Cohere calls are automatically tracked.
dokulabs.init(cohere, {dokuURL: "YOUR_DOKU_URL", token: "YOUR_DOKU_TOKEN"})

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
| func              | Language Learning Model (LLM) Object to track             | Yes           |
| dokuURL           | URL of your Doku Instance                                 | Yes           |
| token             | Your Doku Token                                           | Yes           |
| environment       | Custom environment tag to include in your metrics         | Optional      |
| applicationName   | Custom application name tag for your metrics              | Optional      |
| skipResp          | Skip response from the Doku Ingester for faster execution | Optional      |


## Semantic Versioning
This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

Changes that only affect static types, without breaking runtime behavior.
Changes to library internals which are technically public but not intended or documented for external use. (Please open a GitHub issue to let us know if you are relying on such internals).
Changes that we do not expect to impact the vast majority of users in practice.
We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

We are keen for your feedback; please open an [issue](https://www.github.com/dokulabs/node-sdk/issues) with questions, bugs, or suggestions.

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

## Contributing
We welcome contributors for documentation, integrations, and feature requests. Share your ideas or open an issue on GitHub to engage with the community.

## License
Doku's Node SDK is licensed under the GPL-3.0 license. Your feedback and contributions are valued; let's build a better observability experience together!
