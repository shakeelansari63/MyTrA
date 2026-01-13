import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafeViewProps = {
  children: React.ReactNode;
};

const SafeView = ({ children }: SafeViewProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        marginTop: insets.top,
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right,
      }}
    >
      {children}
    </View>
  );
};

export default SafeView;
