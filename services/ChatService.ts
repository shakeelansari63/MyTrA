import { ChatOpenAI } from "@langchain/openai";
import { Providers } from "@/constants/Providers";
import { LLMDetail } from "@/models/LLMDetail";

export const getProviderUrl = (llm: LLMDetail): string | null => {
  // Try to get Provider URL from Providers list
  const foundProvider = Providers.find((p) => p.name === llm.provider);

  // If provider is not found, check if URL is provided in llm object
  if (!foundProvider && !llm.url) return null;

  // return provider URL or URL from llm object
  let finalUrl = foundProvider?.url || llm.url;
  if (finalUrl.endsWith("/")) {
    finalUrl = finalUrl.slice(0, -1);
  }
  return finalUrl;
};

export const getLlmChat = (llm: LLMDetail) => {
  const providerUrl = getProviderUrl(llm);

  // Return LLM Chat Instance
  return new ChatOpenAI({
    configuration: {
      baseURL: providerUrl,
      apiKey: llm.key,
    },
    model: llm.model,
  });
};
