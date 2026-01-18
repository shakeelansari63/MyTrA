import { Button, Card } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { LLMDetail } from "@/models/LLMDetail";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Dialog from "@/components/shared/Dialog";
import { Providers } from "@/constants/Providers";
import React from "react";
import { Provider } from "@/models/Provider";

type Props = {
    llm: LLMDetail | null;
    ref: React.RefObject<BottomSheetModal | null>;
};

const CreateUpdateLLMDialog = ({ llm, ref }: Props) => {
    const [selectedProvider, setSelectedProvider] =
        React.useState<Provider | null>(null);

    const providers = Providers.map((p) => ({ label: p.name, value: p.name }));

    const onSelectProvider = (value: string | undefined) => {
        setSelectedProvider(Providers.find((p) => p.name === value) || null);
    };

    return (
        <Dialog ref={ref} title={!!llm ? `Update ${llm.name}` : "Create LLM"}>
            <Card.Content>
                <Dropdown
                    options={providers}
                    onSelect={onSelectProvider}
                    value={selectedProvider?.name}
                    mode="outlined"
                    placeholder="Select Provider"
                    hideMenuHeader={true}
                />
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => ref?.current?.dismiss()}>Cancel</Button>
                <Button onPress={() => {}}>Save</Button>
            </Card.Actions>
        </Dialog>
    );
};

export default CreateUpdateLLMDialog;
