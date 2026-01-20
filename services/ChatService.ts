import { ChatOpenAI } from "@langchain/openai";

export const getLlmChat = (url: string, apiKey: string, model: string) => {
  return new ChatOpenAI({
    configuration: {
      baseURL: url,
      apiKey: apiKey,
    },
    model: model,
  });
};
