import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export const useDrawer = () => {
  const navigate = useNavigation();

  const toggleDrawer = () => {
    navigate.dispatch(DrawerActions.toggleDrawer());
  };

  return { toggleDrawer };
};
