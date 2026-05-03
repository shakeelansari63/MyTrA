import { Message } from "@/models/Chat";
import { LLMDetail } from "@/models/LLMDetail";
import { getLlmChat, getProviderUrl } from "@/services/ChatService";
import { IMessage } from "react-native-gifted-chat";

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

  const llmChatResponse = async (
    llm: LLMDetail,
    messages: Message[],
  ): Promise<string> => {
    const llmChat = getLlmChat(llm);
    const response = llmChat.invoke(messages);
    console.log(response);
    return response.content.toString();
  };

  return {
    testLLM,
    llmChatResponse,
  };
};
