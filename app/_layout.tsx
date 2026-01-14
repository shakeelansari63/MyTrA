import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { themes } from "@/services/ThemeService";
import { PaperProvider, Portal } from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaperStyledDrawer, {
  type DrawerItemInfo,
} from "@/components/shared/PaperStyledDrawer";

const DrawerApp = () => {
  const drawerItems: DrawerItemInfo[] = [
    {
      key: "index",
      label: "Home",
      icon: "robot-happy",
      headerTitle: "MyTrA",
      showHeaderIcon: true,
    },
    {
      key: "settings",
      label: "Setup",
      icon: "wrench-cog",
      headerTitle: "Setup",
      showHeaderIcon: false,
    },
  ];
  return <PaperStyledDrawer drawerItems={drawerItems} />;
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
              <DrawerApp />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </Portal.Host>
      </ThemeProvider>
    </PaperProvider>
  );
}
