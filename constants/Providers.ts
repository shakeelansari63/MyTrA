import { Provider } from "@/models/Provider";

export const Providers: Provider[] = [
  {
    name: "Google",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/",
    icon: require("@/assets/images/google.png"),
  },
  {
    name: "OpenAI",
    url: "https://api.openai.com/v1/",
    icon: require("@/assets/images/openai.png"),
  },
  {
    name: "Anthropic",
    url: "https://api.anthropic.com/v1/",
    icon: require("@/assets/images/anthropic.png"),
  },
  {
    name: "Deepseek",
    url: "https://api.deepseek.com/v1",
    icon: require("@/assets/images/deepseek.png"),
  },
  {
    name: "Other",
    url: null,
    icon: require("@/assets/images/other-provider.png"),
  },
];
