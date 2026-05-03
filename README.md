# MyTrA - Your AI Assistant, Built in Your Pocket

A powerful cross-platform mobile app built with Expo that lets you connect LLMs, MCP servers, and build AI agents — **without writing a single line of code**.

## Features

- **Multi-LLM Support**: Connect to Google, OpenAI, Anthropic, Deepseek, or any OpenAI-compatible provider
- **MCP Server Integration**: Connect to Model Context Protocol servers to extend your agent's capabilities
- **No-Code Agent Builder**: Create custom AI agents with specific roles, tasks, and tool access — all through a visual interface
- **Real-time Chat**: Conversations powered by LangChain for robust AI interactions
- **Chat History**: Access and revisit your past conversations anytime
- **Dark & Light Mode**: Automatic theme switching that adapts to your system preferences
- **Cross-Platform**: Runs on iOS, Android, and Web from a single codebase

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router + React Navigation (Drawer + Bottom Tabs)
- **AI/LLM**: LangChain + LangChain OpenAI
- **UI**: React Native Paper, @gorhom/bottom-sheet
- **Storage**: Async Storage
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (for mobile testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/shakeelansari63/mytra.git
cd mytra

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Devices

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web

# Expo Go (scan QR code from terminal)
npm start
```

## App Screens

| Screen | Description |
|--------|-------------|
| **Chat** | Main chat interface for interacting with your agents |
| **LLMs** | Add and manage LLM provider connections (API keys, models, endpoints) |
| **MCP Servers** | Configure MCP server connections for extended tool capabilities |
| **Agents** | Build custom agents by combining LLMs, MCP servers, roles, and tasks |
| **Past Chats** | Browse and resume your conversation history |

## Configuration

### Adding an LLM Provider

Navigate to the **LLMs** screen and provide:
- **Provider**: Choose from Google, OpenAI, Anthropic, Deepseek, or Other
- **API Key**: Your provider's API key
- **Model**: The model name (e.g., `gpt-4o`, `claude-3-5-sonnet-20241022`)
- **Custom URL** (optional): For "Other" providers or self-hosted instances

### Connecting MCP Servers

Navigate to the **MCP Servers** screen and provide:
- **Server Name**: A friendly name for your server
- **URL**: The MCP server endpoint
- **API Key** (optional): Authentication key if required
- **Transport**: Communication protocol

### Building an Agent

Navigate to the **Agents** screen and configure:
- **Agent Name**: A unique name for your agent
- **LLM**: Select a connected LLM provider
- **MCP Servers**: Select one or more MCP servers for tool access
- **Role**: Define the agent's role/persona
- **Task Detail**: Provide specific instructions and context

## Project Structure

```
mytra/
├── app/                   # Expo Router screens
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Home/Chat screen
│   ├── llms.tsx           # LLM provider management
│   ├── mcps.tsx           # MCP server management
│   ├── agents.tsx         # Agent builder
│   └── history.tsx        # Chat history
├── components/            # UI components
│   ├── agent/             # Agent builder components
│   ├── home/              # Chat page components
│   ├── llm/               # LLM setup components
│   ├── mcp/               # MCP setup components
│   ├── history/           # History page components
│   └── shared/            # Shared UI components
├── services/              # Business logic
│   ├── ChatService.ts     # LLM chat orchestration
│   ├── DataService.ts     # Data persistence
│   └── ThemeService.ts    # Theme management
├── models/                # TypeScript type definitions
│   ├── Agent.ts           # Agent model
│   ├── Chat.ts            # Chat model
│   ├── LLMDetail.ts       # LLM configuration model
│   ├── MCPServer.ts       # MCP server model
│   └── Provider.ts        # LLM provider model
├── constants/             # App constants
│   ├── Colors.ts          # Theme colors
│   ├── Links.ts           # External links
│   └── Providers.ts       # Supported LLM providers
├── hooks/                 # Custom React hooks
└── context/               # React context providers
```

## Build & Deploy

### Using EAS Build

```bash
# Install EAS CLI
npm run eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## License

Private

## Author

[Shakeel Ansari](https://github.com/shakeelansari63)
