import { Button, Card, Chip, List, Text } from "react-native-paper";
import Dropdown, { type Option } from "@/components/shared/Dropdown";
import { MCPServer } from "@/models/MCPServer";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Dialog from "@/components/shared/Dialog";
import React from "react";
import DialogTextInput from "@/components/shared/DialogTextInput";
import { useDataProvider } from "@/hooks/useDataProvider";
import { useMCP, type MCPTool } from "@/hooks/useMCP";
import { AlertContextModel } from "@/models/AlertContext";
import { AlertContext } from "@/context/Alert";
import * as Crypto from "expo-crypto";

type Props = {
  mcp: MCPServer | null;
  ref: React.RefObject<BottomSheetModal | null>;
  onSaved: () => void;
};

const TRANSPORT_OPTIONS: Option[] = [
  { name: "Streamable HTTP", value: "http" },
  { name: "SSE", value: "sse" },
];

const CreateUpdateMCPDialog = ({ mcp, ref, onSaved }: Props) => {
  const [mcpDetail, setMcpDetail] = React.useState<MCPServer>({
    id: "",
    name: "",
    url: "",
    key: "",
    transport: "http",
  });

  const [isTested, setIsTested] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [tools, setTools] = React.useState<MCPTool[]>([]);
  const [testError, setTestError] = React.useState<string | null>(null);

  const nameRef = React.useRef("");
  const urlRef = React.useRef("");
  const keyRef = React.useRef("");

  const dataProvider = useDataProvider();
  const mcpHelper = useMCP();
  const alert = React.useContext<AlertContextModel>(AlertContext);

  React.useEffect(() => {
    if (mcp?.id) {
      setMcpDetail(mcp);
      nameRef.current = mcp.name;
      urlRef.current = mcp.url;
      keyRef.current = mcp.key;
    } else {
      const id = Crypto.randomUUID();
      setMcpDetail({ id, name: "", url: "", key: "", transport: "http" });
      nameRef.current = "";
      urlRef.current = "";
      keyRef.current = "";
    }
    setIsTested(false);
    setTools([]);
    setTestError(null);
  }, [mcp]);

  const onCancel = () => {
    ref.current?.dismiss();
    const id = Crypto.randomUUID();
    setMcpDetail({ id, name: "", url: "", key: "", transport: "http" });
    setIsTested(false);
    setTools([]);
    setTestError(null);
    nameRef.current = "";
    urlRef.current = "";
    keyRef.current = "";
  };

  const testOrSave = async () => {
    if (isTested) {
      const current: MCPServer = {
        ...mcpDetail,
        name: nameRef.current || mcpDetail.name,
        url: urlRef.current || mcpDetail.url,
        key: keyRef.current || mcpDetail.key,
      };
      await dataProvider.saveMCP(current);
      onSaved();
      onCancel();
    } else {
      if (!mcpDetail.name && !nameRef.current) {
        alert.showErrorAlert("Name is required");
        return;
      }
      if (!mcpDetail.url && !urlRef.current) {
        alert.showErrorAlert("URL is required");
        return;
      }
      setIsTesting(true);
      setTestError(null);
      const testResult = await mcpHelper.testMCP(mcpDetail);
      setIsTesting(false);

      if (!testResult.success) {
        const errMsg = testResult.error ?? "Unknown error";
        setTestError(errMsg);
        alert.showErrorAlert(`MCP Test Failed: ${errMsg}`);
        return;
      }

      setIsTesting(true);
      const listResult = await mcpHelper.listTools(mcpDetail);
      setIsTesting(false);

      if (listResult.error) {
        setTestError(listResult.error);
        alert.showErrorAlert(`List tools failed: ${listResult.error}`);
        return;
      }

      setTools(listResult.tools);
      setIsTested(true);
    }
  };

  const syncName = () => setMcpDetail((prev) => ({ ...prev, name: nameRef.current }));
  const syncUrl = () => setMcpDetail((prev) => ({ ...prev, url: urlRef.current }));
  const syncKey = () => setMcpDetail((prev) => ({ ...prev, key: keyRef.current }));

  return (
    <Dialog
      ref={ref}
      title={mcp ? `Update ${mcp.name}` : "Create MCP Server"}
    >
      <Card.Content>
        <DialogTextInput
          label="Server Name"
          placeholder="MCP Server Name"
          defaultValue={mcpDetail.name}
          onChangeText={(t) => { nameRef.current = t; }}
          onBlur={syncName}
          mode="outlined"
        />
        <DialogTextInput
          label="URL"
          placeholder="https://..."
          defaultValue={mcpDetail.url}
          onChangeText={(t) => { urlRef.current = t; }}
          onBlur={syncUrl}
          mode="outlined"
        />
        <DialogTextInput
          label="API Key (optional)"
          placeholder="API Key"
          defaultValue={mcpDetail.key}
          onChangeText={(t) => { keyRef.current = t; }}
          onBlur={syncKey}
          mode="outlined"
        />
        <Dropdown
          options={TRANSPORT_OPTIONS}
          label="Transport"
          onSelect={(text) => setMcpDetail((prev) => ({ ...prev, transport: text }))}
          value={mcpDetail.transport}
          mode="outlined"
          placeholder="Select Transport"
          style={{ marginBottom: 10 }}
        />

        {isTested && (
          <Chip icon="check-circle" style={{ marginTop: 10, marginBottom: 4 }}>
            Connection Successful
          </Chip>
        )}

        {testError && (
          <Text
            style={{ color: "red", marginTop: 8, marginBottom: 4, fontSize: 13 }}
            numberOfLines={5}
          >
            {testError}
          </Text>
        )}

        {tools.length > 0 && (
          <>
            <List.Subheader style={{ paddingLeft: 0 }}>
              Available Tools ({tools.length})
            </List.Subheader>
            {tools.map((tool) => (
              <List.Item
                key={tool.name}
                title={tool.name}
                description={tool.description}
                left={(props) => <List.Icon {...props} icon="toolbox" />}
              />
            ))}
          </>
        )}
      </Card.Content>
      <Card.Actions>
        <Button onPress={onCancel}>Cancel</Button>
        <Button
          onPress={testOrSave}
          loading={isTesting}
          disabled={isTesting}
        >
          {isTested ? "Save" : "Test"}
        </Button>
      </Card.Actions>
    </Dialog>
  );
};

export default CreateUpdateMCPDialog;
