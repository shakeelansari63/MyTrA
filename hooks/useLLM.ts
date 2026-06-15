import { Message } from "@/models/Chat";
import { LLMDetail } from "@/models/LLMDetail";
import { getProviderUrl, llmChat } from "@/services/ChatService";

export const useLLM = () => {
  const testLLM = async (llm: LLMDetail): Promise<boolean> => {
    const llmProviderUrl = getProviderUrl(llm);
    if (!llmProviderUrl) return false;

    try {
      const response = await fetch(`${llmProviderUrl}/models`, {
        headers: { Authorization: `Bearer ${llm.key}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const llmChatResponse = async (
    llm: LLMDetail,
    messages: Message[],
  ): Promise<string> => {
    const formatted = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));
    return llmChat(llm, formatted);
  };

  return { testLLM, llmChatResponse };
};
