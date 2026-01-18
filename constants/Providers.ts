import { Provider } from "@/models/Provider";

export const Providers: Provider[] = [
    {
        name: "Google",
        url: "https://www.google.com",
        icon: "@/assets/images/google.png",
    },
    {
        name: "OpenAI",
        url: "https://chat.openai.com/",
        icon: "@/assets/images/openai.png",
    },
    {
        name: "Anthropic",
        url: "https://www.anthropic.com/",
        icon: "@/assets/images/anthropic.png",
    },
    {
        name: "Deepseek",
        url: "https://www.deepseek.com/",
        icon: "@/assets/images/deepseek.png",
    },
    {
        name: "Other",
        url: null,
        icon: "@/assets/images/other-provider.png",
    },
];
