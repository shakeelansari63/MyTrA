import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  type MD3Theme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import { ThemeColor } from "@/constants/Colors";

// Change Material Dark Theme Primary Color
const MaterialDarkTheme = {
  ...MD3DarkTheme,
  colors: { ...ThemeColor.darkColors.colors },
};

// Change Material Light Theme Primary Color
const MaterialLightTheme = {
  ...MD3LightTheme,
  colors: { ...ThemeColor.lightColors.colors },
};

// Generate Light and Dark themes from Expo Router Navigation
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: MaterialLightTheme,
  materialDark: MaterialDarkTheme,
});

// Generate Combined Themes for Dark and Light
const PaperLight = merge(LightTheme, MaterialLightTheme);
const PaperDark = merge(DarkTheme, MaterialDarkTheme);

// Return Light and Dark themes in List
export const themes = { lightTheme: PaperLight, darkTheme: PaperDark };

// Type definition of Theme
export type AppTheme = typeof PaperLight;
