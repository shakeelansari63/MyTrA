import TopAppBar from "@/components/shared/TopAppBar";
import TitleWithIcon from "@/components/shared/TitleWithIcon";
import { useDrawer } from "@/hooks/useDrawer";
import AgentSetupPage from "@/components/agent/AgentSetupPage";

const AgentsPageWrapper = () => {
  const { toggleDrawer } = useDrawer();
  return (
    <>
      <TopAppBar
        leftComponent={<TitleWithIcon title="Agents" showIcon={true} />}
        onTitlePressed={toggleDrawer}
      />
      <AgentSetupPage />
    </>
  );
};

export default AgentsPageWrapper;
