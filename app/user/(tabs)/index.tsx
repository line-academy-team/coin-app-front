import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Href, router, useFocusEffect } from "expo-router";

import { getCoins } from "@/api/coinApi";
import portfolioApi from "@/api/user/portfolioApi";
import Button from "@/components/common/button/Button";
import { useFavoriteCoinStore } from "@/stores/coin/useFavoriteCoinStore";
import { useUserStore } from "@/stores/user/useUserStore";
import { CalculatedPortfolio } from "@/types/portfolio";
import CalcUtils from "@/utils/CalcUtils";

function FeatureCard({
    color,
    icon,
    children,
}: {
    color: string;
    icon: keyof typeof Ionicons.glyphMap;
    children: string;
}) {
    return (
        <View
            className="flex-row items-center rounded-xl border bg-white p-2"
            style={{ borderColor: color }}>
            <View
                className="h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: color }}>
                <Ionicons name={icon} size={25} color="#FFFFFF" />
            </View>
            <Text className="ml-3 flex-1 font-pretendard-semibold text-lg text-text-default">
                {children}
            </Text>
        </View>
    );
}

function DashboardPage() {
    const [portfolios, setPortfolios] = useState<CalculatedPortfolio[]>([]);
    const [dailyChange, setDailyChange] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const favoriteCount = useFavoriteCoinStore(state => state.markets.length);
    const token = useUserStore(state => state.token);

    useFocusEffect(
        useCallback(() => {
            if (!token) {
                return;
            }

            let active = true;
            const load = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const [portfolioData, coinData] = await Promise.all([
                        portfolioApi.getMyPortfolios(),
                        getCoins().catch(() => []),
                    ]);
                    if (!active) {
                        return;
                    }
                    setPortfolios(CalcUtils.calculatePortfolioReturns(portfolioData, coinData));
                    const heldMarkets = new Set(
                        portfolioData.flatMap(portfolio =>
                            portfolio.coins.map(coin => coin.market),
                        ),
                    );
                    const heldCoins = coinData.filter(coin => heldMarkets.has(coin.market));
                    setDailyChange(
                        heldCoins.length
                            ? heldCoins.reduce((total, coin) => total + coin.changeRate, 0) /
                                  heldCoins.length
                            : 0,
                    );
                } catch {
                    if (active) {
                        setError("포트폴리오 현황을 불러오지 못했습니다.");
                    }
                } finally {
                    if (active) {
                        setIsLoading(false);
                    }
                }
            };
            void load();
            return () => {
                active = false;
            };
        }, [token]),
    );

    const totalInvestment = portfolios.reduce((sum, item) => sum + item.totalSeedMoney, 0);
    const currentAssets = portfolios.reduce((sum, item) => sum + item.currentTotalValue, 0);
    const profit = currentAssets - totalInvestment;
    const returnRate = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;

    return (
        <View className="flex-1 bg-background-default">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 28,
                    paddingBottom: 94,
                }}>
                <View className="w-full max-w-[560px] self-center">
                    <Text className="font-pretendard-bold text-4xl text-text-default">
                        안녕하세요
                    </Text>
                    <Text className="mt-5 font-pretendard-semibold text-lg leading-7 text-text-secondary">
                        {portfolios.length === 0
                            ? "지금이 바로 시작할 시간이에요.\n나만의 가상 포트폴리오를 만들어보세요."
                            : "오늘의 포트폴리오 현황을 확인해보세요"}
                    </Text>

                    {isLoading ? (
                        <View className="h-80 items-center justify-center">
                            <ActivityIndicator size="large" color="#0F6BFF" />
                        </View>
                    ) : error ? (
                        <View className="mt-8 rounded-2xl bg-error-light px-5 py-5">
                            <Text className="text-center font-pretendard-medium text-error-main">
                                {error}
                            </Text>
                        </View>
                    ) : portfolios.length === 0 ? (
                        <View className="mt-3">
                            <Image
                                source={require("@/assets/images/main/main_page_img.png")}
                                style={{ width: "100%", height: 260 }}
                                resizeMode="contain"
                            />
                            <View className="gap-4">
                                <FeatureCard color="#11B5D0" icon="swap-horizontal">
                                    실제 투자 없이 시뮬레이션
                                </FeatureCard>
                                <FeatureCard color="#4F7CFF" icon="logo-bitcoin">
                                    다양한 코인으로 포트폴리오 구성
                                </FeatureCard>
                                <FeatureCard color="#F59E0B" icon="bar-chart">
                                    과거 데이터를 통한 수익률 확인
                                </FeatureCard>
                            </View>
                        </View>
                    ) : (
                        <View className="mt-7">
                            <View className="overflow-hidden rounded-2xl bg-[#1368E8] px-5 py-5">
                                <Text className="font-pretendard-medium text-blue-100">
                                    총 자산
                                </Text>
                                <Text className="mt-1 font-pretendard-bold text-3xl text-white">
                                    ₩{Math.round(currentAssets).toLocaleString("ko-KR")}
                                </Text>
                                <Text className="mt-4 font-pretendard-medium text-sm text-blue-100">
                                    평가손익　
                                    <Text className="font-pretendard-bold text-white">
                                        {profit >= 0 ? "+" : ""}₩
                                        {Math.round(profit).toLocaleString("ko-KR")}
                                    </Text>
                                </Text>
                                <Text className="mt-2 font-pretendard-medium text-sm text-blue-100">
                                    수익률　
                                    <Text className="font-pretendard-bold text-white">
                                        {returnRate >= 0 ? "+" : ""}
                                        {returnRate.toFixed(2)}%
                                    </Text>
                                </Text>
                                <Image
                                    source={require("@/assets/images/welcome/a7b6abd48871456077a8818d2955ed94772f99ec.png")}
                                    style={{
                                        position: "absolute",
                                        bottom: 25,
                                        right: 15,
                                        width: 158,
                                        height: 105,
                                        zIndex: 10,
                                    }}
                                    resizeMode="contain"
                                />
                            </View>

                            <View className="mt-4 flex-row gap-2">
                                <View className="flex-1 flex-row items-center justify-center rounded-xl border border-secondary-main bg-white py-4">
                                    <Ionicons name="briefcase" size={22} color="#11B5D0" />
                                    <View className="ml-2">
                                        <Text className="font-pretendard-medium text-xs text-text-secondary">
                                            포트폴리오
                                        </Text>
                                        <Text className="font-pretendard-bold text-text-default">
                                            {portfolios.length}개
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-1 flex-row items-center justify-center rounded-xl border border-warning-main bg-white py-4">
                                    <Ionicons name="star" size={22} color="#F59E0B" />
                                    <View className="ml-2">
                                        <Text className="font-pretendard-medium text-xs text-text-secondary">
                                            관심코인
                                        </Text>
                                        <Text className="font-pretendard-bold text-text-default">
                                            {favoriteCount}개
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-1 flex-row items-center justify-center rounded-xl border border-[#8B5CF6] bg-white py-4">
                                    <AntDesign name="line-chart" size={22} color="#4F7CFF" />
                                    <View className="ml-2">
                                        <Text className="font-pretendard-medium text-xs text-text-secondary">
                                            오늘 변동
                                        </Text>
                                        <Text className="font-pretendard-bold text-text-default">
                                            {dailyChange >= 0 ? "+" : ""}
                                            {dailyChange.toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="mb-4 mt-8 flex-row items-center justify-between">
                                <Text className="font-pretendard-bold text-2xl text-text-default">
                                    내 포트폴리오
                                </Text>
                                <Pressable onPress={() => router.push("/user/portfolio" as Href)}>
                                    <Text className="font-pretendard-bold text-primary-main">
                                        전체보기 〉
                                    </Text>
                                </Pressable>
                            </View>
                            {portfolios.slice(0, 2).map(portfolio => (
                                <Pressable
                                    key={portfolio.id}
                                    onPress={() =>
                                        router.push(`/user/portfolio/${portfolio.id}` as Href)
                                    }
                                    className="mb-3 flex-row items-center rounded-2xl bg-white px-4 py-4">
                                    <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-light">
                                        <Ionicons
                                            name="shield-checkmark"
                                            size={25}
                                            color="#0F6BFF"
                                        />
                                    </View>
                                    <View className="ml-4 flex-1">
                                        <Text className="font-pretendard-bold text-base text-text-default">
                                            {portfolio.title}
                                        </Text>
                                        <Text className="mt-1 font-pretendard-medium text-xs text-text-secondary">
                                            {CalcUtils.getPortfolioTags(portfolio)}
                                        </Text>
                                    </View>
                                    <Text
                                        className={`font-pretendard-bold ${portfolio.returnRate >= 0 ? "text-success-main" : "text-error-main"}`}>
                                        {portfolio.returnRate >= 0 ? "+" : ""}
                                        {portfolio.returnRate.toFixed(1)}%
                                    </Text>
                                    <Ionicons name="chevron-forward" size={18} color="#111827" />
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full self-center"
                style={{ maxWidth: 560 }}>
                <Button onPress={() => router.push("/user/portfolio/create" as Href)}>
                    + 포트폴리오 만들기
                </Button>
            </View>
        </View>
    );
}

export default DashboardPage;
