import TopAppBar from "@/components/shared/TopAppBar";
import TitleWithIcon from "@/components/shared/TitleWithIcon";
import { useDrawer } from "@/hooks/useDrawer";
import HistoryPage from "@/components/history/HistoryPage";

const HistoryPageWrapper = () => {
    const { toggleDrawer } = useDrawer();
    return (
        <>
            <TopAppBar
                leftComponent={
                    <TitleWithIcon title="Past Chats" showIcon={true} />
                }
                onTitlePressed={toggleDrawer}
            />
            <HistoryPage />
        </>
    );
};

export default HistoryPageWrapper;
