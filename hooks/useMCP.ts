import { MCPServer } from "@/models/MCPServer";

export type MCPTool = {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
};

const LOG_PREFIX = "[MCP]";

const log = (msg: string, data?: unknown) => {
  console.log(`${LOG_PREFIX} ${msg}`, data ?? "");
};

const logError = (msg: string, data?: unknown) => {
  console.error(`${LOG_PREFIX} ERROR: ${msg}`, data ?? "");
};

const sessionMap = new Map<string, string>();

const getSessionId = (url: string): string | undefined => sessionMap.get(url);

const setSessionId = (url: string, id: string) => {
  log(`Session ID set for ${url}: ${id}`);
  sessionMap.set(url, id);
};

type JsonRpcResponse = {
  jsonrpc: string;
  id: number | string;
  result?: Record<string, unknown>;
  error?: { code?: number; message: string };
};

type McpFetchResult = {
  data?: JsonRpcResponse;
  sessionId?: string;
  error?: string;
};

/**
 * Parse an SSE (text/event-stream) body and return the first JSON payload
 * from a `data:` line with `event: message`.
 */
const parseSseBody = (text: string): JsonRpcResponse | null => {
  const lines = text.split("\n");
  let dataLine = "";
  let currentEvent = "";

  for (const line of lines) {
    if (line.startsWith("event: ")) {
      currentEvent = line.slice("event: ".length).trim();
    } else if (line.startsWith("data: ")) {
      const payload = line.slice("data: ".length);
      if (currentEvent === "message" || !currentEvent) {
        dataLine = payload;
      }
    } else if (line === "" && dataLine) {
      // End of an event block — try to parse
      try {
        return JSON.parse(dataLine);
      } catch {
        dataLine = "";
        currentEvent = "";
      }
    }
  }

  // If there was no trailing blank line, try the last accumulated data
  if (dataLine) {
    try {
      return JSON.parse(dataLine);
    } catch {
      return null;
    }
  }

  return null;
};

const parseResponseBody = (
  contentType: string,
  text: string,
): { data?: JsonRpcResponse; error?: string } => {
  if (contentType.includes("text/event-stream")) {
    const parsed = parseSseBody(text);
    if (!parsed) {
      return { error: `Failed to parse SSE response: ${text.slice(0, 500)}` };
    }
    return { data: parsed };
  }

  // Plain JSON
  if (!text) {
    return { error: "Empty response" };
  }

  let parsed: JsonRpcResponse;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: `Invalid JSON: ${text.slice(0, 500)}` };
  }

  return { data: parsed };
};

const mcpFetch = async (
  mcp: MCPServer,
  method: string,
  params?: Record<string, unknown>,
  sessionId?: string,
): Promise<McpFetchResult> => {
  const url = mcp.url;
  const body: Record<string, unknown> = { jsonrpc: "2.0", id: 1, method };
  if (params) body.params = params;
  const reqBody = JSON.stringify(body);

  log(`POST ${url} method=${method} sessionId=${sessionId ?? "none"}`);
  log("Request body:", reqBody);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream, application/problem+json",
    };
    if (mcp.key) headers.Authorization = `Bearer ${mcp.key}`;
    if (sessionId) headers["mcp-session-id"] = sessionId;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: reqBody,
    });

    log(`Response status: ${response.status} ${response.statusText}`);
    const respHeaders = Object.fromEntries(response.headers.entries());
    log("Response headers:", respHeaders);

    const newSessionId = respHeaders["mcp-session-id"];
    const contentType = respHeaders["content-type"] ?? "";

    const text = await response.text();
    log("Response body:", text);

    if (!text) {
      return { sessionId: newSessionId };
    }

    const { data, error } = parseResponseBody(contentType, text);
    if (error) {
      return { error, sessionId: newSessionId };
    }

    if (data?.error) {
      return {
        error: `MCP error (${data.error.code ?? "?"}): ${data.error.message}`,
        sessionId: newSessionId,
      };
    }

    return { data, sessionId: newSessionId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logError("Network/fetch error:", message);
    return { error: `Network error: ${message}` };
  }
};

const ensureSession = async (mcp: MCPServer): Promise<{ sessionId: string; error?: string }> => {
  const existing = getSessionId(mcp.url);
  if (existing) return { sessionId: existing };

  log("No session — sending initialize...");

  const initResult = await mcpFetch(mcp, "initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "MyTrA", version: "1.0.0" },
  });

  if (initResult.error) {
    return { sessionId: "", error: `Initialize failed: ${initResult.error}` };
  }

  const sid = initResult.sessionId;
  if (!sid) {
    return { sessionId: "", error: "Server did not return session ID" };
  }

  setSessionId(mcp.url, sid);

  log("Sending notifications/initialized...");
  await mcpFetch(mcp, "notifications/initialized", undefined, sid);

  log("Session established:", sid);
  return { sessionId: sid };
};

export const useMCP = () => {
  const testMCP = async (mcp: MCPServer): Promise<{ success: boolean; error?: string }> => {
    log(`Testing MCP server: ${mcp.name} (${mcp.url})`);

    const { sessionId, error: sessionError } = await ensureSession(mcp);
    if (sessionError) {
      logError("Test failed:", sessionError);
      return { success: false, error: sessionError };
    }

    const result = await mcpFetch(mcp, "tools/list", undefined, sessionId);
    if (result.error) {
      logError("Test failed:", result.error);
      return { success: false, error: result.error };
    }

    log("Test succeeded.");
    return { success: true };
  };

  const listTools = async (mcp: MCPServer): Promise<{ tools: MCPTool[]; error?: string }> => {
    log(`Listing tools for MCP server: ${mcp.name} (${mcp.url})`);

    const { sessionId, error: sessionError } = await ensureSession(mcp);
    if (sessionError) {
      logError("List tools failed:", sessionError);
      return { tools: [], error: sessionError };
    }

    const result = await mcpFetch(mcp, "tools/list", undefined, sessionId);
    if (result.error) {
      logError("List tools failed:", result.error);
      return { tools: [], error: result.error };
    }

    const rawTools = result.data?.result?.tools as
      | { name: string; description?: string; inputSchema?: Record<string, unknown> }[]
      | undefined;
    const tools = (rawTools ?? []).map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema as
        | { type: string; properties?: Record<string, unknown>; required?: string[] }
        | undefined,
    }));

    log(`List tools: found ${tools.length} tools`);
    return { tools };
  };

  const callTool = async (
    mcp: MCPServer,
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<{ result?: unknown; error?: string }> => {
    log(`Calling MCP tool: ${mcp.name}/${toolName}`);

    const { sessionId, error: sessionError } = await ensureSession(mcp);
    if (sessionError) {
      return { error: sessionError };
    }

    const result = await mcpFetch(mcp, "tools/call", { name: toolName, arguments: args }, sessionId);
    if (result.error) {
      return { error: result.error };
    }

    return { result: result.data?.result };
  };

  return { testMCP, listTools, callTool };
};
