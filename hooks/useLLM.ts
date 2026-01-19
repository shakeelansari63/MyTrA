import { Providers } from "@/constants/Providers";
import { LLMDetail } from "@/models/LLMDetail";

export const useLLM = () => {
  const getProviderUrl = (llm: LLMDetail): string | null => {
    // Try to get Provider URL from Providers list
    const foundProvider = Providers.find((p) => p.name === llm.provider);

    // If provider is not found, check if URL is provided in llm object
    if (!foundProvider && !llm.url) return null;

    // return provider URL or URL from llm object
    return foundProvider?.url || llm.url;
  };

  const testLLM = async (llm: LLMDetail): Promise<boolean> => {
    // Try to get provider url from Providers list
    let providerUrl = getProviderUrl(llm);

    // If url is not found, return false
    if (!providerUrl) {
      return false;
    }

    // Try to fetch models from provider URL
    try {
      const response = await fetch(`${providerUrl}/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${llm.key}`,
        },
      });

      // Check for valid response
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    testLLM,
  };
};
