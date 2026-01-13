import PaperStyledTabs, {
  PaperStyledTabInfo,
} from "@/components/shared/PaperStyledTabs";

export default function TabLayout() {
  const tabs: PaperStyledTabInfo[] = [
    {
      key: "index",
      title: "MyTrA",
      iconInactive: "robot-excited-outline",
      iconActive: "robot-excited",
    },
    {
      key: "settings",
      title: "Settings",
      iconInactive: "cog-outline",
      iconActive: "cog",
    },
  ];

  return <PaperStyledTabs tabs={tabs} />;
}
