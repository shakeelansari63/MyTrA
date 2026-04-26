import { Card, Text, IconButton, Chip } from "react-native-paper";
import React from "react";
import { LLMDetail } from "@/models/LLMDetail";

type Props = {
  llm: LLMDetail;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const LLMCard = ({ llm, onEdit, onDelete }: Props) => {
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title
        title={llm.name}
        subtitle={`Model: ${llm.model}`}
        left={(props) => <IconButton {...props} icon="robot" />}
        right={(props) => (
          <>
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => onEdit(llm.id)}
            />
            <IconButton
              {...props}
              icon="delete"
              onPress={() => onDelete(llm.id)}
            />
          </>
        )}
      />
      <Card.Content>
        <Chip icon="cloud" style={{ alignSelf: "flex-start" }}>
          {llm.provider}
        </Chip>
      </Card.Content>
    </Card>
  );
};

export default LLMCard;
