import { useColorScheme } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";

type Props = {
  size?: number;
};

const AppAvatar = ({ size }: Props) => {
  const colorScheme = useColorScheme();
  const iconSrc =
    colorScheme === "dark"
      ? require(`@/assets/images/icon-dark.png`)
      : require(`@/assets/images/icon.png`);

  return (
    <Avatar.Image
      size={size || 48}
      source={iconSrc}
      style={{ backgroundColor: "transparent", marginRight: 5 }}
    />
  );
};

export default AppAvatar;
