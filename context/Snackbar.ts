import { SnackbarContextModel } from "@/models/SnackbarContext";
import { createContext } from "react";

export const SnackbarContext = createContext<SnackbarContextModel>({
  visible: false,
  message: "",
  showSnackbar: (message: string) => {},
  hideSnackbar: () => {},
});
