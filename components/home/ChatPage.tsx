import { Text } from "react-native-paper";
import SafeScrollView from "@/components/shared/SafeScrollView";

const ChatPage = () => {
  return (
    <SafeScrollView extraXPadding={true} unsafeTop={true}>
      <Text>ChatPage</Text>
    </SafeScrollView>
  );
};

export default ChatPage;
