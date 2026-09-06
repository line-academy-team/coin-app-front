import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { getCoin, getCoinTicker } from "@/api/coinApi";
import CoinAvatar from "@/components/coin/CoinAvatar";
import CoinChart from "@/components/coin/CoinChart";
import CoinInfo from "@/components/coin/CoinInfo";
import Button from "@/components/common/button/Button";
import { useFavoriteCoinStore } from "@/stores/coin/useFavoriteCoinStore";
import { CoinDetail, RealtimePricePoint } from "@/types/coin";

type TabType = "info" | "chart";

const formatKRW = (value: number) =>
    `₩${value.toLocaleString("ko-KR", {
        maximumFractionDigits: value < 1 ? 8 : value < 100 ? 4 : 0,
    })}`;

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map(value => String(value).padStart(2, "0"))
        .join(":");
};

function CoinDetailPage() {
    const params = useLocalSearchParams<{ market?: string | string[] }>();
    const market = Array.isArray(params.market) ? params.market[0] : params.market;
    const [selectedTab, setSelectedTab] = useState<TabType>("info");
    const [coin, setCoin] = useState<CoinDetail | null>(null);
    const [realtimeData, setRealtimeData] = useState<RealtimePricePoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const favoriteMarkets = useFavoriteCoinStore(state => state.markets);
    const toggleFavorite = useFavoriteCoinStore(state => state.toggle);
    const isFavorite = market ? favoriteMarkets.includes(market) : false;

    useFocusEffect(
        useCallback(() => {
            if (!market) {
                setError("마켓 정보가 없습니다.");
                setIsLoading(false);
                return;
            }

            let active = true;
            let requesting = false;
            let interval: ReturnType<typeof setInterval> | null = null;

            const refresh = async () => {
                if (requesting || !active) {
                    return;
                }
                requesting = true;
                try {
                    const ticker = await getCoinTicker(market);
                    if (!active) {
                        return;
                    }
                    setCoin(previous =>
                        previous
                            ? {
                                  ...previous,
                                  price: ticker.price,
                                  changePrice: ticker.changePrice,
                                  changeRate: ticker.changeRate,
                                  openingPrice: ticker.openingPrice,
                                  highPrice: ticker.highPrice,
                                  lowPrice: ticker.lowPrice,
                                  tradePrice24h: ticker.tradePrice24h,
                                  tradeVolume24h: ticker.tradeVolume24h,
                                  timestamp: ticker.timestamp,
                              }
                            : previous,
                    );
                    setRealtimeData(previous =>
                        [
                            ...previous,
                            {
                                timestamp: ticker.timestamp,
                                time: formatTime(ticker.timestamp),
                                price: ticker.price,
                            },
                        ].slice(-60),
                    );
                } catch {
                    return;
                } finally {
                    requesting = false;
                }
            };

            const initialize = async () => {
                try {
                    setIsLoading(true);
                    setError(null);
                    const data = await getCoin(market);
                    if (!active) {
                        return;
                    }
                    setCoin(data);
                    setRealtimeData([
                        {
                            timestamp: data.timestamp,
                            time: formatTime(data.timestamp),
                            price: data.price,
                        },
                    ]);
                    interval = setInterval(() => void refresh(), 2000);
                } catch {
                    if (active) {
                        setError("코인 정보를 불러오지 못했습니다.");
                    }
                } finally {
                    if (active) {
                        setIsLoading(false);
                    }
                }
            };

            void initialize();
            return () => {
                active = false;
                if (interval) {
                    clearInterval(interval);
                }
            };
        }, [market]),
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0F6BFF" />
            </View>
        );
    }

    if (error || !coin) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Ionicons name="alert-circle-outline" size={42} color="#EF4444" />
                <Text className="mt-4 font-pretendard-medium text-error-main">
                    {error || "코인 정보가 없습니다."}
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    className="mt-5 rounded-xl bg-primary-main px-6 py-3">
                    <Text className="font-pretendard-bold text-white">돌아가기</Text>
                </Pressable>
            </View>
        );
    }

    const changePrice = `${coin.changePrice >= 0 ? "+" : "-"}${Math.abs(coin.changePrice).toLocaleString("ko-KR")}`;
    const changeRate = `${coin.changeRate >= 0 ? "+" : ""}${coin.changeRate.toFixed(2)}%`;
    const changeClass = coin.changeRate >= 0 ? "text-secondary-main" : "text-error-main";

    return (
        <View className="flex-1 bg-white">
            <View className="h-20 flex-row items-center px-5">
                <Pressable
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center">
                    <Ionicons name="chevron-back" size={26} color="#111827" />
                </Pressable>
                <View className="flex-1 flex-row items-center justify-center">
                    <Text className="font-pretendard-bold text-2xl text-text-default">
                        {coin.koreanName}
                    </Text>
                    <Text className="ml-1 font-pretendard-semibold text-lg text-text-secondary">
                        ({coin.symbol})
                    </Text>
                </View>
                <Pressable
                    onPress={() => toggleFavorite(coin.market)}
                    className="h-10 w-10 items-center justify-center">
                    <Ionicons
                        name={isFavorite ? "star" : "star-outline"}
                        size={27}
                        color="#F59E0B"
                    />
                </Pressable>
            </View>

            <View className="items-center pb-5 pt-2">
                <CoinAvatar symbol={coin.symbol} size={72} />
                <Text className="mt-5 font-pretendard-bold text-4xl text-text-default">
                    {formatKRW(coin.price)}
                </Text>
                <Text className={`mt-2 font-pretendard-bold text-xl ${changeClass}`}>
                    {coin.changeRate >= 0 ? "▲" : "▼"} {changePrice} ({changeRate})
                </Text>
            </View>

            <View className="flex-row border-b border-divider px-5">
                {(["info", "chart"] as TabType[]).map(tab => (
                    <Pressable
                        key={tab}
                        onPress={() => setSelectedTab(tab)}
                        className={`flex-1 items-center border-b-2 py-4 ${
                            selectedTab === tab ? "border-primary-main" : "border-transparent"
                        }`}>
                        <Text
                            className={`font-pretendard-bold text-lg ${selectedTab === tab ? "text-primary-main" : "text-text-secondary"}`}>
                            {tab === "info" ? "정보" : "차트"}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 18,
                    paddingBottom: 24,
                }}>
                <View className="w-full max-w-[560px] self-center">
                    {selectedTab === "info" ? (
                        <CoinInfo coin={coin} realtimeData={realtimeData} />
                    ) : (
                        <CoinChart coin={coin} realtimeData={realtimeData} />
                    )}
                </View>
            </ScrollView>

            <View className="flex-row gap-3 border-t border-divider px-5 py-3">
                <View className="flex-1">
                    <Button variant="outline" onPress={() => toggleFavorite(coin.market)}>
                        {isFavorite ? "관심코인 해제" : "관심코인"}
                    </Button>
                </View>
                <View className="flex-1">
                    <Button
                        onPress={() =>
                            router.push(
                                `/user/portfolio/create/coins?market=${encodeURIComponent(coin.market)}` as Href,
                            )
                        }>
                        포트폴리오에 추가
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default CoinDetailPage;
