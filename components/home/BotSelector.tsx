import { View } from "react-native";
import { Button, List } from "react-native-paper";
import React from "react";
import { useDataProvider } from "@/hooks/useDataProvider";
import { Bot } from "@/models/Bot";
import Dialog from "../shared/Dialog";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type BotSelectorProps = {
  currentBot: Bot | null;
  setCurrentBot: React.Dispatch<React.SetStateAction<Bot | null>>;
};

const BotSelector = ({ currentBot, setCurrentBot }: BotSelectorProps) => {
  const [llmBots, setLlmBots] = React.useState<Bot[]>([]);
  const [agentsBots, setAgentsBots] = React.useState<Bot[]>([]);

  const dataprovider = useDataProvider();
  const dialogRef = React.useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      // get List of LLMs as Bot
      const llms = await dataprovider.getAllLLMs();
      const llmBots: Bot[] = llms.map((llm) => ({
        botType: "llm",
        name: llm.name,
        id: llm.id,
      }));
      setLlmBots(llmBots);

      // get list of Agents as Bot
      const agents = await dataprovider.getAllAgents();
      const agentsBots: Bot[] = agents.map((agent) => ({
        botType: "agent",
        name: agent.name,
        id: agent.id,
      }));
      setAgentsBots(agentsBots);
    };
    fetchData();
  }, []);

  return (
    <View>
      <Button onPress={() => dialogRef.current?.present()}>
        {currentBot?.name ?? "Select a Bot"}
      </Button>
      <Dialog ref={dialogRef} title="Select Bot">
        {llmBots.length === 0 && agentsBots.length === 0 ? (
          <List.Subheader>No bots available</List.Subheader>
        ) : (
          <>
            {/* Show agents first */}
            {agentsBots.length > 0 && (
              <List.Section>
                <List.Subheader>AGENTS</List.Subheader>
                {agentsBots.map((bot) => (
                  <List.Item
                    key={bot.id}
                    title={bot.name}
                    onPress={() => {
                      setCurrentBot(bot);
                      dialogRef.current?.dismiss();
                    }}
                  />
                ))}
                )
              </List.Section>
            )}

            {/* Show LLM bots first */}
            {llmBots.length > 0 && (
              <List.Section>
                <List.Subheader>LLMs</List.Subheader>
                {llmBots.map((bot) => (
                  <List.Item
                    key={bot.id}
                    title={bot.name}
                    onPress={() => {
                      setCurrentBot(bot);
                      dialogRef.current?.dismiss();
                    }}
                  />
                ))}
              </List.Section>
            )}
          </>
        )}
      </Dialog>
    </View>
  );
};

export default BotSelector;
