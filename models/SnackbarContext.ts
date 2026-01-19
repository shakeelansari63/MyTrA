export type SnackbarContextModel = {
  visible: boolean;
  message: string;
  showSnackbar: (message: string) => void;
  hideSnackbar: () => void;
};
