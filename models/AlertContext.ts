export type AlertContextModel = {
  visible: boolean;
  message: string;
  alertType: "info" | "warn" | "error";
  showInfoAlert: (message: string) => void;
  showWarnAlert: (message: string) => void;
  showErrorAlert: (message: string) => void;
  hideAlert: () => void;
};
