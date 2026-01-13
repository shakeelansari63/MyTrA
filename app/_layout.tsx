import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { themes } from "@/services/ThemeService";
import { PaperProvider, Portal } from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const StackApp = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default function App() {
  const colorScheme = useColorScheme();
  const paperTheme =
    colorScheme === "dark" ? themes.darkTheme : themes.lightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <Portal.Host>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <StackApp />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </Portal.Host>
      </ThemeProvider>
    </PaperProvider>
  );
}
