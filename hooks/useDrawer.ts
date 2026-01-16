import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export const useDrawer = () => {
  const navigate = useNavigation();

  // Method to open drawer
  const openDrawer = () => {
    navigate.dispatch(DrawerActions.openDrawer());
  };

  // method to close drawer
  const closeDrawer = () => {
    navigate.dispatch(DrawerActions.closeDrawer());
  };

  // method to toggle drawer
  const toggleDrawer = () => {
    navigate.dispatch(DrawerActions.toggleDrawer());
  };

  return { openDrawer, closeDrawer, toggleDrawer };
};
