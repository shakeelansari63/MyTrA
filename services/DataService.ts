import { Agent } from "@/models/Agent";
import { LLMDetail } from "@/models/LLMDetail";
import { MCPServer } from "@/models/MCPServer";
import { CurrentBot } from "@/models/CurrentBot";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HasId = {
  id: string;
};

const LLMKEY = "LLMS";
const MCPKEY = "MCPS";
const AGENTKEY = "AGENTS";
const CURRENTBOT = "CURRENTBOT";

const saveToStore = async <T extends HasId>(key: string, value: T) => {
  // Get the Stored LLMs List
  const storedData = await AsyncStorage.getItem(key);

  // LLMs List
  let dataList: T[] = [];

  // Save new LLM if there is none in db
  if (storedData) {
    dataList = JSON.parse(storedData) as T[];
  }

  // Check if input LLM is already there in list
  const dataExist = dataList.find((l) => l.id === value.id);

  // Update or insert new LLM
  if (dataExist) {
    dataList = [value, ...dataList.filter((l) => l.id !== value.id)];
  } else {
    dataList = [value, ...dataList];
  }

  // Save to async storage
  await AsyncStorage.setItem(key, JSON.stringify(dataList));
};

const getAllFromStore = async <T extends HasId>(key: string): Promise<T[]> => {
  const storedData = await AsyncStorage.getItem(key);
  return storedData ? (JSON.parse(storedData) as T[]) : [];
};

const getByIdFromStore = async <T extends HasId>(
  key: string,
  id: string,
): Promise<T | null> => {
  const storedData = await AsyncStorage.getItem(key);

  // Check if store has value
  if (!storedData) return null;

  // Parse stored data and find item by id
  const dataList = JSON.parse(storedData) as T[];
  return dataList.find((item) => item.id === id) || null;
};

// Exported methods
export const saveLLM = async (llm: LLMDetail) => {
  await saveToStore(LLMKEY, llm);
};

export const saveMCP = async (mcp: MCPServer) => {
  await saveToStore(MCPKEY, mcp);
};

export const saveAgent = async (agent: Agent) => {
  await saveToStore(AGENTKEY, agent);
};

export const saveCurrentBot = async (bot: CurrentBot) => {
  await AsyncStorage.setItem(CURRENTBOT, JSON.stringify(bot));
};

export const getAllLLMs = async () => {
  return await getAllFromStore<LLMDetail>(LLMKEY);
};

export const getAllMCPs = async () => {
  return await getAllFromStore<MCPServer>(MCPKEY);
};

export const getAllAgents = async () => {
  return await getAllFromStore<Agent>(AGENTKEY);
};

export const getCurrentBot = async () => {
  const storedData = await AsyncStorage.getItem(CURRENTBOT);
  return storedData ? (JSON.parse(storedData) as CurrentBot) : null;
};

export const getLLMById = async (id: string) => {
  return await getByIdFromStore<LLMDetail>(LLMKEY, id);
};

export const getMCPById = async (id: string) => {
  return await getByIdFromStore<MCPServer>(MCPKEY, id);
};

export const getAgentById = async (id: string) => {
  return await getByIdFromStore<Agent>(AGENTKEY, id);
};
