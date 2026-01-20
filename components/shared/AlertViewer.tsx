import { Snackbar, Portal, Text, Icon } from "react-native-paper";
import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";
import Row from "./Row";
type Props = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  alertType: "info" | "warn" | "error";
};

const AlertViewer = ({ visible, onDismiss, alertType, message }: Props) => {
  const theme = useAppTheme();

  const alertTextColor =
    alertType === "info"
      ? theme.colors.onSuccess
      : alertType === "warn"
        ? theme.colors.inversePrimary
        : theme.colors.errorContainer;

  const alertIcon =
    alertType === "info"
      ? "information"
      : alertType === "warn"
        ? "alert-rhombus"
        : "alert-circle";

  return (
    <Portal>
      <Snackbar visible={visible} onDismiss={onDismiss}>
        <Row justify="flex-start">
          <Icon source={alertIcon} size={24} color={alertTextColor} />
          <Text
            style={{
              marginLeft: 8,
              color: alertTextColor,
            }}
          >
            {message}
          </Text>
        </Row>
      </Snackbar>
    </Portal>
  );
};

export default AlertViewer;
