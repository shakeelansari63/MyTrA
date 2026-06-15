import { Providers } from "@/constants/Providers";
import { LLMDetail } from "@/models/LLMDetail";

export type OpenAITool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
};

export const getProviderUrl = (llm: LLMDetail): string | null => {
  const foundProvider = Providers.find((p) => p.name === llm.provider);
  if (!foundProvider && !llm.url) return null;
  let finalUrl = foundProvider?.url || llm.url;
  if (finalUrl.endsWith("/")) {
    finalUrl = finalUrl.slice(0, -1);
  }
  return finalUrl;
};

export const llmChat = async (
  llm: LLMDetail,
  messages: { role: string; content: string }[],
  tools?: OpenAITool[],
): Promise<string> => {
  const providerUrl = getProviderUrl(llm);
  if (!providerUrl) throw new Error("Provider URL not found");

  const body: Record<string, unknown> = {
    model: llm.model,
    messages,
  };
  if (tools?.length) body.tools = tools;

  const response = await fetch(`${providerUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${llm.key}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM API error ${response.status}: ${text.slice(0, 500)}`);
  }

  const raw = await response.text();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`LLM returned non-JSON: ${raw.slice(0, 500)}`);
  }

  const choices = (parsed as { choices?: unknown[] }).choices;
  const firstChoice = choices?.[0] as
    | { message?: { content?: unknown; tool_calls?: unknown[] } }
    | undefined;
  const msg = firstChoice?.message;

  if (typeof msg?.content === "string" && msg.content) {
    return msg.content;
  }

  if (Array.isArray(msg?.tool_calls)) {
    const parts: string[] = [];
    for (const tc of msg.tool_calls) {
      const fn = (tc as { function?: { name?: string; arguments?: string } }).function;
      if (!fn?.name) continue;
      let args: Record<string, unknown> = {};
      try {
        if (fn.arguments) args = JSON.parse(fn.arguments);
      } catch { /* use empty */ }
      parts.push(`TOOL_CALL:${JSON.stringify({ tool: fn.name, arguments: args })}`);
    }
    if (parts.length) return parts.join("\n");
  }

  throw new Error(
    `LLM returned empty response. Model: ${llm.model}. ` +
      `Raw: ${JSON.stringify(parsed).slice(0, 500)}`,
  );
};
