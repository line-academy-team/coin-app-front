import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";

import { getCoins } from "@/api/coinApi";
import { Coin } from "@/types/coin";
import MainHeader from "@/components/layout/MainHeader";

interface CoinIconProps {
    symbol: string;
}

function CoinIcon({ symbol }: CoinIconProps) {
    const [hasError, setHasError] = useState(false);

    const upperSymbol = symbol.toUpperCase();

    const iconUrl = `https://static.upbit.com/logos/${upperSymbol}.png`;

    return (
        <View
            className="
                mr-3
                h-10
                w-10
                items-center
                justify-center
            ">
            {!hasError ? (
                <Image
                    source={{
                        uri: iconUrl,
                    }}
                    style={{
                        width: 40,
                        height: 40,
                    }}
                    resizeMode="contain"
                    onError={() => setHasError(true)}
                />
            ) : (
                <View
                    className="
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-secondary-main
                    ">
                    <Text
                        className="
                            text-xs
                            text-text-light
                            font-pretendard-bold
                        ">
                        {upperSymbol.charAt(0)}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default function CoinPage() {
    const [coinList, setCoinList] = useState<Coin[]>([]);
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getCoins();

                setCoinList(data);
            } catch (error) {
                console.error(error);

                setError("코인 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoins();
    }, []);

    const filteredCoins = useMemo(() => {
        const searchKeyword = keyword.trim().toLowerCase();

        if (!searchKeyword) {
            return coinList;
        }

        return coinList.filter(coin => {
            return (
                coin.koreanName.toLowerCase().includes(searchKeyword) ||
                coin.englishName.toLowerCase().includes(searchKeyword) ||
                coin.symbol.toLowerCase().includes(searchKeyword)
            );
        });
    }, [coinList, keyword]);

    const handleCoinPress = (coin: Coin) => {
        router.push(`/user/coin/${coin.market}` as Href);
    };

    const getChangeRateText = (changeRate: number) => {
        if (changeRate > 0) {
            return `+${changeRate.toFixed(2)}%`;
        }

        return `${changeRate.toFixed(2)}%`;
    };

    return (
        <View className="flex-1 bg-background-default">
            <MainHeader title="코인탐색" />

            {/* 검색창 */}
            <View className="px-5">
                <View
                    className="
                        h-12
                        flex-row
                        items-center
                        rounded-full
                        bg-background-paper
                        px-4
                    ">
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#9CA3AF"
                    />

                    <TextInput
                        value={keyword}
                        onChangeText={setKeyword}
                        placeholder="코인검색(예: 비트코인, btc)"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="
                            ml-2
                            flex-1
                            text-base
                            text-text-default
                            font-pretendard-bold
                        "
                    />

                    {keyword.length > 0 && (
                        <Pressable onPress={() => setKeyword("")}>
                            <Ionicons
                                name="close-circle"
                                size={19}
                                color="#9CA3AF"
                            />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* 구분선 */}
            <View className="mx-5 mt-4 h-[1px] bg-divider" />

            {/* 로딩 */}
            {isLoading && (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator
                        size="large"
                        color="#2288ED"
                    />

                    <Text
                        className="
                            mt-3
                            text-base
                            text-text-disabled
                            font-pretendard-medium
                        ">
                        코인 정보를 불러오는 중입니다.
                    </Text>
                </View>
            )}

            {/* 에러 */}
            {!isLoading && error && (
                <View className="flex-1 items-center justify-center px-5">
                    <Ionicons
                        name="alert-circle-outline"
                        size={36}
                        color="#EF4444"
                    />

                    <Text
                        className="
                            mt-3
                            text-sm
                            text-error-main
                            font-pretendard-medium
                        ">
                        {error}
                    </Text>
                </View>
            )}

            {/* 코인 목록 */}
            {!isLoading && !error && (
                <FlatList
                    data={filteredCoins}
                    keyExtractor={item => item.market}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 14,
                        paddingBottom: 30,
                    }}
                    ListEmptyComponent={
                        <View className="items-center py-20">
                            <Ionicons
                                name="search-outline"
                                size={34}
                                color="#9CA3AF"
                            />

                            <Text
                                className="
                                    mt-3
                                    text-sm
                                    text-text-secondary
                                    font-pretendard-medium
                                ">
                                검색 결과가 없습니다.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => handleCoinPress(item)}
                            className="
                                mb-2
                                flex-row
                                items-center
                                rounded-xl
                                bg-background-paper
                                px-3
                                py-3
                            ">
                            {/* 코인 아이콘 */}
                            <CoinIcon symbol={item.symbol} />

                            {/* 코인명 */}
                            <View className="flex-1">
                                <Text
                                    numberOfLines={1}
                                    className="
                                        text-base
                                        text-text-default
                                        font-pretendard-bold
                                    ">
                                    {item.koreanName}
                                </Text>

                                <Text
                                    className="
                                        mt-[2px]
                                        text-[10px]
                                        text-text-disabled
                                        font-pretendard-semibold
                                    ">
                                    {item.symbol}
                                </Text>
                            </View>

                            {/* 현재가 */}
                            <View className="min-w-[100px] items-end">
                                <Text
                                    className="
                                        text-sm
                                        text-text-default
                                        font-pretendard-medium
                                    ">
                                    ₩{item.price.toLocaleString("ko-KR")}
                                </Text>
                            </View>

                            {/* 등락률 */}
                            <View className="ml-3 min-w-[55px] items-end">
                                <Text
                                    className={
                                        item.changeRate > 0
                                            ? "text-xs text-success-main font-pretendard-medium"
                                            : item.changeRate < 0
                                                ? "text-xs text-error-main font-pretendard-medium"
                                                : "text-xs text-text-secondary font-pretendard-medium"
                                    }>
                                    {getChangeRateText(item.changeRate)}
                                </Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
}