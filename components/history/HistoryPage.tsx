import { Card, Text, IconButton } from "react-native-paper";
import SafeScrollView from "@/components/shared/SafeScrollView";
import { useDataProvider } from "@/hooks/useDataProvider";
import { Chat } from "@/models/Chat";
import React from "react";
import { FlatList } from "react-native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

const HistoryPage = () => {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const dataProvider = useDataProvider();
  const router = useRouter();

  const loadChats = async () => {
    const chatList = await dataProvider.getAllChats();
    chatList.sort((a, b) => b.updatedAt - a.updatedAt);
    setChats(chatList);
  };

  const deleteChat = async (id: string) => {
    await dataProvider.deleteChat(id);
    loadChats();
  };

  const resumeChat = async (chat: Chat) => {
    await dataProvider.saveRestoreChatId(chat.id);
    router.navigate("/");
  };

  React.useEffect(() => {
    loadChats();
  }, []);

  return (
    <SafeScrollView extraXPadding={true} unsafeTop={true}>
      {chats.length === 0 ? (
        <Text variant="bodyLarge" style={{ textAlign: "center", marginTop: 32 }}>
          No chat history yet.
        </Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 12 }} onPress={() => resumeChat(item)}>
              <Card.Title
                title={item.name}
                subtitle={`${item.botName} · ${dayjs(item.updatedAt).format("MMM D, YYYY h:mm A")}`}
                left={(props) => <IconButton {...props} icon="chat-outline" />}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => deleteChat(item.id)}
                  />
                )}
              />
              <Card.Content>
                <Text variant="bodySmall" numberOfLines={2}>
                  {item.messages.length > 0
                    ? item.messages[item.messages.length - 1].content
                    : "No messages"}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </SafeScrollView>
  );
};

export default HistoryPage;
