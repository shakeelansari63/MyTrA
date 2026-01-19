import { SnackbarContextModel } from "@/models/SnackbarContext";
import React from "react";

export const useSnackbar = (): SnackbarContextModel => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const showSnackbar = (message: string) => {
    setMessage(message);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  const hideSnackbar = () => {
    setVisible(false);
  };

  return { visible, message, showSnackbar, hideSnackbar };
};
