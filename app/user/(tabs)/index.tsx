import { Text, View, Image, Pressable, ScrollView } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/common/button/Button";
import { CalculatedPortfolio, Portfolio } from "@/types/portfolio";
import portfolioApi from "@/api/user/portfolioApi";
import { getCoins } from "@/api/coinApi";
import CalcUtils from "@/utils/CalcUtils";
import { twMerge } from "tailwind-merge";

function Dashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [portfolios, setPortfolios] = useState<CalculatedPortfolio[]>([]);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            const fetchPortfolios = async () => {
                try {
                    const [portfolioData, upbitData] = await Promise.all([
                        portfolioApi.getMyPortfolios(),
                        getCoins(),
                    ]);

                    if (isMounted) {
                        const calculatedPortfolios = CalcUtils.calculatePortfolioReturns(
                            portfolioData,
                            upbitData,
                        );
                        setPortfolios(calculatedPortfolios);
                    }
                } catch (error) {
                    console.error("포트폴리오 목록 조회 실패:", error);
                } finally {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }
            };

            fetchPortfolios().then(() => {});

            return () => {
                isMounted = false;
            };
        }, []),
    );

    // --- 1. 포트폴리오가 없을 때의 화면 ---
    const renderEmptyState = () => (
        <View className="mt-6 flex-1">
            <Image
                source={require("@/assets/images/dashboard/b00f218fd7b59d7b842ad39f6354dde5b704a606.png")}
                style={{ width: "100%", height: 180, marginBottom: 32 }}
                resizeMode="contain"
            />

            <View className="gap-4">
                <View
                    className={twMerge(
                        ["flex-row", "gap-3", "items-center"],
                        ["p-2", "rounded-xl"],
                        ["border", "border-secondary-main", "bg-background-paper"],
                    )}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-11", "h-11", "rounded-xl", "bg-secondary-main"],
                        )}>
                        <Ionicons name="trending-up" size={24} color="#FFFFFF" />
                    </View>

                    <Text
                        className={twMerge([
                            "font-pretendard-semibold",
                            "text-xl",
                            "text-text-default",
                        ])}>
                        실제 투자 없이 시뮬레이션
                    </Text>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "gap-3", "items-center"],
                        ["p-2", "rounded-xl"],
                        ["border", "border-secondary-chart", "bg-background-paper"],
                    )}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-11", "h-11", "rounded-xl", "bg-secondary-chart"],
                        )}>
                        <AntDesign name="dollar" size={24} color="#FFFFFF" />
                    </View>

                    <Text
                        className={twMerge([
                            "font-pretendard-semibold",
                            "text-xl",
                            "text-text-default",
                        ])}>
                        다양한 코인으로 포트폴리오 구성
                    </Text>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "gap-3", "items-center"],
                        ["p-2", "rounded-xl"],
                        ["border", "border-warning-main", "bg-background-paper"],
                    )}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-11", "h-11", "rounded-xl", "bg-warning-main"],
                        )}>
                        <Ionicons name="bar-chart" size={24} color="#FFFFFF" />
                    </View>

                    <Text
                        className={twMerge([
                            "font-pretendard-semibold",
                            "text-xl",
                            "text-text-default",
                        ])}>
                        과거 데이터를 통한 수익률 확인
                    </Text>
                </View>
            </View>
        </View>
    );

    // --- 2. 포트폴리오가 있을 때의 화면 ---
    const renderPopulatedState = () => {
        const totalInvestment = portfolios.reduce((sum, p) => sum + p.totalSeedMoney, 0);
        const currentTotalAssets = portfolios.reduce((sum, p) => sum + p.currentTotalValue, 0);
        const totalProfitLoss = currentTotalAssets - totalInvestment;
        const overallReturnRate =
            totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

        return (
            <View className="mt-4 flex-1">
                <View className="bg-[#1A73E8] rounded-2xl p-5 relative overflow-hidden">
                    <Text className="text-blue-100 font-pretendard text-sm mb-1">총 자산</Text>
                    <Text className="text-white font-pretendard-bold text-3xl mb-4">
                        ₩{currentTotalAssets.toLocaleString()}
                    </Text>

                    <View className="flex-row items-center mb-1">
                        <Text className="text-blue-100 font-pretendard text-xs w-[60px]">
                            평가손익
                        </Text>
                        <Text className="text-white font-pretendard-bold text-sm">
                            {totalProfitLoss > 0 ? "+" : ""}₩{totalProfitLoss.toLocaleString()}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-blue-100 font-pretendard text-xs w-[60px]">
                            수익률
                        </Text>
                        <View className="bg-blue-400/50 rounded-full px-2 py-0.5">
                            <Text className="text-white font-pretendard-bold text-xs">
                                {overallReturnRate > 0 ? "+" : ""}
                                {overallReturnRate.toFixed(2)}%
                            </Text>
                        </View>
                    </View>

                    <Image
                        source={require("@/assets/images/welcome/a7b6abd48871456077a8818d2955ed94772f99ec.png")}
                        className="absolute -right-4 -bottom-4 w-[120px] h-[120px]"
                        resizeMode="contain"
                    />
                </View>

                <View className="flex-row justify-between mt-4">
                    <View className="flex-1 bg-white border border-[#06B6D4] rounded-xl p-3 flex-row items-center justify-center mr-2">
                        <Ionicons name="briefcase" size={20} color="#06B6D4" className="mr-2" />
                        <View>
                            <Text className="text-gray-500 text-[10px] font-pretendard">
                                포트폴리오
                            </Text>
                            <Text className="text-gray-800 text-xs font-pretendard-bold">
                                {portfolios.length}개
                            </Text>
                        </View>
                    </View>
                    {/* TODO : 관심코인 갯수, 오늘 변동 수정해야 함 */}
                    <View className="flex-1 bg-white border border-[#F59E0B] rounded-xl p-3 flex-row items-center justify-center mr-2">
                        <Ionicons name="star" size={20} color="#F59E0B" className="mr-2" />
                        <View>
                            <Text className="text-gray-500 text-[10px] font-pretendard">
                                관심코인
                            </Text>
                            <Text className="text-gray-800 text-xs font-pretendard-bold">5개</Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-white border border-[#8B5CF6] rounded-xl p-3 flex-row items-center justify-center">
                        <Ionicons name="trending-up" size={20} color="#3B82F6" className="mr-2" />
                        <View>
                            <Text className="text-gray-500 text-[10px] font-pretendard">
                                오늘 변동
                            </Text>
                            <Text className="text-gray-800 text-xs font-pretendard-bold">
                                +1.2%
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mt-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-800 font-pretendard-bold text-lg">
                            내 포트폴리오
                        </Text>
                        <Pressable>
                            <Text className="text-[#1A73E8] font-pretendard text-sm">
                                전체보기 {">"}
                            </Text>
                        </Pressable>
                    </View>

                    {portfolios.map(portfolio => (
                        <View
                            key={portfolio.id}
                            className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm">
                            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4">
                                <Ionicons name={portfolio.icon} size={24} color="#1A73E8" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 font-pretendard text-xs mb-1">
                                    {portfolio.title}
                                </Text>
                                <Text className="text-gray-800 font-pretendard-bold text-[16px]">
                                    {portfolio.totalSeedMoney.toLocaleString()}원
                                </Text>
                                <Text className="text-gray-400 font-pretendard text-[10px] mt-1">
                                    {portfolio.tags}
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-[#10B981] font-pretendard-bold text-sm mb-1">
                                    +{portfolio.returnRate}% {">"}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background-default p-[30px]">
            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-2">
                    <Text className="text-3xl font-pretendard-bold text-text-default py-5">
                        안녕하세요
                    </Text>
                    <Text
                        className={twMerge([
                            "text-text-secondary",
                            "font-pretendard-semibold",
                            "text-base",
                        ])}>
                        {portfolios.length === 0
                            ? "지금이 바로 시작할 시간이에요.\n나만의 가상 포트폴리오를 만들어보세요."
                            : "오늘의 포트폴리오 현황을 확인해보세요"}
                    </Text>
                </View>

                {portfolios.length === 0 ? renderEmptyState() : renderPopulatedState()}

                <View className="absolute bottom-0 left-0 right-0 bg-[#F8FAFC]">
                    <Button
                        variant={"solid"}
                        color={"primary"}
                        onPress={() => router.push("/user/portfolio/create")}>
                        + 포트폴리오 만들기
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Dashboard;
