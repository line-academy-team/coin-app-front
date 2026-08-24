import { ActivityIndicator, Alert, Platform, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Portfolio } from "@/types/portfolio";
import portfolioApi from "@/api/user/portfolioApi";
import MainHeader from "@/components/layout/MainHeader";

function PortfolioViewPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const portId = Number(id);

    const [selected, setSelected] = useState("전체 현황");
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const categories = ["전체 현황", "자산별", "과거 비교"];

    useEffect(() => {
        if (!portId) {
            setIsLoading(false);
            return;
        }

        const loadPortfolio = async () => {
            try {
                setIsLoading(true);
                const portfolio = await portfolioApi.getMyPortfolioById(portId);
                setPortfolio(portfolio);
            } catch (error) {
                console.log(error);
                const msg = "포트폴리오 상세 정보를 불러오는 데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadPortfolio().then(() => {});
    }, [portId]);

    return (
        <View className="flex-1 bg-background-default">
            <MainHeader title={portfolio?.title} />
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2288ED" />

                    <Text
                        className="
                            mt-3
                            text-base
                            text-text-disabled
                            font-pretendard-medium
                        ">
                        포트폴리오 정보를 불러오는 중입니다.
                    </Text>
                </View>
            ) : (
                <View></View>
            )}
        </View>
    );
}

export default PortfolioViewPage;