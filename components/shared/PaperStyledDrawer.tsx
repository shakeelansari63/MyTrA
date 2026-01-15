import Drawer from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Icon, Text } from "react-native-paper";
import { View } from "react-native";
import TitleWithIcon from "./TitleWithIcon";
import AppAvatar from "./AppAvatar";
import * as Linking from "expo-linking";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EXTERNAL_LINKS } from "@/constants/Links";

export type DrawerItemInfo = {
  key: string;
  label: string;
  headerTitle: string;
  showHeaderIcon: boolean;
  icon: string;
};

type Props = {
  drawerItems: DrawerItemInfo[];
};

const openUrl = async (url: string) => {
  const isUrlSupported = await Linking.canOpenURL(url);

  if (isUrlSupported) await Linking.openURL(url);
};

const StyledDrawer = (props: DrawerContentComponentProps) => {
  const safeInsets = useSafeAreaInsets();

  return (
    <>
      <DrawerContentScrollView {...props}>
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
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Add Extra Items at bottom*/}
      <DrawerItem
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
    <Drawer drawerContent={StyledDrawer}>
      {drawerItems.map((item) => (
        <Drawer.Screen
          key={item.key}
          name={item.key}
          options={{
            drawerLabel: item.label,
            title: item.headerTitle,
            drawerIcon: ({ color, size }) => (
              <Icon source={item.icon} size={size} color={color} />
            ),
            headerTitle: () => (
              <TitleWithIcon
                title={item.headerTitle}
                showIcon={item.showHeaderIcon}
              />
            ),
          }}
        />
      ))}
    </Drawer>
  );
};

export default PaperStyledDrawer;
