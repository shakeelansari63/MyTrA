import { Agent } from "@/models/Agent";
import { LLMDetail } from "@/models/LLMDetail";
import { MCPServer } from "@/models/MCPServer";
import { CurrentBot } from "@/models/CurrentBot";
import {
  saveRowToListStore,
  getAllRowsFromListStore,
  getRowByIdFromListStore,
  saveRowToStore,
  getRowFromStore,
} from "@/services/DataService";

const LLMKEY = "LLMS";
const MCPKEY = "MCPS";
const AGENTKEY = "AGENTS";
const CURRENTBOT = "CURRENTBOT";

export const useDataProvider = () => {
  const saveLLM = async (llm: LLMDetail) => {
    await saveRowToListStore(LLMKEY, llm);
  };

  const saveMCP = async (mcp: MCPServer) => {
    await saveRowToListStore(MCPKEY, mcp);
  };

  const saveAgent = async (agent: Agent) => {
    await saveRowToListStore(AGENTKEY, agent);
  };

  const saveCurrentBot = async (bot: CurrentBot) => {
    await saveRowToStore(CURRENTBOT, bot);
  };

  const getAllLLMs = async () => {
    return await getAllRowsFromListStore<LLMDetail>(LLMKEY);
  };

  const getAllMCPs = async () => {
    return await getAllRowsFromListStore<MCPServer>(MCPKEY);
  };

  const getAllAgents = async () => {
    return await getAllRowsFromListStore<Agent>(AGENTKEY);
  };

  const getCurrentBot = async () => {
    return await getRowFromStore(CURRENTBOT);
  };

  const getLLMById = async (id: string) => {
    return await getRowByIdFromListStore<LLMDetail>(LLMKEY, id);
  };

  const getMCPById = async (id: string) => {
    return await getRowByIdFromListStore<MCPServer>(MCPKEY, id);
  };

  const getAgentById = async (id: string) => {
    return await getRowByIdFromListStore<Agent>(AGENTKEY, id);
  };

  return {
    saveLLM,
    saveMCP,
    saveAgent,
    saveCurrentBot,
    getAllLLMs,
    getAllMCPs,
    getAllAgents,
    getCurrentBot,
    getLLMById,
    getMCPById,
    getAgentById,
  };
};
