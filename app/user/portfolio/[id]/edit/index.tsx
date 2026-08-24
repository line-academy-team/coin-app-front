import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getCoins } from "@/api/coinApi";
import portfolioApi from "@/api/user/portfolioApi";
import CoinAvatar from "@/components/coin/CoinAvatar";
import MainHeader from "@/components/layout/MainHeader";
import { toCoinOption, toPortfolioAllocations } from "@/components/portfolio/portfolioMetrics";
import { Coin } from "@/types/coin";
import { Portfolio, PortfolioAllocation } from "@/types/portfolio";
import { useUserStore } from "@/stores/user/useUserStore";

function PortfolioEditPage() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = Number(rawId);
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [coinList, setCoinList] = useState<Coin[]>([]);
    const [title, setTitle] = useState("");
    const [seedMoney, setSeedMoney] = useState(0);
    const [allocations, setAllocations] = useState<PortfolioAllocation[]>([]);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
                    const [portfolioData, coins] = await Promise.all([
                        portfolioApi.getPortfolio(id),
                        getCoins().catch(() => []),
                    ]);

                    if (active) {
                        setPortfolio(portfolioData);
                        setCoinList(coins);
                        setTitle(portfolioData.title);
                        setSeedMoney(portfolioData.totalSeedMoney);
                        setAllocations(toPortfolioAllocations(portfolioData, coins));
                    }
                } catch {
                    if (active) {
                        setError("수정할 포트폴리오를 불러오지 못했습니다.");
                    }
                } finally {
                    if (active) {
                        setIsLoading(false);
                    }
                }
            };

            if (Number.isInteger(id) && id > 0) {
                void load();
            } else {
                setError("잘못된 포트폴리오 경로입니다.");
                setIsLoading(false);
            }

            return () => {
                active = false;
            };
        }, [id, token]),
    );

    const totalAllocation = allocations.reduce((total, item) => total + item.allocation, 0);
    const filteredCoins = useMemo(() => {
        const normalized = keyword.trim().toLowerCase();
        if (!normalized) {
            return coinList.filter(coin =>
                allocations.some(allocation => allocation.market === coin.market),
            );
        }
        return coinList
            .filter(
                coin =>
                    coin.koreanName.toLowerCase().includes(normalized) ||
                    coin.englishName.toLowerCase().includes(normalized) ||
                    coin.symbol.toLowerCase().includes(normalized),
            )
            .slice(0, 20);
    }, [allocations, coinList, keyword]);

    const toggleCoin = (coin: Coin) => {
        setAllocations(current =>
            current.some(item => item.market === coin.market)
                ? current.filter(item => item.market !== coin.market)
                : [...current, { ...toCoinOption(coin), allocation: 0 }],
        );
    };

    const setAllocation = (market: string, value: string) => {
        const allocation = Math.min(100, Number(value.replace(/[^0-9]/g, "")) || 0);
        setAllocations(current =>
            current.map(item => (item.market === market ? { ...item, allocation } : item)),
        );
    };

    const handleSeedMoneyChange = (value: string) => {
        setSeedMoney(Number(value.replace(/[^0-9]/g, "")) || 0);
    };

    const handleSave = async () => {
        if (
            !portfolio ||
            title.trim().length < 2 ||
            seedMoney < 100_000 ||
            totalAllocation !== 100
        ) {
            setError("이름, 시드머니와 코인 비중 합계를 확인해주세요.");
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            await portfolioApi.updatePortfolio(id, {
                title: title.trim(),
                totalSeedMoney: seedMoney,
                items: allocations.map(item => {
                    const existing = portfolio.coins.find(coin => coin.market === item.market);
                    const buyPrice = existing?.buyPrice || item.currentPrice;
                    return {
                        market: item.market,
                        targetRatio: item.allocation,
                        buyPrice,
                        quantity: (seedMoney * item.allocation) / 100 / buyPrice,
                    };
                }),
            });
            router.replace(`/user/portfolio/${id}` as Href);
        } catch {
            setError("포트폴리오를 수정하지 못했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0F6BFF" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <MainHeader title="포트폴리오 수정" isBackPress />
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
                <View className="w-full max-w-[560px] self-center">
                    <Text className="font-pretendard-bold text-lg text-text-default">
                        포트폴리오 이름
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        maxLength={24}
                        className="mt-3 h-16 rounded-xl border border-text-disabled px-4 font-pretendard-medium text-base text-text-default"
                    />

                    <Text className="mt-7 font-pretendard-bold text-lg text-text-default">
                        시작할 시드머니
                    </Text>
                    <View className="mt-3 h-16 flex-row items-center rounded-xl border border-text-disabled px-4">
                        <TextInput
                            value={seedMoney ? seedMoney.toLocaleString("ko-KR") : ""}
                            onChangeText={handleSeedMoneyChange}
                            keyboardType="number-pad"
                            className="flex-1 font-pretendard-bold text-xl text-text-default"
                        />
                        <Text className="font-pretendard-bold text-lg text-text-default">원</Text>
                    </View>

                    <View className="mt-7 h-14 flex-row items-center rounded-full border border-text-disabled px-4">
                        <Ionicons name="search-outline" size={24} color="#6B7280" />
                        <TextInput
                            value={keyword}
                            onChangeText={setKeyword}
                            placeholder="코인검색(예: 비트코인, btc)"
                            placeholderTextColor="#9CA3AF"
                            className="ml-2 flex-1 font-pretendard-medium text-base text-text-default"
                        />
                    </View>

                    <View className="mt-5 gap-3">
                        {filteredCoins.map(coin => {
                            const selected = allocations.find(item => item.market === coin.market);
                            return (
                                <View
                                    key={coin.market}
                                    className="rounded-2xl bg-background-deep px-4 py-4">
                                    <View className="flex-row items-center">
                                        <Pressable
                                            onPress={() => toggleCoin(coin)}
                                            className={`h-6 w-6 items-center justify-center rounded border ${
                                                selected
                                                    ? "border-primary-main bg-primary-main"
                                                    : "border-text-secondary bg-white"
                                            }`}>
                                            {selected && (
                                                <Text className="font-pretendard-bold text-white">
                                                    ✓
                                                </Text>
                                            )}
                                        </Pressable>
                                        <View className="ml-3">
                                            <CoinAvatar symbol={coin.symbol} size={42} />
                                        </View>
                                        <View className="ml-3 flex-1">
                                            <Text className="font-pretendard-bold text-base text-text-default">
                                                {coin.koreanName}
                                            </Text>
                                            <Text className="font-pretendard-medium text-xs text-text-secondary">
                                                {coin.symbol}
                                            </Text>
                                        </View>
                                        {selected && (
                                            <View className="h-12 w-20 flex-row items-center rounded-xl bg-white px-2">
                                                <TextInput
                                                    value={String(selected.allocation)}
                                                    onChangeText={value =>
                                                        setAllocation(coin.market, value)
                                                    }
                                                    keyboardType="number-pad"
                                                    maxLength={3}
                                                    className="flex-1 text-right font-pretendard-bold text-lg text-text-default"
                                                />
                                                <Text className="font-pretendard-bold text-text-default">
                                                    %
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    {selected && (
                                        <View className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                                            <View
                                                className="h-full rounded-full bg-primary-main"
                                                style={{ width: `${selected.allocation}%` }}
                                            />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    <View className="mt-5 flex-row items-center justify-between rounded-2xl border border-divider px-5 py-5">
                        <Text className="font-pretendard-bold text-lg text-text-secondary">
                            전체비율
                        </Text>
                        <Text
                            className={`font-pretendard-bold text-xl ${
                                totalAllocation === 100 ? "text-text-default" : "text-error-main"
                            }`}>
                            {totalAllocation}%
                        </Text>
                    </View>

                    {error && (
                        <Text className="mt-4 text-center font-pretendard-medium text-error-main">
                            {error}
                        </Text>
                    )}
                </View>
            </ScrollView>

            <View className="flex-row gap-3 border-t border-divider px-5 py-3">
                <Pressable
                    disabled={isSaving}
                    onPress={() => router.back()}
                    className="h-14 flex-1 items-center justify-center rounded-xl border border-primary-main">
                    <Text className="font-pretendard-bold text-lg text-primary-main">취소</Text>
                </Pressable>
                <Pressable
                    disabled={isSaving || totalAllocation !== 100}
                    onPress={() => void handleSave()}
                    className={`h-14 flex-1 items-center justify-center rounded-xl ${
                        totalAllocation === 100 ? "bg-primary-main" : "bg-divider"
                    }`}>
                    <Text className="font-pretendard-bold text-lg text-white">
                        {isSaving ? "저장 중..." : "저장"}
                    </Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

export default PortfolioEditPage;
