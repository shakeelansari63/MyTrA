import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  unsafeTop?: boolean;
  unsafeBottom?: boolean;
  unsafeLeft?: boolean;
  unsafeRight?: boolean;
  extraXPadding?: boolean;
  scrollable?: boolean;
  children: React.ReactNode;
};

const SafeScrollView = ({
  unsafeTop,
  unsafeBottom,
  unsafeLeft,
  unsafeRight,
  extraXPadding,
  scrollable,
  children,
}: Props) => {
  const safeAreaInsets = useSafeAreaInsets();

  // Select Component
  const ViewComponent = scrollable ? ScrollView : View;

  return (
    <ViewComponent
      style={{
        marginTop: unsafeTop ? 0 : safeAreaInsets.top,
        marginBottom: unsafeBottom ? 0 : safeAreaInsets.bottom,
        marginLeft: unsafeLeft
          ? 0
          : extraXPadding
            ? safeAreaInsets.left + 16
            : safeAreaInsets.left,
        marginRight: unsafeRight
          ? 0
          : extraXPadding
            ? safeAreaInsets.right + 16
            : safeAreaInsets.right,
      }}
    >
      {children}
    </ViewComponent>
  );
};

export default SafeScrollView;
