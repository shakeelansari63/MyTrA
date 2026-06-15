import { Bot } from "@/models/Bot";
import { useLLM } from "./useLLM";
import { useMCP, MCPTool } from "./useMCP";
import { Message } from "@/models/Chat";
import { useDataProvider } from "./useDataProvider";
import { IMessage } from "react-native-gifted-chat";
import { MCPServer } from "@/models/MCPServer";
import { llmChat, OpenAITool } from "@/services/ChatService";

const MAX_AGENT_ITERATIONS = 10;

const mcpToolToOpenAITool = (
  name: string,
  desc: string | undefined,
  schema: MCPTool["inputSchema"],
): OpenAITool => ({
  type: "function",
  function: {
    name,
    description: desc,
    parameters: schema ?? { type: "object", properties: {} },
  },
});

const extractToolCall = (
  response: string,
): { tool: string; arguments: Record<string, unknown> } | null => {
  const idx = response.indexOf("TOOL_CALL:");
  if (idx === -1) return null;

  const after = response.slice(idx + "TOOL_CALL:".length).trim();
  const start = after.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let jsonEnd = -1;
  for (let i = start; i < after.length; i++) {
    if (after[i] === "{") depth++;
    else if (after[i] === "}") {
      depth--;
      if (depth === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }
  if (jsonEnd === -1) return null;

  try {
    const parsed = JSON.parse(after.slice(start, jsonEnd));
    if (typeof parsed.tool !== "string") return null;
    return {
      tool: parsed.tool,
      arguments: (parsed.arguments as Record<string, unknown>) ?? {},
    };
  } catch {
    return null;
  }
};

export const useBot = () => {
  const llm = useLLM();
  const dataProvider = useDataProvider();
  const mcpHelper = useMCP();

  const talk2Bot = async (bot: Bot, messages: Message[]) => {
    if (bot.botType === "llm") {
      const llmDetail = await dataProvider.getLLMById(bot.id);
      if (llmDetail === null) return;
      return await llm.llmChatResponse(llmDetail, [...messages].reverse());
    }

    if (bot.botType === "agent") {
      return await agentChat(bot, messages);
    }
  };

  const agentChat = async (bot: Bot, rawMessages: Message[]) => {
    const agent = await dataProvider.getAgentById(bot.id);
    if (agent === null) return;

    const llmDetail = await dataProvider.getLLMById(agent.llm);
    if (llmDetail === null) return;

    const mcpIds = agent.mcpServers ?? [];
    const toolToServer = new Map<string, MCPServer>();
    const openAiTools: OpenAITool[] = [];

    for (const mcpId of mcpIds) {
      const mcp = await dataProvider.getMCPById(mcpId);
      if (!mcp) continue;

      const { tools, error } = await mcpHelper.listTools(mcp);
      if (error) continue;

      for (const t of tools) {
        toolToServer.set(t.name, mcp);
        openAiTools.push(mcpToolToOpenAITool(t.name, t.description, t.inputSchema));
      }
    }

    const systemParts = [agent.role, agent.taskDetail].filter(Boolean).join("\n");
    const systemContent = agent.name ? `${agent.name}: ${systemParts}` : systemParts;

    const orderedMessages = [...rawMessages].reverse().map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    for (let i = 0; i < MAX_AGENT_ITERATIONS; i++) {
      const response = await llmChat(llmDetail, [
        { role: "system", content: systemContent },
        ...orderedMessages,
      ], openAiTools.length > 0 ? openAiTools : undefined);

      const toolCall = extractToolCall(response);
      if (!toolCall) return response;

      const mcp = toolToServer.get(toolCall.tool);
      if (!mcp) {
        orderedMessages.push({ role: "assistant", content: response });
        orderedMessages.push({
          role: "user",
          content: `Error: Tool "${toolCall.tool}" not found. Available: ${[...toolToServer.keys()].join(", ")}`,
        });
        continue;
      }

      const { result, error: callError } = await mcpHelper.callTool(
        mcp,
        toolCall.tool,
        toolCall.arguments,
      );

      let toolOutput: string;
      if (callError) {
        toolOutput = `Error: ${callError}`;
      } else {
        const content = (result as { content?: { type: string; text: string }[] })?.content;
        if (Array.isArray(content)) {
          toolOutput = content
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join("\n");
        } else {
          toolOutput = JSON.stringify(result);
        }
      }

      orderedMessages.push({ role: "assistant", content: response });
      orderedMessages.push({
        role: "user",
        content: `Tool "${toolCall.tool}" returned:\n${toolOutput}\n\nContinue.`,
      });
    }

    return "Agent reached maximum iterations without a final answer.";
  };

  const langMessagesToChatIMessages = (messages: Message[]): IMessage[] => {
    return messages.map((message, idx) => ({
      _id: idx,
      text: message.content,
      createdAt: new Date(),
      user: {
        _id: message.role === "user" ? 1 : 0,
        name: message.role === "user" ? "User" : "Assistant",
      },
    }));
  };

  const chatIMessagesToLangMessages = (messages: IMessage[]): Message[] => {
    return messages.map((message) => ({
      role: message.user._id === 1 ? "user" : "assistant",
      content: message.text,
    }));
  };

  return {
    talk2Bot,
    langMessagesToChatIMessages,
    chatIMessagesToLangMessages,
  };
};
