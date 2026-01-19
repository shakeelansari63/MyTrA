import { View } from "react-native";
import React from "react";

type Props = {
  children: React.ReactNode;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-evenly"
    | "space-around";
};

const Row = ({ children, justify }: Props) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: justify || "space-between",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
};

export default Row;
