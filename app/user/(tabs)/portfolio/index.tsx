import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Href, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getCoins } from "@/api/coinApi";
import portfolioApi from "@/api/user/portfolioApi";
import Button from "@/components/common/button/Button";
import MainHeader from "@/components/layout/MainHeader";
import { useUserStore } from "@/stores/user/useUserStore";
import CalcUtils from "@/utils/CalcUtils";
import { CalculatedPortfolio } from "@/types/portfolio";

const cardIcons: (keyof typeof Ionicons.glyphMap)[] = [
    "shield-checkmark",
    "rocket",
    "trending-up",
    "diamond",
];

function PortfolioListPage() {
    const [portfolios, setPortfolios] = useState<CalculatedPortfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

                    if (active) {
                        setPortfolios(CalcUtils.calculatePortfolioReturns(portfolioData, coinData));
                    }
                } catch {
                    if (active) {
                        setError("포트폴리오 목록을 불러오지 못했습니다.");
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

    return (
        <View className="flex-1 bg-background-default">
            <MainHeader title="내 포트폴리오" />

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0F6BFF" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 104 }}>
                    <View className="w-full max-w-[560px] self-center gap-3">
                        {error && (
                            <View className="rounded-2xl bg-error-light px-4 py-4">
                                <Text className="text-center font-pretendard-medium text-error-main">
                                    {error}
                                </Text>
                            </View>
                        )}

                        {!error && portfolios.length === 0 && (
                            <View className="items-center rounded-2xl bg-white px-6 py-16">
                                <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
                                <Text className="mt-4 font-pretendard-bold text-lg text-text-default">
                                    아직 포트폴리오가 없습니다
                                </Text>
                                <Text className="mt-2 text-center font-pretendard text-sm text-text-secondary">
                                    첫 가상 투자 포트폴리오를 만들어보세요.
                                </Text>
                            </View>
                        )}

                        {portfolios.map((portfolio, index) => {
                            const isPositive = portfolio.returnRate >= 0;
                            const tags = CalcUtils.getPortfolioTags(portfolio);

                            return (
                                <Pressable
                                    key={portfolio.id}
                                    onPress={() =>
                                        router.push(`/user/portfolio/${portfolio.id}` as Href)
                                    }
                                    className="rounded-2xl bg-white px-5 py-5 active:opacity-80">
                                    <View className="flex-row items-center">
                                        <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                                            <Ionicons
                                                name={cardIcons[index % cardIcons.length]}
                                                size={28}
                                                color="#0F6BFF"
                                            />
                                        </View>
                                        <View className="ml-4 flex-1">
                                            <Text className="font-pretendard-bold text-xl text-text-default">
                                                {portfolio.title}
                                            </Text>
                                            <View className="mt-1 flex-row items-center justify-between">
                                                <Text className="font-pretendard-medium text-base text-text-secondary">
                                                    {portfolio.totalSeedMoney.toLocaleString(
                                                        "ko-KR",
                                                    )}
                                                    원
                                                </Text>
                                                <Text
                                                    className={`font-pretendard-bold text-base ${
                                                        isPositive
                                                            ? "text-success-main"
                                                            : "text-error-main"
                                                    }`}>
                                                    {isPositive ? "+" : ""}
                                                    {portfolio.returnRate.toFixed(1)}%
                                                </Text>
                                            </View>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color="#111827"
                                            style={{ marginLeft: 8 }}
                                        />
                                    </View>
                                    <View className="mt-4 h-px bg-divider" />
                                    <Text className="mt-3 font-pretendard-medium text-sm text-text-secondary">
                                        {tags || "선택한 자산 정보 없음"}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            )}

            <View
                className="absolute bottom-4 left-5 right-5 self-center"
                style={{ maxWidth: 560 }}>
                <Button onPress={() => router.push("/user/portfolio/create" as Href)}>
                    포트폴리오 만들기
                </Button>
            </View>
        </View>
    );
}

export default PortfolioListPage;
