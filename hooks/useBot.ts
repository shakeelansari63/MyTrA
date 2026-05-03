import { Bot } from "@/models/Bot";
import { useLLM } from "./useLLM";
import { Message } from "@/models/Chat";
import { useDataProvider } from "./useDataProvider";
import { IMessage } from "react-native-gifted-chat";

export const useBot = () => {
  const llm = useLLM();
  const dataProvider = useDataProvider();

  const talk2Bot = async (bot: Bot, messages: Message[]) => {
    if (bot.botType === "llm") {
      const llmDetail = await dataProvider.getLLMById(bot.id);
      if (llmDetail === null) return;

      return await llm.llmChatResponse(llmDetail, messages);
    }
  };

  const langMessagesToChatIMessages = (messages: Message[]): IMessage[] => {
    return messages.map((message, idx) => ({
      _id: idx,
      text: message.content,
      createdAt: new Date(),
      user: {
        _id: message.role === "user" ? 1 : 0,
        name: message.role === "user" ? "User" : "Assistant",
      },
    }));
  };

  const chatIMessagesToLangMessages = (messages: IMessage[]): Message[] => {
    return messages.map((message) => ({
      role: message.user._id === 1 ? "user" : "assistant",
      content: message.text,
    }));
  };

  return {
    talk2Bot,
    langMessagesToChatIMessages,
    chatIMessagesToLangMessages,
  };
};
