import { Card, Text, IconButton, Chip } from "react-native-paper";
import SafeScrollView from "@/components/shared/SafeScrollView";
import { useDataProvider } from "@/hooks/useDataProvider";
import { Agent } from "@/models/Agent";
import React from "react";
import { FlatList } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CreateUpdateAgentDialog from "./CreateUpdateAgentDialog";
import BottomFab from "../shared/BottomFab";

type AgentCardProps = {
  agent: Agent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const AgentCard = ({ agent, onEdit, onDelete }: AgentCardProps) => (
  <Card style={{ marginBottom: 12 }}>
    <Card.Title
      title={agent.name}
      subtitle={agent.role || "No role specified"}
      left={(props) => <IconButton {...props} icon="robot-excited" />}
      right={(props) => (
        <>
          <IconButton
            {...props}
            icon="pencil"
            onPress={() => onEdit(agent.id)}
          />
          <IconButton
            {...props}
            icon="delete"
            onPress={() => onDelete(agent.id)}
          />
        </>
      )}
    />
    <Card.Content>
      <Chip icon="brain" style={{ alignSelf: "flex-start", marginBottom: 4 }}>
        LLM: {agent.llm.slice(0, 8)}...
      </Chip>
      {agent.mcpServers.length > 0 && (
        <Chip icon="server" style={{ alignSelf: "flex-start" }}>
          {agent.mcpServers.length} MCP server(s)
        </Chip>
      )}
    </Card.Content>
  </Card>
);

const AgentSetupPage = () => {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null);
  const editRef = React.useRef<BottomSheetModal>(null);

  const dataProvider = useDataProvider();

  const loadAgents = async () => {
    const agentList = await dataProvider.getAllAgents();
    setAgents(agentList);
  };

  const createNewAgent = () => {
    setSelectedAgent(null);
    editRef.current?.present();
  };

  const updateAgent = (id: string) => {
    setSelectedAgent(agents.find((a) => a.id === id)!);
    editRef.current?.present();
  };

  const deleteAgent = async (id: string) => {
    await dataProvider.deleteAgent(id);
    loadAgents();
  };

  React.useEffect(() => {
    loadAgents();
  }, []);

  return (
    <>
      <SafeScrollView extraXPadding={true} unsafeTop={true}>
        {agents.length === 0 ? (
          <Text variant="bodyLarge" style={{ textAlign: "center", marginTop: 32 }}>
            No Agents configured yet.
          </Text>
        ) : (
          <FlatList
            data={agents}
            keyExtractor={(item) => item.id}
            renderItem={(agent) => (
              <AgentCard
                agent={agent.item}
                onEdit={updateAgent}
                onDelete={deleteAgent}
              />
            )}
          />
        )}
      </SafeScrollView>
      <CreateUpdateAgentDialog
        agent={selectedAgent}
        ref={editRef}
        onSaved={loadAgents}
      />
      <BottomFab icon="plus" action={createNewAgent} />
    </>
  );
};

export default AgentSetupPage;
