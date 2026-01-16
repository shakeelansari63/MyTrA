import Drawer from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Icon, Text, Drawer as PaperDrawer } from "react-native-paper";
import { View } from "react-native";
import AppAvatar from "./AppAvatar";
import * as Linking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EXTERNAL_LINKS } from "@/constants/Links";

export type DrawerItemInfo = {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
};

export type DrawerItemsInSections = {
  root: DrawerItemInfo[];
  sections: {
    title: string;
    items: DrawerItemInfo[];
  }[];
};

type Props = {
  drawerItems: DrawerItemsInSections;
};

const openUrl = async (url: string) => {
  const isUrlSupported = await Linking.canOpenURL(url);

  if (isUrlSupported) await Linking.openURL(url);
};

type StyledDrawerProps = {
  drawerProps: DrawerContentComponentProps;
  drawerItems: DrawerItemsInSections;
};

const StyledDrawer = ({ drawerProps, drawerItems }: StyledDrawerProps) => {
  const safeInsets = useSafeAreaInsets();

  return (
    <>
      <DrawerContentScrollView {...drawerProps}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AppAvatar size={96} />
          <View>
            <Text variant="headlineLarge">MyTrA</Text>
            <Text variant="bodySmall">My True Assistant</Text>
          </View>
        </View>

        {/* Show Root Items */}
        {drawerItems.root.map((item) => (
          <PaperDrawer.Item
            key={item.key}
            label={item.label}
            icon={item.icon}
            onPress={item.onPress}
          />
        ))}

        {/* Show Items in Section */}
        {drawerItems.sections.map((section) => (
          <PaperDrawer.Section
            key={section.title}
            title={section.title}
            showDivider={false}
          >
            {section.items.map((item) => (
              <PaperDrawer.Item
                key={item.key}
                label={item.label}
                icon={item.icon}
                onPress={item.onPress}
              />
            ))}
          </PaperDrawer.Section>
        ))}
      </DrawerContentScrollView>

      {/* Add Extra Items at bottom*/}
      <PaperDrawer.Item
        label="Star us on Github"
        style={{ marginTop: "auto", marginBottom: safeInsets.bottom + 5 }}
        icon={({ color, size }) => (
          <Icon source="github" size={size} color={color} />
        )}
        onPress={() => openUrl(EXTERNAL_LINKS.github)}
      />
    </>
  );
};

const PaperStyledDrawer = ({ drawerItems }: Props) => {
  return (
    <Drawer
      drawerContent={(props) => (
        <StyledDrawer drawerProps={props} drawerItems={drawerItems} />
      )}
      screenOptions={{ headerShown: false }}
    />
  );
};

export default PaperStyledDrawer;
