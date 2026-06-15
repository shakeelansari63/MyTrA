export type Message = {
    role: "assistant" | "user";
    content: string;
};

export type Chat = {
    id: string;
    messages: Message[];
    name: string;
    botName: string;
    botId: string;
    botType: "llm" | "agent";
    createdAt: number;
    updatedAt: number;
};
