import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";

import { useCallback, useState } from "react";

import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { getCoin, getCoinTicker } from "@/api/coin";

import { CoinDetail, RealtimePricePoint } from "@/types/coin";

import CoinInfo from "@/components/coin/CoinInfo";
import CoinChart from "@/components/coin/CoinChart";
import Button from "@/components/common/button/Button";

type TabType = "info" | "chart";

interface CoinIconProps {
    symbol: string;
}

/**
 * 코인 아이콘
 */
function CoinIcon({ symbol }: CoinIconProps) {
    const [hasError, setHasError] = useState(false);

    const upperSymbol = symbol.toUpperCase();

    const iconUrl = `https://static.upbit.com/logos/${upperSymbol}.png`;

    return (
        <View
            className="
                h-14
                w-14
                items-center
                justify-center
            ">
            {!hasError ? (
                <Image
                    source={{
                        uri: iconUrl,
                    }}
                    style={{
                        width: 56,
                        height: 56,
                    }}
                    resizeMode="contain"
                    onError={() => setHasError(true)}
                />
            ) : (
                <View
                    className="
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-secondary-main
                    ">
                    <Text
                        className="
                            text-xl
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

/**
 * 원화 표시
 */
const formatKRW = (value: number) => {
    return `₩${value.toLocaleString("ko-KR", {
        maximumFractionDigits: value < 1 ? 8 : value < 100 ? 4 : 0,
    })}`;
};

/**
 * timestamp
 */
const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);

    const hour = String(date.getHours()).padStart(2, "0");

    const minute = String(date.getMinutes()).padStart(2, "0");

    const second = String(date.getSeconds()).padStart(2, "0");

    return `${hour}:${minute}:${second}`;
};

export default function CoinDetailPage() {
    const params = useLocalSearchParams<{
        market?: string | string[];
    }>();

    /**
     * URL
     * /user/coin/KRW-BTC
     * market = KRW-BTC
     */
    const market = Array.isArray(params.market) ? params.market[0] : params.market;

    /**
     * 정보 / 차트
     */
    const [selectedTab, setSelectedTab] = useState<TabType>("info");

    /**
     * 코인 상세 정보
     */
    const [coin, setCoin] = useState<CoinDetail | null>(null);

    /**
     * 1초마다 쌓이는
     * 실시간 가격 데이터
     */
    const [realtimeData, setRealtimeData] = useState<RealtimePricePoint[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    /**
     * 관심코인
     * 현재는 프론트 상태만 변경
     */
    const [isFavorite, setIsFavorite] = useState(false);

    /**
     * =========================================
     * 상세 페이지 진입
     *
     * + 1초마다 현재가 반복 조회
     * =========================================
     */
    useFocusEffect(
        useCallback(() => {
            if (!market) {
                setError("마켓 정보가 없습니다.");

                setIsLoading(false);

                return;
            }

            /**
             * 페이지가 현재 활성 상태인지
             */
            let isActive = true;

            /**
             * 이전 요청이 아직 끝나지 않았는데
             * 다음 요청이 중복 실행되는 것을 방지
             */
            let isRequesting = false;

            let interval: ReturnType<typeof setInterval> | null = null;

            /**
             * =================================
             * 최초 데이터 가져오기
             * =================================
             */
            const initialize = async () => {
                try {
                    setIsLoading(true);

                    setError(null);

                    const data = await getCoin(market);

                    if (!isActive) {
                        return;
                    }

                    setCoin(data);

                    /**
                     * 그래프 첫 번째 데이터
                     */
                    setRealtimeData([
                        {
                            timestamp: data.timestamp,

                            time: formatTime(data.timestamp),

                            price: data.price,
                        },
                    ]);

                    /**
                     * 최초 조회가 끝난 후
                     * 1초마다 호출 시작
                     */
                    interval = setInterval(() => {
                        void refreshTicker();
                    }, 1000);
                } catch (error) {
                    console.error(error);

                    if (isActive) {
                        setError("코인 정보를 불러오지 못했습니다.");
                    }
                } finally {
                    if (isActive) {
                        setIsLoading(false);
                    }
                }
            };

            /**
             * =================================
             * 1초마다 실행되는 함수
             * =================================
             */
            const refreshTicker = async () => {
                /**
                 * 요청 중이면
                 * 다음 요청을 건너뜀
                 */
                if (isRequesting || !isActive) {
                    return;
                }

                isRequesting = true;

                try {
                    const ticker = await getCoinTicker(market);

                    if (!isActive) {
                        return;
                    }

                    /**
                     * ---------------------------------
                     * 상세 현재가도 1초마다 갱신
                     * ---------------------------------
                     */
                    setCoin(previous => {
                        if (!previous) {
                            return previous;
                        }

                        return {
                            ...previous,

                            price: ticker.trade_price,

                            changePrice: ticker.signed_change_price,

                            changeRate: ticker.signed_change_rate * 100,

                            openingPrice: ticker.opening_price,

                            highPrice: ticker.high_price,

                            lowPrice: ticker.low_price,

                            tradePrice24h: ticker.acc_trade_price_24h,

                            tradeVolume24h: ticker.acc_trade_volume_24h,

                            timestamp: ticker.timestamp,
                        };
                    });

                    /**
                     * ---------------------------------
                     * 그래프 데이터 추가
                     * ---------------------------------
                     */
                    const newPoint: RealtimePricePoint = {
                        timestamp: ticker.timestamp,

                        time: formatTime(ticker.timestamp),

                        price: ticker.trade_price,
                    };

                    setRealtimeData(previous => {
                        /**
                         * 새로운 가격 추가
                         */
                        const next = [...previous, newPoint];

                        /**
                         * 최근 60개만 유지
                         *
                         * = 약 최근 60초
                         */
                        return next.slice(-60);
                    });
                } catch (error) {
                    /**
                     * 1번 실시간 요청이 실패했다고
                     * 상세 페이지 전체를
                     * 에러 화면으로 바꾸지는 않음
                     */
                    console.error("실시간 현재가 조회 실패", error);
                } finally {
                    isRequesting = false;
                }
            };

            /**
             * 최초 실행
             */
            void initialize();

            /**
             * =================================
             * 페이지에서 나갈 때
             *
             * 1초 반복 호출 반드시 종료
             * =================================
             */
            return () => {
                isActive = false;

                if (interval) {
                    clearInterval(interval);
                }
            };
        }, [market]),
    );

    /**
     * =========================================
     * 로딩
     * =========================================
     */
    if (isLoading) {
        return (
            <View
                className="
                    flex-1
                    items-center
                    justify-center
                    bg-background-paper
                ">
                <ActivityIndicator size="large" color="#2288ED" />

                <Text
                    className="
                        mt-3
                        text-sm
                        text-text-secondary
                        font-pretendard-medium
                    ">
                    코인 정보를 불러오는 중입니다.
                </Text>
            </View>
        );
    }

    /**
     * =========================================
     * 에러
     * =========================================
     */
    if (error || !coin) {
        return (
            <View
                className="
                    flex-1
                    items-center
                    justify-center
                    bg-background-paper
                    px-5
                ">
                <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />

                <Text
                    className="
                        mt-3
                        text-sm
                        text-error-main
                    ">
                    {error ?? "코인 정보가 없습니다."}
                </Text>

                <Pressable
                    onPress={() => router.back()}
                    className="
                        mt-5
                        rounded-xl
                        bg-primary-main
                        px-5
                        py-3
                    ">
                    <Text
                        className="
                            font-pretendard-bold
                            text-text-light
                        ">
                        돌아가기
                    </Text>
                </Pressable>
            </View>
        );
    }

    /**
     * 상승 / 하락
     */
    const isRise = coin.changeRate > 0;

    const isFall = coin.changeRate < 0;

    const changeColor = isRise ? "text-[#00B386]" : isFall ? "text-[#F04452]" : "text-gray-500";

    /**
     * 가격 변동액
     */
    const changePriceText =
        coin.changePrice > 0
            ? `+${Math.abs(coin.changePrice).toLocaleString("ko-KR")}`
            : coin.changePrice < 0
              ? `-${Math.abs(coin.changePrice).toLocaleString("ko-KR")}`
              : "0";

    /**
     * 변동률
     */
    const changeRateText =
        coin.changeRate > 0 ? `+${coin.changeRate.toFixed(2)}%` : `${coin.changeRate.toFixed(2)}%`;

    /**
     * 포트폴리오 추가
     */
    const handlePortfolioPress = () => {
        router.push(
            `/user/portfolio/create/coins?market=${encodeURIComponent(coin.market)}` as Href,
        );
    };

    return (
        <View
            className="
                flex-1
                bg-background-paper
            ">
            {/* ========================== */}
            {/* 헤더 */}
            {/* ========================== */}

            <View
                className="
                    h-[80px]
                    flex-row
                    items-center
                    px-6
                ">
                <Pressable
                    onPress={() => router.push("/user/coin")}
                    className="
                        h-10
                        w-10
                        items-center
                        justify-center
                    ">
                    <Ionicons name="chevron-back" size={25} color="#111827" />
                </Pressable>

                <View
                    className="
                        flex-1
                        flex-row
                        items-center
                        justify-center
                    ">
                    <Text
                        className="
                            text-2xl
                            text-text-default
                            font-pretendard-bold
                        ">
                        {coin.koreanName}
                    </Text>

                    <Text
                        className="
                            ml-1
                            text-base
                            text-text-secondary
                            font-pretendard-medium
                        ">
                        ({coin.symbol})
                    </Text>
                </View>

                <Pressable
                    onPress={() => setIsFavorite(previous => !previous)}
                    className="
                        h-10
                        w-10
                        items-center
                        justify-center
                    ">
                    <Ionicons
                        name={isFavorite ? "star" : "star-outline"}
                        size={23}
                        color="#F59E0B"
                    />
                </Pressable>
            </View>

            {/* ========================== */}
            {/* 상단 코인 정보 */}
            {/* ========================== */}

            <View
                className="
                    items-center
                    pb-5
                    pt-2
                ">
                {/* 코인 아이콘 */}
                <CoinIcon symbol={coin.symbol} />

                {/* 1초마다 바뀌는 현재가 */}
                <Text
                    className="
                        mt-4
                        text-2xl
                        text-text-default
                        font-pretendard-bold
                    ">
                    {formatKRW(coin.price)}
                </Text>

                {/* 전일 대비 */}
                <Text
                    className={`
                        mt-1
                        text-sm
                        font-pretendard-bold
                        ${changeColor}
                    `}>
                    {isRise ? "▲ " : isFall ? "▼ " : ""}

                    {changePriceText}

                    {" ("}

                    {changeRateText}

                    {")"}
                </Text>

                <View
                    className="
                        mt-2
                        rounded-full
                        bg-background-deep
                        px-3
                        py-1
                    ">
                    <Text
                        className="
                            text-[10px]
                            text-primary-main
                            font-pretendard-bold
                        ">
                        LIVE · 1초마다 갱신
                    </Text>
                </View>
            </View>

            {/* ========================== */}
            {/* 탭 */}
            {/* ========================== */}

            <View
                className="
                    flex-row
                    border-b
                    border-background-deep
                    px-5
                ">
                {/* 정보 */}
                <Pressable
                    onPress={() => setSelectedTab("info")}
                    className="
                        flex-1
                        items-center
                        py-3
                    ">
                    <Text
                        className={
                            selectedTab === "info"
                                ? "text-base text-primary-main font-pretendard-bold"
                                : "text-base text-text-secondary font-pretendard-medium"
                        }>
                        정보
                    </Text>

                    {selectedTab === "info" && (
                        <View
                            className="
                                absolute
                                bottom-0
                                h-[2px]
                                w-full
                                bg-primary-main
                            "
                        />
                    )}
                </Pressable>

                {/* 차트 */}
                <Pressable
                    onPress={() => setSelectedTab("chart")}
                    className="
                        flex-1
                        items-center
                        py-3
                    ">
                    <Text
                        className={
                            selectedTab === "chart"
                                ? "text-base text-primary-main font-pretendard-bold"
                                : "text-base text-text-secondary font-pretendard-medium"
                        }>
                        차트
                    </Text>

                    {selectedTab === "chart" && (
                        <View
                            className="
                                absolute
                                bottom-0
                                h-[2px]
                                w-full
                                bg-primary-main
                            "
                        />
                    )}
                </Pressable>
            </View>

            {/* ========================== */}
            {/* 내용 */}
            {/* ========================== */}

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 14,
                    paddingBottom: 20,
                }}>
                {/* 정보 */}
                {selectedTab === "info" && <CoinInfo coin={coin} realtimeData={realtimeData} />}

                {/* 차트 */}
                {selectedTab === "chart" && <CoinChart coin={coin} realtimeData={realtimeData} />}
            </ScrollView>

            {/* ========================== */}
            {/* 하단 버튼 */}
            {/* ========================== */}

            <View
                className="
                    flex-row
                    gap-[10px]
                    bg-background-paper
                    px-5
                    pb-5
                    pt-3
                ">
                <View className="flex-1">
                    <Button variant="outline" onPress={() => setIsFavorite(previous => !previous)}>
                        {isFavorite ? "관심코인 해제" : "관심코인"}
                    </Button>
                </View>

                <View className="flex-1">
                    <Button variant="solid" color="primary" onPress={handlePortfolioPress}>
                        포트폴리오에 추가
                    </Button>
                </View>
            </View>
        </View>
    );
}
