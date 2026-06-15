import { GiftedChat, IMessage } from "react-native-gifted-chat";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Chat, Message } from "@/models/Chat";
import { Bot } from "@/models/Bot";
import ChatInputToolbar from "./ChatInputToolbar";
import { useBot } from "@/hooks/useBot";
import { useAlert } from "@/hooks/useAlert";
import { useDataProvider } from "@/hooks/useDataProvider";
import * as Crypto from "expo-crypto";

type ChatInterfaceProps = {
  currentBot: Bot | null;
  initialMessages?: Message[];
};

const ChatInterface = ({ currentBot, initialMessages }: ChatInterfaceProps) => {
  const [messages, setMessages] = React.useState<Message[]>(
    initialMessages ?? [],
  );
  const chatIdRef = React.useRef<string>(Crypto.randomUUID());

  const alert = useAlert();
  const bot = useBot();
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    } else if (currentBot !== null && messages.length === 0) {
      const greeting: Message = {
        role: "assistant",
        content: "Hello! How can I help you today?",
      };
      setMessages([greeting]);
    }
  }, [currentBot?.id]);

  const saveChat = async (msgs: Message[]) => {
    if (!currentBot) return;
    const firstUserMsg = msgs.find((m) => m.role === "user");
    const chat: Chat = {
      id: chatIdRef.current,
      messages: msgs,
      name: firstUserMsg
        ? firstUserMsg.content.slice(0, 60)
        : `Chat with ${currentBot.name}`,
      botName: currentBot.name,
      botId: currentBot.id,
      botType: currentBot.botType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dataProvider.saveChat(chat);
  };

  const handleSend = async (newMessages: IMessage[]) => {
    const chatMessages = bot.chatIMessagesToLangMessages(newMessages);
    const updatedMessages = [...chatMessages, ...messages];
    setMessages(updatedMessages);

    const response = await bot.talk2Bot(currentBot!, updatedMessages);
    if (!response) {
      alert.showErrorAlert("Failed to get response from bot");
      return;
    }

    const responseMessage: Message = {
      role: "assistant",
      content: response,
    };
    const finalMessages = [responseMessage, ...updatedMessages];
    setMessages(finalMessages);
    await saveChat(finalMessages);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <GiftedChat
        messages={bot.langMessagesToChatIMessages(messages)}
        onSend={handleSend}
        user={{ _id: 1 }}
        renderInputToolbar={(props) => (
          <ChatInputToolbar toolBarProps={props} disabled={currentBot === null} />
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatInterface;
