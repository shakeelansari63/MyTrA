import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { themes } from "@/services/ThemeService";
import { PaperProvider, Portal } from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaperStyledDrawer, {
  type DrawerItemInfo,
  type DrawerItemsInSections,
} from "@/components/shared/PaperStyledDrawer";
import { useRouter } from "expo-router";
import React from "react";
import { useAlert } from "@/hooks/useAlert";
import { AlertContext } from "@/context/Alert";
import AlertViewer from "@/components/shared/AlertViewer";

const DrawerApp = () => {
  const router = useRouter();

  const rootItems: DrawerItemInfo[] = [
    {
      key: "index",
      label: "Home",
      icon: "home-assistant",
      onPress: () => router.navigate("/"),
    },
    {
      key: "history",
      label: "Past Chats",
      icon: "history",
      onPress: () => router.navigate("/history"),
    },
  ];

  const settingSectionItems: DrawerItemInfo[] = [
    {
      key: "llms",
      label: "LLMs",
      icon: "chat-processing-outline",
      onPress: () => router.navigate("/llms"),
    },
    {
      key: "mcps",
      label: "MCP Servers",
      icon: "server-network-outline",
      onPress: () => router.navigate("/mcps"),
    },
    {
      key: "agents",
      label: "Agents",
      icon: "robot-excited-outline",
      onPress: () => router.navigate("/agents"),
    },
  ];

  const drawerItems: DrawerItemsInSections = {
    root: rootItems,
    sections: [
      {
        title: "Setup",
        items: settingSectionItems,
      },
    ],
  };

  return <PaperStyledDrawer drawerItems={drawerItems} />;
};

export default function App() {
  const alert = useAlert();
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? themes.darkTheme : themes.lightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <Portal.Host>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <AlertViewer
                visible={alert.visible}
                message={alert.message}
                alertType={alert.alertType}
                onDismiss={() => alert.hideAlert()}
              />
              <AlertContext.Provider value={alert}>
                <DrawerApp />
              </AlertContext.Provider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </Portal.Host>
      </ThemeProvider>
    </PaperProvider>
  );
}
