import TopAppBar from "@/components/shared/TopAppBar";
import TitleWithIcon from "@/components/shared/TitleWithIcon";
import { useDrawer } from "@/hooks/useDrawer";
import MCPSetupPage from "@/components/mcp/MCPSetupPage";

const MCPsPageWrapper = () => {
  const { toggleDrawer } = useDrawer();
  return (
    <>
      <TopAppBar
        leftComponent={<TitleWithIcon title="MCP Servers" showIcon={true} />}
        onTitlePressed={toggleDrawer}
      />
      <MCPSetupPage />
    </>
  );
};

export default MCPsPageWrapper;
