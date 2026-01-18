export type Message = {
    role: "assistant" | "user";
    content: string;
};

export type Chat = {
    id: string;
    messages: Message[];
};
