import { Card, Text } from "react-native-paper";
import React from "react";
import { LLMDetail } from "@/models/LLMDetail";

type Props = {
  llm: LLMDetail;
};

const LLMCard = ({ llm }: Props) => {
  return (
    <Card>
      <Text>{llm.name}</Text>
    </Card>
  );
};

export default LLMCard;
