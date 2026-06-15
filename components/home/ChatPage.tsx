import SafeScrollView from "@/components/shared/SafeScrollView";
import React from "react";
import { View } from "react-native";
import BotSelector from "./BotSelector";
import ChatInterface from "./ChatInterface";
import { Bot } from "@/models/Bot";
import { Message } from "@/models/Chat";
import { useDataProvider } from "@/hooks/useDataProvider";

const ChatPage = () => {
  const [currentBot, setCurrentBot] = React.useState<Bot | null>(null);
  const [initialMessages, setInitialMessages] = React.useState<
    Message[] | undefined
  >(undefined);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    const checkRestore = async () => {
      const restoreChatId = await dataProvider.getRestoreChatId();
      if (restoreChatId) {
        const chat = await dataProvider.getChatById(restoreChatId);
        if (chat) {
          setInitialMessages(chat.messages);
          setCurrentBot({
            botType: chat.botType,
            id: chat.botId,
            name: chat.botName,
          });
        }
        await dataProvider.clearRestoreChatId();
      }
    };
    checkRestore();
  }, []);

  return (
    <SafeScrollView extraXPadding={true} unsafeTop={true}>
      <BotSelector currentBot={currentBot} setCurrentBot={setCurrentBot} />
      <View style={{ flex: 1 }}>
        <ChatInterface
          currentBot={currentBot}
          initialMessages={initialMessages}
        />
      </View>
    </SafeScrollView>
  );
};

export default ChatPage;
