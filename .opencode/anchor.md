## Goal
- Complete working Agent chat with MCP tools using raw `fetch` (no LangChain).

## Constraints & Preferences
- Use raw `fetch` to OpenAI-compatible `/chat/completions` endpoint for all LLM calls — no `@langchain/openai`, `@langchain/langgraph`, `@langchain/mcp-adapters`.
- Custom ReAct agent loop: build tools in native OpenAI `tools` API parameter, send to LLM, handle native `tool_calls` responses, execute tools via `useMCP`, feed results back as user messages, repeat up to 10 iterations.
- MCP transport is Streamable HTTP (POST + SSE responses, FastMCP/uvicorn).
- All dialogs use uncontrolled inputs with refs + onBlur to avoid `enableDynamicSizing` flicker.
- Chat interface needs `KeyboardAvoidingView` so the input stays visible when the keyboard opens.

## Progress
### Done
- Fixed LLM creation bug: `createNewLLM` was passing `{id:"",...}` (truthy) instead of `null`, so the dialog's `if (llm)` checked truthy and kept `id:""`. Changed to pass `null` and guard with `llm?.id` across all three dialogs (LLM, MCP, Agent).
- Fixed pre-existing stray `)` in BotSelector JSX that caused "Text strings must be rendered within a <Text>" error.
- BotSelector now fetches bots fresh on every button press (not just on mount), so newly created agents appear immediately.
- Added `KeyboardAvoidingView` wrapping `GiftedChat` in `ChatInterface` with `flex:1` layout in `ChatPage` so the input stays above the keyboard.
- Fixed `ChatInputToolbar`: properly constructs `IMessage` with `text` content, clears input via `onChangeText("")` after send, fixed `width="100%"` → `style={{width:"100%"}}`, fixed missing `)` in return statement.
- Fixed `handleSend` to pass full conversation history (reversed) to `talk2Bot`.
- **Removed all LangChain dependencies**: `@langchain/core`, `@langchain/langgraph`, `@langchain/mcp-adapters`, `@langchain/openai`, `langchain` uninstalled (78 packages removed).
- **Replaced `ChatService.ts`**: removed `getLlmChat` (ChatOpenAI); added `llmChat()` — raw `fetch` to `POST {baseUrl}/chat/completions` with optional `tools` parameter (OpenAI function-calling format).
- **Replaced `useLLM.ts`**: `llmChatResponse` now calls `llmChat()` (raw fetch) instead of `ChatOpenAI.invoke()`.
- **Replaced `useBot.ts`**: `agentChat` uses a custom ReAct loop — builds OpenAI-format tool definitions from MCP tool schemas, passes `tools` in the API request, processes native `tool_calls`, executes tools via `useMCP.callTool`, feeds results back, loops up to 10 iterations.
- **Emptied `app/polyfills.ts`** — no longer needed without `@langchain/core`'s `isJsDom` check.
- Fixed "Invalid LLM response format" error: Gemini returned empty response because `tools` parameter was not sent in the API request. Now sends `tools` natively so the model uses proper function calling.
- Added better error messages that include the raw API response for debugging.
- **Dead code removal**: removed `showWarnAlert` (never called), `openDrawer`/`closeDrawer` (only `toggleDrawer` used), `saveCurrentBot`/`getCurrentBot` (never called), `PaperStyledTabs` (unused component), `polyfills.ts` (empty file).
- **Removed `import "./polyfills"` from `app/_layout.tsx`** since file was deleted.
- **Removed unused `CURRENTBOT` constant** from `useDataProvider.ts`.
- **Removed unused `Bot` import** from `useDataProvider.ts`.

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Abandon LangChain entirely (`@langchain/openai`, `@langchain/langgraph`, `@langchain/mcp-adapters`, `@langchain/core`) due to Metro/resolution issues with the MCP SDK's `pkce-challenge` dependency and other runtime incompatibilities. Use raw `fetch` for everything.
- Use native OpenAI `tools` API parameter (function calling format) instead of text-based `TOOL_CALL:` instructions in the system prompt. Many models (Gemini, etc.) require the proper `tools` parameter to activate function calling; otherwise they return empty responses.
- When the API returns native `tool_calls`, convert them to `TOOL_CALL:{"tool":"name","arguments":{}}` text so the ReAct loop's `extractToolCall()` parser can process them uniformly.
- Cache tool-to-MCP-server mapping after the initial `listTools` calls so tool execution doesn't re-list tools on every iteration.

## Next Steps
1. Test agent chat with Gemini (or other model) — verify tool calls work end-to-end.
2. Test LLM chat (non-agent) still works.
3. Verify keyboard avoidance on both iOS and Android.
4. Remove the temporary `console.warn` in `useBot.ts` after testing confirms stability.

## Critical Context
- Gemini (via OpenAI-compatible endpoint `https://generativelanguage.googleapis.com/v1beta/openai/`) returned empty responses (`completion_tokens: 0`, no `content`, no `tool_calls`) when tools were described only in the system prompt. Sending the native `tools` API parameter fixed it.
- `llmChat()` in `ChatService.ts` accepts optional `OpenAITool[]` and sends them as the `tools` parameter in the request body.
- `extractToolCall()` parses `TOOL_CALL:{"tool":"name","arguments":{...}}` from LLM responses. Both text-based and API-native tool calls are converted to this format.
- `useMCP.ts` handles the Streamable HTTP transport (POST + SSE) — sends JSON-RPC requests, parses SSE responses for `event: message` data lines.
- `navigator.userAgent` polyfill is no longer needed since `@langchain/core` was removed.
- Dead code removed: `showWarnAlert`, `openDrawer`/`closeDrawer`, `saveCurrentBot`/`getCurrentBot`, `PaperStyledTabs`, `polyfills.ts` file.

## Relevant Files
- `services/ChatService.ts`: `llmChat()` — raw fetch with optional `tools` param; exports `OpenAITool` type
- `hooks/useLLM.ts`: `llmChatResponse()` calls `llmChat()` via ChatService
- `hooks/useBot.ts`: `agentChat()` — builds OpenAI tool defs from MCP schemas, ReAct loop with `extractToolCall()`, tool execution via `useMCP.callTool`
- `hooks/useMCP.ts`: `callTool()`, `listTools()`, SSE parsing for Streamable HTTP transport
- `components/home/ChatInterface.tsx`: `KeyboardAvoidingView` wrapper, passes full history to `talk2Bot`
- `components/home/ChatInputToolbar.tsx`: Fixed type issues, send with IMessage construction
- `components/home/ChatPage.tsx`: `View style={{flex:1}}` layout
- `components/home/BotSelector.tsx`: Fetches bots on every button press
- `components/llm/CreateUpdateLLMDialog.tsx`, `components/mcp/CreateUpdateMCPDialog.tsx`, `components/agent/CreateUpdateAgentDialog.tsx`: Guard `?.id`
- `constants/Providers.ts`: Provider URLs with `/v1beta/openai/` or `/v1` paths; `llmChat` appends `/chat/completions`
- `context/Alert.ts`, `hooks/useAlert.ts`: `showWarnAlert` removed
- `hooks/useDrawer.ts`: `openDrawer`/`closeDrawer` removed
- `hooks/useDataProvider.ts`: `saveCurrentBot`/`getCurrentBot` removed, `CURRENTBOT` constant removed, `Bot` import removed
- `components/shared/PaperStyledTabs.tsx`: removed (unused)
- `app/polyfills.ts`: removed (empty), import removed from `_layout.tsx`
