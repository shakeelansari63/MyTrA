import { Button, Card, ActivityIndicator, Chip, Text } from "react-native-paper";
import Dropdown, { type Option } from "@/components/shared/Dropdown";
import { LLMDetail } from "@/models/LLMDetail";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Dialog from "@/components/shared/Dialog";
import { Providers } from "@/constants/Providers";
import React from "react";
import DialogTextInput from "@/components/shared/DialogTextInput";
import { useLLM } from "@/hooks/useLLM";
import { useDataProvider } from "@/hooks/useDataProvider";
import { AlertContextModel } from "@/models/AlertContext";
import { AlertContext } from "@/context/Alert";
import * as Crypto from "expo-crypto";

type Props = {
  llm: LLMDetail | null;
  ref: React.RefObject<BottomSheetModal | null>;
  onSaved: () => void;
};

type FieldDirtyChecker = {
  name: boolean;
  provider: boolean;
  url: boolean;
  model: boolean;
  key: boolean;
};

const CreateUpdateLLMDialog = ({ llm, ref, onSaved }: Props) => {
  const [llmDetail, setLlmDetail] = React.useState<LLMDetail>({
    id: "",
    name: "",
    provider: "",
    url: "",
    model: "",
    key: "",
  });

  const [fieldDirty, setFieldDirty] = React.useState<FieldDirtyChecker>({
    name: false,
    provider: false,
    url: false,
    model: false,
    key: false,
  });

  const [isTested, setIsTested] = React.useState<boolean>(false);
  const [isTesting, setIsTesting] = React.useState<boolean>(false);

  // LLM Hook
  const llmHelper = useLLM();
  const dataProvider = useDataProvider();
  const alert = React.useContext<AlertContextModel>(AlertContext);

  // Set LLM Detail is passed as parameter
  React.useEffect(() => {
    if (llm) {
      setLlmDetail(llm);
    } else {
      setLlmDetail({
        id: Crypto.randomUUID(),
        name: "",
        provider: "",
        url: "",
        model: "",
        key: "",
      });
    }
  }, [llm]);

  const providers: Option[] = Providers.map((p) => ({
    name: p.name,
    value: p.name,
    icon: p.icon,
  }));

  const onFormChange = (key: string, value: string) => {
    setLlmDetail({ ...llmDetail, [key]: value });
    if (isTested) {
      setIsTested(false);
    }
  };

  const onFieldFocus = (key: string) => {
    setFieldDirty({ ...fieldDirty, [key]: true });
  };

  const onCancel = () => {
    ref.current?.dismiss();

    setLlmDetail({
      id: "",
      name: "",
      provider: "",
      url: "",
      model: "",
      key: "",
    });

    setFieldDirty({
      name: false,
      provider: false,
      url: false,
      model: false,
      key: false,
    });

    setIsTested(false);
  };

  const testOrSave = async () => {
    if (isTested) {
      await dataProvider.saveLLM(llmDetail);
      onSaved();
      onCancel();
    } else {
      setIsTesting(true);
      const testStatus = await llmHelper.testLLM(llmDetail);
      setIsTesting(false);

      if (!testStatus) {
        alert.showErrorAlert("LLM Test Failed");
        return;
      }
      setIsTested(true);
    }
  };

  return (
    <Dialog ref={ref} title={!!llm ? `Update ${llm.name}` : "Create LLM"}>
      <Card.Content>
        {/* LLM name input */}
        <DialogTextInput
          label="LLM Name"
          placeholder="LLM Name"
          value={llmDetail?.name || ""}
          onChangeText={(text) => onFormChange("name", text)}
          onFocus={() => onFieldFocus("name")}
          mode="outlined"
          error={fieldDirty.name && !llmDetail?.name}
        />

        {/* Dropdown for Providers */}
        <Dropdown
          options={providers}
          label="LLM Provider"
          onSelect={(text) => onFormChange("provider", text)}
          value={llmDetail?.provider || undefined}
          mode="outlined"
          onFocus={() => onFieldFocus("provider")}
          placeholder="Select Provider"
          error={fieldDirty.provider && !llmDetail?.provider}
          style={{ marginBottom: 10 }}
        />

        {/* URL Input if Provider is Other */}
        {llmDetail?.provider === "Other" && (
          <DialogTextInput
            label="Other Provider URL"
            placeholder="https://..."
            value={llmDetail?.url || ""}
            onChangeText={(text) => onFormChange("url", text)}
            onFocus={() => onFieldFocus("url")}
            mode="outlined"
            error={fieldDirty.url && !llmDetail?.url}
          />
        )}

        {/* API Key Input */}
        <DialogTextInput
          label="API Key"
          placeholder="API Key"
          value={llmDetail?.key || ""}
          onChangeText={(text) => onFormChange("key", text)}
          onFocus={() => onFieldFocus("key")}
          mode="outlined"
          error={fieldDirty.key && !llmDetail?.key}
        />

        {/* Model name Input */}
        <DialogTextInput
          label="Model Name"
          placeholder="Model Name"
          value={llmDetail?.model || ""}
          onChangeText={(text) => onFormChange("model", text)}
          onFocus={() => onFieldFocus("model")}
          mode="outlined"
          error={fieldDirty.model && !llmDetail?.model}
        />

        {/* Test Status Feedback */}
        {isTested && (
          <Chip icon="check-circle" style={{ marginTop: 10 }} successful>
            Connection Successful
          </Chip>
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

export default CreateUpdateLLMDialog;
