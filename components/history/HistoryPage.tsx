import { Text } from "react-native-paper";
import React from "react";
import SafeScrollView from "@/components/shared/SafeScrollView";

const HistoryPage = () => {
    return (
        <SafeScrollView extraXPadding={true} unsafeTop={true}>
            <Text>HistoryPage</Text>
        </SafeScrollView>
    );
};

export default HistoryPage;
