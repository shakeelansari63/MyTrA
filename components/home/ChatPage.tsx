import SafeScrollView from "@/components/shared/SafeScrollView";
import React from "react";
import BotSelector from "./BotSelector";
import ChatInterface from "./ChatInterface";
import { Bot } from "@/models/Bot";

const ChatPage = () => {
  const [currentBot, setCurrentBot] = React.useState<Bot | null>(null);

  return (
    <SafeScrollView extraXPadding={true} unsafeTop={true}>
      <BotSelector currentBot={currentBot} setCurrentBot={setCurrentBot} />
      <ChatInterface currentBot={currentBot} />
    </SafeScrollView>
  );
};

export default ChatPage;
