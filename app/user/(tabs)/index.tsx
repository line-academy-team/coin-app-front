import { ScrollView, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

 function Dashboard() {
    return (
        <View className={twMerge(["flex-1", "bg-background-default", "p-[30px]"])}>
            <ScrollView>
                <Text className={twMerge([""])}>안녕하세요</Text>
            </ScrollView>
        </View>
    );
}

export default Dashboard;
