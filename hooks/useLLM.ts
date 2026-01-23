import { LLMDetail } from "@/models/LLMDetail";
import { getProviderUrl } from "@/services/ChatService";

export const useLLM = () => {
  const testLLM = async (llm: LLMDetail): Promise<boolean> => {
    const llmProviderUrl = getProviderUrl(llm);

    // Return false if the provider URL is not available
    if (!llmProviderUrl) {
      return false;
    }

    try {
      const response = await fetch(`${llmProviderUrl}/models`, {
        headers: {
          Authorization: `Bearer ${llm.key}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    testLLM,
  };
};
