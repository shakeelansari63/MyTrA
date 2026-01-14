import { View } from "react-native";
import { Text } from "react-native-paper";
import AppAvatar from "./AppAvatar";

type Props = {
  title: string;
  showIcon: boolean;
};

const TitleWithIcon = ({ title, showIcon }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {showIcon && <AppAvatar />}
      <Text variant="titleLarge">{title}</Text>
    </View>
  );
};

export default TitleWithIcon;
