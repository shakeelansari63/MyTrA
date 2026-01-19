import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type Provider = {
  name: string;
  url: string | null;
  icon: IconSource | null;
};
