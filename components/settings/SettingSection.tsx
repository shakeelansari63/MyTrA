import { View } from "react-native";
import { List, Card, IconButton, Icon } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";

type Props = {
  title: string;
  icon: string;
  children: React.ReactNode;
};

const SettingSection = ({ title, icon, children }: Props) => {
  const theme = useAppTheme();

  return (
    <Card style={{ marginTop: 16 }}>
      <Card.Content>
        <List.Accordion
          style={{
            backgroundColor: theme.colors.elevation.level1,
            padding: 0,
            margin: 0,
          }}
          title={title}
          left={(props) => (
            <List.Icon {...props} icon={icon || "cog-outline"} />
          )}
        >
          {children}
        </List.Accordion>
      </Card.Content>
    </Card>
  );
};

export default SettingSection;
