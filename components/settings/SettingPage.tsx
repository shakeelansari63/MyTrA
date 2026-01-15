import { Text } from "react-native-paper";
import React from "react";
import SettingSection from "./SettingSection";

const SettingPage = () => {
  return (
    <>
      {/* LLM Setup */}
      <SettingSection title="LLMs" icon="chat-processing-outline">
        <Text>LLMs</Text>
      </SettingSection>

      {/* MCP Server Setup */}
      <SettingSection title="MCP Servers" icon="server-outline">
        <Text>MCP Servers</Text>
      </SettingSection>

      {/* Agent Setup */}
      <SettingSection title="Agents" icon="robot-happy-outline">
        <Text>Agents</Text>
      </SettingSection>
    </>
  );
};

export default SettingPage;
