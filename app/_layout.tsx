import { Stack } from "expo-router";
import { TamaguiProvider, createTamagui } from "tamagui";
import { defaultConfig } from "@tamagui/config/v4";
import { themes } from "../theme";

export const config = createTamagui({
  ...defaultConfig,
  themes,
});

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack />
    </TamaguiProvider>
  );
}
