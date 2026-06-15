import { Agent } from "@/models/Agent";
import { LLMDetail } from "@/models/LLMDetail";
import { MCPServer } from "@/models/MCPServer";
import { Chat } from "@/models/Chat";
import {
  saveRowToListStore,
  getAllRowsFromListStore,
  getRowByIdFromListStore,
  saveRowToStore,
  getRowFromStore,
  deleteRowFromListStore,
} from "@/services/DataService";

const LLMKEY = "LLMS";
const MCPKEY = "MCPS";
const AGENTKEY = "AGENTS";
const CHATKEY = "CHATS";
const RESTORECHAT = "RESTORECHAT";

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

  const saveChat = async (chat: Chat) => {
    await saveRowToListStore(CHATKEY, chat);
  };

  const saveRestoreChatId = async (chatId: string) => {
    await saveRowToStore(RESTORECHAT, chatId);
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

  const getAllChats = async () => {
    return await getAllRowsFromListStore<Chat>(CHATKEY);
  };

  const getRestoreChatId = async () => {
    return await getRowFromStore(RESTORECHAT);
  };

  const clearRestoreChatId = async () => {
    await saveRowToStore(RESTORECHAT, null);
  };

  const getLLMById = async (id: string) => {
    return await getRowByIdFromListStore<LLMDetail>(LLMKEY, id);
  };

  const deleteLLM = async (id: string) => {
    await deleteRowFromListStore(LLMKEY, id);
  };

  const deleteMCP = async (id: string) => {
    await deleteRowFromListStore(MCPKEY, id);
  };

  const deleteAgent = async (id: string) => {
    await deleteRowFromListStore(AGENTKEY, id);
  };

  const deleteChat = async (id: string) => {
    await deleteRowFromListStore(CHATKEY, id);
  };

  const getMCPById = async (id: string) => {
    return await getRowByIdFromListStore<MCPServer>(MCPKEY, id);
  };

  const getAgentById = async (id: string) => {
    return await getRowByIdFromListStore<Agent>(AGENTKEY, id);
  };

  const getChatById = async (id: string) => {
    return await getRowByIdFromListStore<Chat>(CHATKEY, id);
  };

  return {
    saveLLM,
    saveMCP,
    saveAgent,
    saveChat,
    saveRestoreChatId,
    getAllLLMs,
    getAllMCPs,
    getAllAgents,
    getAllChats,
    getRestoreChatId,
    clearRestoreChatId,
    getLLMById,
    getMCPById,
    getAgentById,
    getChatById,
    deleteLLM,
    deleteMCP,
    deleteAgent,
    deleteChat,
  };
};
