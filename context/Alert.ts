import { AlertContextModel } from "@/models/AlertContext";
import { createContext } from "react";

export const AlertContext = createContext<AlertContextModel>({
  visible: false,
  message: "",
  alertType: "info",
  showInfoAlert: (message: string) => {},
  showWarnAlert: (message: string) => {},
  showErrorAlert: (message: string) => {},
  hideAlert: () => {},
});
