import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  icon: string;
  action: () => void;
};

const BottomFab = ({ icon, action }: Props) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <FAB
      icon={icon}
      onPress={action}
      style={{
        position: "absolute",
        margin: 16,
        bottom: safeAreaInsets.bottom,
        right: 0,
      }}
    />
  );
};

export default BottomFab;
