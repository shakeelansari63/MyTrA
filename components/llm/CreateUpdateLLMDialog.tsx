import { Button, Card } from "react-native-paper";
import Dropdown, { type Option } from "@/components/shared/Dropdown";
import { LLMDetail } from "@/models/LLMDetail";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Dialog from "@/components/shared/Dialog";
import { Providers } from "@/constants/Providers";
import React from "react";
import DialogTextInput from "@/components/shared/DialogTextInput";
import { useLLM } from "@/hooks/useLLM";
import { AlertContextModel } from "@/models/AlertContext";
import { AlertContext } from "@/context/Alert";

type Props = {
  llm: LLMDetail | null;
  ref: React.RefObject<BottomSheetModal | null>;
};

type FieldDirtyChecker = {
  name: boolean;
  provider: boolean;
  url: boolean;
  model: boolean;
  key: boolean;
};

const CreateUpdateLLMDialog = ({ llm, ref }: Props) => {
  const [llmDetail, setLlmDetail] = React.useState<LLMDetail>({
    id: crypto.randomUUID(),
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

  // LLM Hook
  const llmHelper = useLLM();
  const alert = React.useContext<AlertContextModel>(AlertContext);

  // Set LLM Detail is passed as parameter
  React.useEffect(() => {
    if (llm) {
      setLlmDetail(llm);
    }
  }, [llm]);

  const providers: Option[] = Providers.map((p) => ({
    name: p.name,
    value: p.name,
    icon: p.icon,
  }));

  const onFormChange = (key: string, value: string) => {
    setLlmDetail({ ...llmDetail, [key]: value });
  };

  const onFieldFocus = (key: string) => {
    setFieldDirty({ ...fieldDirty, [key]: true });
  };

  const onCancel = () => {
    // Hide the dialog
    ref.current?.dismiss();

    // Reset form fields
    setLlmDetail({
      id: crypto.randomUUID(),
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
  };

  const testOrSave = async () => {
    if (isTested) {
      // Save logic here
      console.log("tested fine");
    } else {
      // Test LLM Logic Here
      const testStatus = await llmHelper.testLLM(llmDetail);

      if (!testStatus) {
        alert.showErrorAlert("LLM Test Failed");
      }
      setIsTested(testStatus);
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
      </Card.Content>
      <Card.Actions>
        <Button onPress={onCancel}>Cancel</Button>
        <Button onPress={testOrSave}>{isTested ? "Save" : "Test"}</Button>
      </Card.Actions>
    </Dialog>
  );
};

export default CreateUpdateLLMDialog;
