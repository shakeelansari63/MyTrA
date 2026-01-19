import { TextInput, TextInputProps } from "react-native-paper";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const DialogTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      {...props}
      style={{ marginBottom: 10 }}
      render={(props) => <BottomSheetTextInput {...props} />}
    />
  );
};

export default DialogTextInput;
