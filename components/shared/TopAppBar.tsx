import { Appbar } from "react-native-paper";
import React from "react";

interface TopAppBarProps {
  backAction?: () => void;
  leftComponent?: React.ReactNode;
  title?: string;
  rightAction?: () => void;
  rightIcon?: string;
}

const TopAppBar = ({
  backAction,
  title,
  rightAction,
  rightIcon,
  leftComponent,
}: TopAppBarProps) => {
  return (
    <Appbar.Header mode="small">
      {backAction && <Appbar.BackAction onPress={backAction} />}
      {leftComponent ? (
        <Appbar.Content title={leftComponent} />
      ) : (
        <Appbar.Content title={title ?? " "} />
      )}
      {(rightAction || rightIcon) && (
        <Appbar.Action
          icon={rightIcon ?? "dots-vertical"}
          onPress={rightAction}
        />
      )}
    </Appbar.Header>
  );
};

export default TopAppBar;
