import { View } from "react-native";
import { Text } from "react-native-paper";
import TopAppBar from "@/components/shared/TopAppBar";

const SettingsPage = () => {
  return (
    <>
      <TopAppBar title="Settings" />
      <View>
        <Text>SettingsPage</Text>
      </View>
    </>
  );
};

export default SettingsPage;
