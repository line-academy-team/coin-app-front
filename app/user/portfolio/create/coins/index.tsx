import { Href, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { getCoins } from "@/api/coin";
import MainHeader from "@/components/layout/MainHeader";
import PortfolioBottomActions from "@/components/portfolio/PortfolioBottomActions";
import {
    formatCoinQuantity,
    formatWon,
    getEstimatedPurchase,
} from "@/components/portfolio/portfolioFormat";
import PortfolioStepIndicator from "@/components/portfolio/PortfolioStepIndicator";
import { usePortfolioCreateStore } from "@/stores/portfolio/usePortfolioCreateStore";
import { Coin } from "@/types/coin";

interface AllocationInputProps {
    market: string;
    coinName: string;
    allocation: number;
    onChange: (market: string, allocation: number) => void;
}

function AllocationInput({ market, coinName, allocation, onChange }: AllocationInputProps) {
    const [inputValue, setInputValue] = useState(String(allocation));

    useEffect(() => {
        setInputValue(String(allocation));
    }, [allocation]);

    const handleChange = (value: string) => {
        const digits = value.replace(/[^0-9]/g, "").slice(0, 3);
        setInputValue(digits);

        if (digits) {
            onChange(market, Math.min(100, Number(digits)));
        }
    };

    const handleBlur = () => {
        const normalizedAllocation = inputValue ? Math.min(100, Number(inputValue)) : 0;
        setInputValue(String(normalizedAllocation));
        onChange(market, normalizedAllocation);
    };

    return (
        <View className="ml-2 h-10 min-w-[72px] flex-row items-center rounded-xl bg-white px-2">
            <TextInput
                value={inputValue}
                onChangeText={handleChange}
                onBlur={handleBlur}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={3}
                selectTextOnFocus
                accessibilityLabel={`${coinName} 투자 비중`}
                className="min-w-[38px] flex-1 text-right font-pretendard-bold text-base text-[#111827]"
            />
            <Text className="ml-0.5 font-pretendard-bold text-base text-[#111827]">%</Text>
        </View>
    );
}

function PortfolioCoins() {
    const params = useLocalSearchParams<{ market?: string | string[] }>();
    const requestedMarket = Array.isArray(params.market) ? params.market[0] : params.market;

    const [coinList, setCoinList] = useState<Coin[]>([]);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const coins = usePortfolioCreateStore(state => state.coins);
    const seedMoney = usePortfolioCreateStore(state => state.seedMoney);
    const ensureRecommendedCoins = usePortfolioCreateStore(state => state.ensureRecommendedCoins);
    const syncCoinMarketData = usePortfolioCreateStore(state => state.syncCoinMarketData);
    const toggleCoin = usePortfolioCreateStore(state => state.toggleCoin);
    const setAllocation = usePortfolioCreateStore(state => state.setAllocation);
    const changeAllocation = usePortfolioCreateStore(state => state.changeAllocation);

    const loadCoins = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getCoins();
            setCoinList(data);
            ensureRecommendedCoins();
            syncCoinMarketData(
                data.map(coin => ({
                    market: coin.market,
                    symbol: coin.symbol,
                    koreanName: coin.koreanName,
                    currentPrice: coin.price,
                })),
            );

            if (requestedMarket) {
                const requestedCoin = data.find(coin => coin.market === requestedMarket);
                const selectedCoins = usePortfolioCreateStore.getState().coins;

                if (
                    requestedCoin &&
                    !selectedCoins.some(coin => coin.market === requestedCoin.market)
                ) {
                    usePortfolioCreateStore.getState().toggleCoin({
                        market: requestedCoin.market,
                        symbol: requestedCoin.symbol,
                        koreanName: requestedCoin.koreanName,
                        currentPrice: requestedCoin.price,
                    });
                }
            }
        } catch (loadError) {
            console.error(loadError);
            setError("업비트 코인 정보를 불러오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [ensureRecommendedCoins, requestedMarket, syncCoinMarketData]);

    useEffect(() => {
        void loadCoins();
    }, [loadCoins]);

    const filteredCoins = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();

        if (!normalizedKeyword) {
            return coinList;
        }

        return coinList.filter(
            coin =>
                coin.koreanName.toLowerCase().includes(normalizedKeyword) ||
                coin.englishName.toLowerCase().includes(normalizedKeyword) ||
                coin.symbol.toLowerCase().includes(normalizedKeyword),
        );
    }, [coinList, keyword]);

    const totalAllocation = coins.reduce((total, coin) => total + coin.allocation, 0);
    const canContinue = coins.length > 0 && totalAllocation === 100;

    const renderCoin = ({ item }: { item: Coin }) => {
        const selectedCoin = coins.find(coin => coin.market === item.market);
        const estimate = selectedCoin
            ? getEstimatedPurchase(seedMoney, selectedCoin.allocation, selectedCoin.currentPrice)
            : null;

        return (
            <View
                className={`mb-3 rounded-2xl border px-3 py-4 ${
                    selectedCoin
                        ? "border-[#DCE8FA] bg-[#EEF4FB]"
                        : "border-[#E5E9F0] bg-white"
                }`}>
                <View className="flex-row items-center">
                    <Pressable
                        onPress={() =>
                            toggleCoin({
                                market: item.market,
                                symbol: item.symbol,
                                koreanName: item.koreanName,
                                currentPrice: item.price,
                            })
                        }
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: Boolean(selectedCoin) }}
                        hitSlop={8}
                        className={`h-6 w-6 items-center justify-center rounded border-2 ${
                            selectedCoin
                                ? "border-[#3B82F6] bg-[#3B82F6]"
                                : "border-[#6B7280] bg-white"
                        }`}>
                        {selectedCoin && (
                            <Text className="font-pretendard-bold text-base text-white">✓</Text>
                        )}
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            toggleCoin({
                                market: item.market,
                                symbol: item.symbol,
                                koreanName: item.koreanName,
                                currentPrice: item.price,
                            })
                        }
                        className="ml-3 flex-1 flex-row items-center">
                        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#11B5D0]">
                            <Text className="font-pretendard-bold text-sm text-white">
                                {item.symbol.slice(0, 1)}
                            </Text>
                        </View>
                        <View className="ml-3 flex-1">
                            <Text
                                numberOfLines={1}
                                className="font-pretendard-bold text-base text-[#111827]">
                                {item.koreanName}
                            </Text>
                            <Text
                                numberOfLines={1}
                                className="mt-0.5 font-pretendard-medium text-xs text-[#6B7280]">
                                {item.symbol} · ₩{item.price.toLocaleString("ko-KR")}
                            </Text>
                        </View>
                    </Pressable>
                </View>

                {selectedCoin && (
                    <View className="mt-4 flex-row items-center">
                        <Pressable
                            onPress={() => changeAllocation(item.market, -1)}
                            accessibilityLabel={`${item.koreanName} 비중 줄이기`}
                            className="h-9 w-9 items-center justify-center rounded-full bg-white active:bg-[#E5E9F0]">
                            <Text className="font-pretendard-bold text-xl text-[#0F6BFF]">−</Text>
                        </Pressable>

                        <View className="mx-3 h-2 flex-1 overflow-hidden rounded-full bg-white">
                            <View
                                className="h-full rounded-full bg-[#0F6BFF]"
                                style={{ width: `${selectedCoin.allocation}%` }}
                            />
                        </View>

                        <Pressable
                            onPress={() => changeAllocation(item.market, 1)}
                            accessibilityLabel={`${item.koreanName} 비중 늘리기`}
                            className="h-9 w-9 items-center justify-center rounded-full bg-white active:bg-[#E5E9F0]">
                            <Text className="font-pretendard-bold text-xl text-[#0F6BFF]">+</Text>
                        </Pressable>

                        <AllocationInput
                            market={item.market}
                            coinName={item.koreanName}
                            allocation={selectedCoin.allocation}
                            onChange={setAllocation}
                        />
                    </View>
                )}

                {selectedCoin && estimate && (
                    <View className="mt-3 flex-row items-center justify-between border-t border-white pt-3">
                        <Text className="font-pretendard-medium text-xs text-[#6B7280]">
                            예상 투자금 {formatWon(estimate.investmentAmount)}
                        </Text>
                        <Text className="font-pretendard-semibold text-xs text-[#0F6BFF]">
                            약 {formatCoinQuantity(estimate.quantity)} {selectedCoin.symbol} 예상 구매
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <MainHeader title="투자할 코인 선택" isBackPress />

            <View className="w-full flex-1 self-center" style={{ maxWidth: 560 }}>
                {isLoading ? (
                    <View className="flex-1 items-center justify-center px-5">
                        <ActivityIndicator size="large" color="#0F6BFF" />
                        <Text className="mt-3 font-pretendard-medium text-sm text-[#6B7280]">
                            업비트 코인 정보를 불러오는 중입니다.
                        </Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center px-5">
                        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FB]">
                            <Text className="font-pretendard-bold text-xl text-[#6B7280]">!</Text>
                        </View>
                        <Text className="mt-4 font-pretendard-semibold text-base text-[#111827]">
                            {error}
                        </Text>
                        <Pressable
                            onPress={() => void loadCoins()}
                            className="mt-5 rounded-xl bg-[#0F6BFF] px-6 py-3">
                            <Text className="font-pretendard-bold text-sm text-white">다시 시도</Text>
                        </Pressable>
                    </View>
                ) : (
                    <FlatList
                        data={filteredCoins}
                        keyExtractor={item => item.market}
                        renderItem={renderCoin}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
                        ListHeaderComponent={
                            <View className="pt-5">
                                <Text className="text-center font-pretendard-medium text-lg leading-7 text-[#6B7280]">
                                    원하는 코인을 선택하고{"\n"}투자 비율을 설정하세요
                                </Text>

                                <PortfolioStepIndicator activeStep={2} />

                                <View className="mb-5 mt-6 h-14 flex-row items-center rounded-full border border-[#A7B0BE] bg-white px-4">
                                    <Text className="font-pretendard-regular text-2xl text-[#6B7280]">
                                        ⌕
                                    </Text>
                                    <TextInput
                                        value={keyword}
                                        onChangeText={setKeyword}
                                        placeholder="코인검색(예: 비트코인, btc)"
                                        placeholderTextColor="#A7B0BE"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        className="ml-2 flex-1 font-pretendard-medium text-sm text-[#111827]"
                                    />
                                    {keyword.length > 0 && (
                                        <Pressable onPress={() => setKeyword("")} hitSlop={8}>
                                            <Text className="font-pretendard-bold text-xl text-[#A7B0BE]">
                                                ×
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        }
                        ListEmptyComponent={
                            <View className="items-center py-16">
                                <Text className="font-pretendard-regular text-4xl text-[#A7B0BE]">
                                    ⌕
                                </Text>
                                <Text className="mt-3 font-pretendard-medium text-sm text-[#6B7280]">
                                    검색 결과가 없습니다.
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <View className="mt-2 flex-row items-center justify-between rounded-2xl border border-[#E5E9F0] bg-white px-4 py-4">
                                <View>
                                    <Text className="font-pretendard-bold text-base text-[#6B7280]">
                                        전체비율
                                    </Text>
                                <Text className="mt-1 font-pretendard-medium text-xs text-[#A7B0BE]">
                                    {coins.length}개 자산 선택
                                </Text>
                                {totalAllocation !== 100 && (
                                    <Text className="mt-1 font-pretendard-medium text-xs text-[#EF4444]">
                                        다음 단계는 합계 100%일 때 진행할 수 있어요.
                                    </Text>
                                )}
                                </View>
                                <Text
                                    className={`font-pretendard-bold text-xl ${
                                        totalAllocation === 100
                                            ? "text-[#0F6BFF]"
                                            : "text-[#EF4444]"
                                    }`}>
                                    {totalAllocation}%
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            <PortfolioBottomActions
                nextLabel="다음"
                onPrevious={() => router.back()}
                onNext={() => router.push("/user/portfolio/create/confirm" as Href)}
                nextDisabled={isLoading || Boolean(error) || !canContinue}
            />
        </View>
    );
}

export default PortfolioCoins;
