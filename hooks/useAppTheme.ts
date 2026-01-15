import { useTheme } from "react-native-paper";
import { AppTheme } from "@/services/ThemeService";
export const useAppTheme = () => useTheme<AppTheme>();
