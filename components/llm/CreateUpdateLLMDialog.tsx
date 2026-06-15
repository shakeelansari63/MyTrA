import { Button, Card, Chip } from "react-native-paper";
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

const CreateUpdateLLMDialog = ({ llm, ref, onSaved }: Props) => {
  const [llmDetail, setLlmDetail] = React.useState<LLMDetail>({
    id: "",
    name: "",
    provider: "",
    url: "",
    model: "",
    key: "",
  });

  const [isTested, setIsTested] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);

  const nameRef = React.useRef("");
  const urlRef = React.useRef("");
  const keyRef = React.useRef("");
  const modelRef = React.useRef("");

  const llmHelper = useLLM();
  const dataProvider = useDataProvider();
  const alert = React.useContext<AlertContextModel>(AlertContext);

  React.useEffect(() => {
    if (llm?.id) {
      setLlmDetail(llm);
      nameRef.current = llm.name;
      urlRef.current = llm.url;
      keyRef.current = llm.key;
      modelRef.current = llm.model;
    } else {
      const id = Crypto.randomUUID();
      setLlmDetail({ id, name: "", provider: "", url: "", model: "", key: "" });
      nameRef.current = "";
      urlRef.current = "";
      keyRef.current = "";
      modelRef.current = "";
    }
    setIsTested(false);
  }, [llm]);

  const providers: Option[] = Providers.map((p) => ({
    name: p.name,
    value: p.name,
    icon: p.icon,
  }));

  const onCancel = () => {
    ref.current?.dismiss();
    const id = Crypto.randomUUID();
    setLlmDetail({ id, name: "", provider: "", url: "", model: "", key: "" });
    setIsTested(false);
    nameRef.current = "";
    urlRef.current = "";
    keyRef.current = "";
    modelRef.current = "";
  };

  const testOrSave = async () => {
    if (isTested) {
      const current: LLMDetail = {
        ...llmDetail,
        name: nameRef.current || llmDetail.name,
        url: urlRef.current || llmDetail.url,
        key: keyRef.current || llmDetail.key,
        model: modelRef.current || llmDetail.model,
      };
      await dataProvider.saveLLM(current);
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

  const syncName = () => setLlmDetail((prev) => ({ ...prev, name: nameRef.current }));
  const syncUrl = () => setLlmDetail((prev) => ({ ...prev, url: urlRef.current }));
  const syncKey = () => setLlmDetail((prev) => ({ ...prev, key: keyRef.current }));
  const syncModel = () => setLlmDetail((prev) => ({ ...prev, model: modelRef.current }));

  return (
    <Dialog ref={ref} title={llm ? `Update ${llm.name}` : "Create LLM"}>
      <Card.Content>
        <DialogTextInput
          label="LLM Name"
          placeholder="LLM Name"
          defaultValue={llmDetail.name}
          onChangeText={(t) => { nameRef.current = t; }}
          onBlur={syncName}
          mode="outlined"
        />

        <Dropdown
          options={providers}
          label="LLM Provider"
          onSelect={(text) => setLlmDetail((prev) => ({ ...prev, provider: text }))}
          value={llmDetail.provider || undefined}
          mode="outlined"
          placeholder="Select Provider"
          style={{ marginBottom: 10 }}
        />

        {llmDetail.provider === "Other" && (
          <DialogTextInput
            label="Other Provider URL"
            placeholder="https://..."
            defaultValue={llmDetail.url}
            onChangeText={(t) => { urlRef.current = t; }}
            onBlur={syncUrl}
            mode="outlined"
          />
        )}

        <DialogTextInput
          label="API Key"
          placeholder="API Key"
          defaultValue={llmDetail.key}
          onChangeText={(t) => { keyRef.current = t; }}
          onBlur={syncKey}
          mode="outlined"
        />

        <DialogTextInput
          label="Model Name"
          placeholder="Model Name"
          defaultValue={llmDetail.model}
          onChangeText={(t) => { modelRef.current = t; }}
          onBlur={syncModel}
          mode="outlined"
        />

        {isTested && (
          <Chip icon="check-circle" style={{ marginTop: 10 }}>
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
