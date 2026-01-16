import TopAppBar from "@/components/shared/TopAppBar";
import TitleWithIcon from "@/components/shared/TitleWithIcon";
import { useDrawer } from "@/hooks/useDrawer";
import LLMSetupPage from "@/components/llm/LLMSetupPage";

const LLMsPageWrapper = () => {
  const { toggleDrawer } = useDrawer();
  return (
    <>
      <TopAppBar
        leftComponent={<TitleWithIcon title="LLMs" showIcon={true} />}
        onTitlePressed={toggleDrawer}
      />
      <LLMSetupPage />
    </>
  );
};

export default LLMsPageWrapper;
