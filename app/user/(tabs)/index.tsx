import { Button, ScrollView, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import PortfolioSummary from "@/components/dashbaord/PortfolioSummary";
import EmptyPortfolio from "@/components/dashbaord/Emptyportfolio";



function Dashboard() {
    const hasPortfolio = true;

    return (
        <View className={twMerge(["flex-1", "bg-background-default", "p-[30px]"])}>
            <ScrollView className="flex-1" contentContainerClassName="flex-grow">
                <View className="flex-1 justify-between">
                    <View>
                        <Text
                            className={twMerge(
                                ["text-3xl", "font-pretendard-bold", "text-text-default"],
                                ["py-5"],
                            )}>
                            안녕하세요
                        </Text>
                    </View>

                    {hasPortfolio ? <PortfolioSummary /> : <EmptyPortfolio />}

                    <View>
                        <Button variant="solid" color="primary">
                            + 포트폴리오 만들기
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default Dashboard;
