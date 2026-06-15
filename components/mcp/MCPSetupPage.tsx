import { Card, Text, IconButton, Chip, Button, List } from "react-native-paper";
import SafeScrollView from "@/components/shared/SafeScrollView";
import { useDataProvider } from "@/hooks/useDataProvider";
import { useMCP, type MCPTool } from "@/hooks/useMCP";
import { MCPServer } from "@/models/MCPServer";
import React from "react";
import { FlatList, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CreateUpdateMCPDialog from "./CreateUpdateMCPDialog";
import BottomFab from "../shared/BottomFab";
import Dialog from "../shared/Dialog";

const ToolsDialog = ({
  tools,
  mcpName,
  ref,
}: {
  tools: MCPTool[];
  mcpName: string;
  ref: React.RefObject<BottomSheetModal | null>;
}) => (
  <Dialog ref={ref} title={`${mcpName} — Tools`}>
    <Card.Content>
      {tools.length === 0 ? (
        <Text variant="bodyMedium">No tools found.</Text>
      ) : (
        tools.map((tool) => (
          <List.Item
            key={tool.name}
            title={tool.name}
            description={tool.description}
            left={(props) => <List.Icon {...props} icon="toolbox" />}
          />
        ))
      )}
    </Card.Content>
    <Card.Actions>
      <Button onPress={() => ref.current?.dismiss()}>Close</Button>
    </Card.Actions>
  </Dialog>
);

type MCPCardProps = {
  mcp: MCPServer;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onListTools: (id: string) => void;
};

const MCPCard = ({ mcp, onEdit, onDelete, onListTools }: MCPCardProps) => (
  <Card style={{ marginBottom: 12 }}>
    <Card.Title
      title={mcp.name}
      subtitle={mcp.url}
      left={(props) => <IconButton {...props} icon="server" />}
      right={(props) => (
        <>
          <IconButton
            {...props}
            icon="pencil"
            onPress={() => onEdit(mcp.id)}
          />
          <IconButton
            {...props}
            icon="delete"
            onPress={() => onDelete(mcp.id)}
          />
        </>
      )}
    />
    <Card.Content>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Chip icon="swap-horizontal">{mcp.transport}</Chip>
        <Chip icon="toolbox" onPress={() => onListTools(mcp.id)}>
          List Tools
        </Chip>
      </View>
    </Card.Content>
  </Card>
);

const MCPSetupPage = () => {
  const [mcps, setMcps] = React.useState<MCPServer[]>([]);
  const [selectedMCP, setSelectedMCP] = React.useState<MCPServer | null>(null);
  const [tools, setTools] = React.useState<MCPTool[]>([]);
  const [toolsMcpName, setToolsMcpName] = React.useState("");
  const editRef = React.useRef<BottomSheetModal>(null);
  const toolsRef = React.useRef<BottomSheetModal>(null);

  const dataProvider = useDataProvider();
  const mcpHelper = useMCP();

  const loadMCPs = async () => {
    const mcpList = await dataProvider.getAllMCPs();
    setMcps(mcpList);
  };

  const createNewMCP = () => {
    setSelectedMCP(null);
    editRef.current?.present();
  };

  const updateMCP = (id: string) => {
    setSelectedMCP(mcps.find((m) => m.id === id)!);
    editRef.current?.present();
  };

  const deleteMCP = async (id: string) => {
    await dataProvider.deleteMCP(id);
    loadMCPs();
  };

  const listTools = async (id: string) => {
    const mcp = mcps.find((m) => m.id === id);
    if (!mcp) return;
    setToolsMcpName(mcp.name);
    setTools([]);
    toolsRef.current?.present();
    const result = await mcpHelper.listTools(mcp);
    setTools(result.tools);
  };

  React.useEffect(() => {
    loadMCPs();
  }, []);

  return (
    <>
      <SafeScrollView extraXPadding={true} unsafeTop={true}>
        {mcps.length === 0 ? (
          <Text
            variant="bodyLarge"
            style={{ textAlign: "center", marginTop: 32 }}
          >
            No MCP Servers configured yet.
          </Text>
        ) : (
          <FlatList
            data={mcps}
            keyExtractor={(item) => item.id}
            renderItem={(mcp) => (
              <MCPCard
                mcp={mcp.item}
                onEdit={updateMCP}
                onDelete={deleteMCP}
                onListTools={listTools}
              />
            )}
          />
        )}
      </SafeScrollView>
      <CreateUpdateMCPDialog
        mcp={selectedMCP}
        ref={editRef}
        onSaved={loadMCPs}
      />
      <ToolsDialog
        tools={tools}
        mcpName={toolsMcpName}
        ref={toolsRef}
      />
      <BottomFab icon="plus" action={createNewMCP} />
    </>
  );
};

export default MCPSetupPage;
