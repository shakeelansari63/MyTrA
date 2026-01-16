import { View } from "react-native";
import { Text } from "react-native-paper";
import { LLMDetail } from "@/models/LLMDetail";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Dialog from "@/components/shared/Dialog";

type Props = {
  llm: LLMDetail | null;
  ref: React.RefObject<BottomSheetModal | null>;
};

const CreateUpdateLLMDialog = ({ llm, ref }: Props) => {
  return (
    <Dialog ref={ref}>
      <View>
        <Text>LLMForm</Text>
      </View>
    </Dialog>
  );
};

export default CreateUpdateLLMDialog;
