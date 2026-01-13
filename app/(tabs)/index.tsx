import { View } from "react-native";
import { Text } from "react-native-paper";
import TopAppBar from "@/components/shared/TopAppBar";

const HomePage = () => {
  return (
    <>
      <TopAppBar title="MyTrA" />
      <View>
        <Text>HomePage</Text>
      </View>
    </>
  );
};

export default HomePage;
