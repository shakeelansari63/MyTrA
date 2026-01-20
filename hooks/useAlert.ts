import { AlertContextModel } from "@/models/AlertContext";
import React from "react";

export const useAlert = (): AlertContextModel => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState<"info" | "warn" | "error">(
    "info",
  );

  const showInfoAlert = (message: string) => {
    setMessage(message);
    setVisible(true);
    setAlertType("info");
    setTimeout(() => setVisible(false), 2000);
  };

  const showWarnAlert = (message: string) => {
    setMessage(message);
    setVisible(true);
    setAlertType("warn");
    setTimeout(() => setVisible(false), 2000);
  };

  const showErrorAlert = (message: string) => {
    setMessage(message);
    setVisible(true);
    setAlertType("error");
    setTimeout(() => setVisible(false), 2000);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  return {
    visible,
    message,
    alertType,
    showInfoAlert,
    showWarnAlert,
    showErrorAlert,
    hideAlert,
  };
};
