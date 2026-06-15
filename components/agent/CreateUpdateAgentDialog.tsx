import { Button, Card, List } from "react-native-paper";
import Dropdown, { type Option } from "@/components/shared/Dropdown";
import { Agent } from "@/models/Agent";
import { LLMDetail } from "@/models/LLMDetail";
import { MCPServer } from "@/models/MCPServer";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Dialog from "@/components/shared/Dialog";
import React from "react";
import DialogTextInput from "@/components/shared/DialogTextInput";
import { useDataProvider } from "@/hooks/useDataProvider";
import { AlertContextModel } from "@/models/AlertContext";
import { AlertContext } from "@/context/Alert";
import * as Crypto from "expo-crypto";

type Props = {
  agent: Agent | null;
  ref: React.RefObject<BottomSheetModal | null>;
  onSaved: () => void;
};

const CreateUpdateAgentDialog = ({ agent, ref, onSaved }: Props) => {
  const [agentDetail, setAgentDetail] = React.useState<Agent>({
    id: "",
    name: "",
    llm: "",
    mcpServers: [],
    role: "",
    taskDetail: "",
  });

  const [llms, setLlms] = React.useState<LLMDetail[]>([]);
  const [mcps, setMcps] = React.useState<MCPServer[]>([]);

  const nameRef = React.useRef("");
  const roleRef = React.useRef("");
  const taskRef = React.useRef("");

  const dataProvider = useDataProvider();
  const alert = React.useContext<AlertContextModel>(AlertContext);

  React.useEffect(() => {
    if (agent?.id) {
      setAgentDetail(agent);
      nameRef.current = agent.name;
      roleRef.current = agent.role;
      taskRef.current = agent.taskDetail;
    } else {
      const id = Crypto.randomUUID();
      setAgentDetail({
        id,
        name: "",
        llm: "",
        mcpServers: [],
        role: "",
        taskDetail: "",
      });
      nameRef.current = "";
      roleRef.current = "";
      taskRef.current = "";
    }
  }, [agent]);

  React.useEffect(() => {
    const loadOptions = async () => {
      const savedLlms = await dataProvider.getAllLLMs();
      setLlms(savedLlms);
      const savedMcps = await dataProvider.getAllMCPs();
      setMcps(savedMcps);
    };
    loadOptions();
  }, []);

  const llmOptions: Option[] = llms.map((l) => ({
    name: l.name,
    value: l.id,
  }));

  const selectedLlmName = llms.find((l) => l.id === agentDetail.llm)?.name;

  const syncName = () =>
    setAgentDetail((prev) => ({ ...prev, name: nameRef.current }));
  const syncRole = () =>
    setAgentDetail((prev) => ({ ...prev, role: roleRef.current }));
  const syncTask = () =>
    setAgentDetail((prev) => ({ ...prev, taskDetail: taskRef.current }));

  const toggleMcp = (mcpId: string) => {
    const selected = agentDetail.mcpServers;
    if (selected.includes(mcpId)) {
      setAgentDetail({
        ...agentDetail,
        mcpServers: selected.filter((id) => id !== mcpId),
      });
    } else {
      setAgentDetail({
        ...agentDetail,
        mcpServers: [...selected, mcpId],
      });
    }
  };

  const onCancel = () => {
    ref.current?.dismiss();
    const id = Crypto.randomUUID();
    setAgentDetail({ id, name: "", llm: "", mcpServers: [], role: "", taskDetail: "" });
    nameRef.current = "";
    roleRef.current = "";
    taskRef.current = "";
  };

  const onSave = async () => {
    const current: Agent = {
      id: agentDetail.id,
      name: nameRef.current || agentDetail.name,
      llm: agentDetail.llm,
      mcpServers: agentDetail.mcpServers,
      role: roleRef.current || agentDetail.role,
      taskDetail: taskRef.current || agentDetail.taskDetail,
    };

    if (!current.name || !current.llm) {
      alert.showErrorAlert("Name and LLM are required");
      return;
    }

    await dataProvider.saveAgent(current);
    onSaved();
    onCancel();
  };

  return (
    <Dialog
      ref={ref}
      title={agent ? `Update ${agent.name}` : "Create Agent"}
    >
      <Card.Content>
        <DialogTextInput
          label="Agent Name"
          placeholder="Agent Name"
          defaultValue={agentDetail.name}
          onChangeText={(t) => {
            nameRef.current = t;
          }}
          onBlur={syncName}
          mode="outlined"
        />
        <Dropdown
          options={llmOptions}
          label="LLM"
          onSelect={(text) => {
            setAgentDetail((prev) => ({ ...prev, llm: text }));
          }}
          value={selectedLlmName || undefined}
          mode="outlined"
          placeholder="Select LLM"
          style={{ marginBottom: 10 }}
        />
        <DialogTextInput
          label="Role"
          placeholder="e.g. Senior Software Engineer"
          defaultValue={agentDetail.role}
          onChangeText={(t) => {
            roleRef.current = t;
          }}
          onBlur={syncRole}
          mode="outlined"
        />
        <DialogTextInput
          label="Task Detail"
          placeholder="Specific instructions for this agent"
          defaultValue={agentDetail.taskDetail}
          onChangeText={(t) => {
            taskRef.current = t;
          }}
          onBlur={syncTask}
          mode="outlined"
          multiline
          numberOfLines={3}
        />
        {mcps.length > 0 && (
          <>
            <List.Subheader style={{ paddingLeft: 0 }}>
              MCP Servers
            </List.Subheader>
            {mcps.map((mcp) => {
              const isSelected = agentDetail.mcpServers.includes(mcp.id);
              return (
                <List.Item
                  key={mcp.id}
                  title={mcp.name}
                  description={mcp.url}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={
                        isSelected
                          ? "checkbox-marked"
                          : "checkbox-blank-outline"
                      }
                    />
                  )}
                  onPress={() => toggleMcp(mcp.id)}
                />
              );
            })}
          </>
        )}
      </Card.Content>
      <Card.Actions>
        <Button onPress={onCancel}>Cancel</Button>
        <Button onPress={onSave}>Save</Button>
      </Card.Actions>
    </Dialog>
  );
};

export default CreateUpdateAgentDialog;
