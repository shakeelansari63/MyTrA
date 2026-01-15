import { View, useWindowDimensions } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import React, { RefObject } from "react";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  ref: RefObject<BottomSheetModal | null>;
};

const Dialog = ({ children, ref }: Props) => {
  const theme = useAppTheme();
  const { height } = useWindowDimensions();

  const backDrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
    ></BottomSheetBackdrop>
  );

  const BottomPadding = () => <View style={{ padding: 10 }} />;

  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={{
        backgroundColor: theme.colors.elevation.level1,
        opacity: 1,
      }}
      enableDynamicSizing
      maxDynamicContentSize={height * 0.8}
      backdropComponent={backDrop}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onBackground,
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
    >
      <BottomSheetScrollView>
        {children}
        <BottomPadding />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

export default Dialog;
