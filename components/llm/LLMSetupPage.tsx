import SafeScrollView from "@/components/shared/SafeScrollView";
import { useDataProvider } from "@/hooks/useDataProvider";
import { LLMDetail } from "@/models/LLMDetail";
import React from "react";
import { FlatList } from "react-native";
import LLMCard from "./LLMCard";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CreateUpdateLLMDialog from "./CreateUpdateLLMDialog";
import BottomFab from "../shared/BottomFab";

const LLMSetupPage = () => {
  const [llms, setLLMs] = React.useState<LLMDetail[]>([]);
  const [selectedLLM, setSelectedLLM] = React.useState<LLMDetail | null>(null);
  const editRef = React.useRef<BottomSheetModal>(null);

  // Hooks
  const dataProvider = useDataProvider();

  const loadLLMs = async () => {
    const llms = await dataProvider.getAllLLMs();
    setLLMs(llms);
  };

  const createNewLLM = () => {
    setSelectedLLM(null);
    editRef.current?.present();
  };

  const updateLLM = (id: string) => {
    setSelectedLLM(llms.find((llm) => llm.id === id)!);
    editRef.current?.present();
  };

  // Load LLM Models on Page Load
  React.useEffect(() => {
    loadLLMs();
  }, []);

  return (
    <>
      <SafeScrollView extraXPadding={true} unsafeTop={true}>
        <FlatList
          data={llms}
          keyExtractor={(item) => item.id}
          renderItem={(llm) => <LLMCard llm={llm.item} />}
        />
      </SafeScrollView>
      <CreateUpdateLLMDialog llm={selectedLLM} ref={editRef} />
      <BottomFab icon="plus" action={createNewLLM} />
    </>
  );
};

export default LLMSetupPage;
