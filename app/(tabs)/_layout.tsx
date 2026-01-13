import { Tabs } from "expo-router";
import React from "react";
import { Easing, Platform } from "react-native";
import { Icon, useTheme, Text, BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  const theme = useTheme();

  const tabs = [
    {
      key: "index",
      title: "Home",
      iconInactive: "home-outline",
      iconActive: "home",
    },
    {
      key: "settings",
      title: "Settings",
      iconInactive: "cog-outline",
      iconActive: "cog",
    },
  ];

  return (
    <Tabs
      detachInactiveScreens={true}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) =>
            descriptors[route.key].options.tabBarIcon?.({
              focused,
              color,
              size: 24,
            }) || null
          }
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : typeof options.title === "string"
                  ? options.title
                  : route.name;

            return label;
          }}
          animationEasing={Easing.in(Easing.elastic(2))}
        />
      )}
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.key}
          name={tab.key}
          options={{
            title: tab.title,
            tabBarIcon: ({ size, focused }) => (
              <Icon
                size={size}
                source={focused ? tab.iconActive : tab.iconInactive}
                color={
                  focused
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onBackground
                }
              />
            ),
            tabBarLabel: ({ children, focused }) => (
              <Text
                variant="labelMedium"
                style={{
                  color: focused
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onBackground,
                }}
              >
                {children}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
