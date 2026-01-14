import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

const ViewWithXMargin = ({ children }: Props) => {
  return <View style={{ marginHorizontal: 16 }}>{children}</View>;
};

export default ViewWithXMargin;
