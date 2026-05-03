import { GiftedChat, IMessage } from "react-native-gifted-chat";
import React from "react";
import { Message } from "@/models/Chat";
import { Bot } from "@/models/Bot";
import ChatInputToolbar from "./ChatInputToolbar";
import { useBot } from "@/hooks/useBot";
import { useAlert } from "@/hooks/useAlert";
import { Text } from "react-native-paper";

type ChatInterfaceProps = {
  currentBot: Bot | null;
};

const ChatInterface = ({ currentBot }: ChatInterfaceProps) => {
  const [messages, setMessages] = React.useState<Message[]>(
    currentBot !== null
      ? [
          {
            role: "assistant",
            content: "Hello! How can I help you today?",
          },
        ]
      : [],
  );

  // Hook for Bot
  const alert = useAlert();
  const bot = useBot();

  const handleSend = async (newMessages: IMessage[]) => {
    const chatMessages = bot.chatIMessagesToLangMessages(newMessages);
    // Send user message on interface
    setMessages([...chatMessages, ...messages]);
    const response = await bot.talk2Bot(currentBot!, chatMessages);

    if (!response) {
      alert.showErrorAlert("Failed to get response from bot");
      return;
    }

    const responseMessage: Message = {
      role: "assistant",
      content: response,
    };
    setMessages([responseMessage, ...chatMessages, ...messages]);
  };

  return (
    <GiftedChat
      messages={bot.langMessagesToChatIMessages(messages)}
      onSend={handleSend}
      user={{ _id: 1 }}
      renderInputToolbar={(props) => (
        <ChatInputToolbar toolBarProps={props} disabled={currentBot === null} />
      )}
      // renderChatEmpty={() => (
      //   <Text variant="displayMedium">Talk to your personal assistant !!!</Text>
      // )}
    />
  );
};

export default ChatInterface;
