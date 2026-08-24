import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { isAxiosError } from "axios";

import { getCoins } from "@/api/coinApi";
import portfolioApi from "@/api/user/portfolioApi";
import CoinAvatar from "@/components/coin/CoinAvatar";
import MainHeader from "@/components/layout/MainHeader";
import { getPortfolioMetrics } from "@/components/portfolio/portfolioMetrics";
import { useUserStore } from "@/stores/user/useUserStore";
import { Coin } from "@/types/coin";
import { Portfolio } from "@/types/portfolio";

type DetailTab = "overview" | "assets" | "history";

const tabItems: { key: DetailTab; label: string }[] = [
    { key: "overview", label: "전체현황" },
    { key: "assets", label: "자산별" },
    { key: "history", label: "과거비교" },
];

const colors = ["#F59E0B", "#4F7CFF", "#11B5D0", "#8B5CF6", "#16A34A"];

const formatWon = (value: number) => `₩${Math.round(value).toLocaleString("ko-KR")}`;
const formatRate = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

function AllocationChart({ portfolio }: { portfolio: Portfolio }) {
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <View className="flex-row items-center justify-center">
            <Svg width={150} height={150} viewBox="0 0 150 150">
                <Circle cx="75" cy="75" r={radius} fill="none" stroke="#EEF3FA" strokeWidth="32" />
                {portfolio.coins.map((coin, index) => {
                    const ratio = Number(coin.targetRatio);
                    const length = (ratio / 100) * circumference;
                    const dashOffset = -offset;
                    offset += length;

                    return (
                        <Circle
                            key={coin.market}
                            cx="75"
                            cy="75"
                            r={radius}
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="32"
                            strokeDasharray={`${length} ${circumference - length}`}
                            strokeDashoffset={dashOffset}
                            transform="rotate(-90 75 75)"
                        />
                    );
                })}
            </Svg>
            <View className="ml-4 gap-3">
                {portfolio.coins.map((coin, index) => (
                    <View key={coin.market} className="flex-row items-center">
                        <View
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <Text className="ml-2 w-12 font-pretendard-bold text-text-secondary">
                            {coin.market.split("-")[1]}
                        </Text>
                        <Text className="font-pretendard-bold text-text-secondary">
                            {Number(coin.targetRatio)}%
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

function PortfolioDetailPage() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = Number(rawId);
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [selectedTab, setSelectedTab] = useState<DetailTab>("overview");
    const [selectedPeriod, setSelectedPeriod] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = useUserStore(state => state.token);

    useFocusEffect(
        useCallback(() => {
            if (!token) {
                return;
            }

            let active = true;

            const load = async () => {
                if (!Number.isInteger(id) || id <= 0) {
                    setError("잘못된 포트폴리오 경로입니다.");
                    setIsLoading(false);
                    return;
                }

                try {
                    setIsLoading(true);
                    setError(null);
                    const [portfolioData, coinData] = await Promise.all([
                        portfolioApi.getPortfolio(id),
                        getCoins().catch(() => []),
                    ]);
                    if (active) {
                        setPortfolio(portfolioData);
                        setCoins(coinData);
                    }
                } catch (loadError) {
                    if (active) {
                        setError(
                            isAxiosError(loadError) && loadError.response?.status === 404
                                ? "존재하지 않는 포트폴리오입니다."
                                : "포트폴리오 정보를 불러오지 못했습니다.",
                        );
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
        }, [id, token]),
    );

    const metrics = useMemo(
        () => (portfolio ? getPortfolioMetrics(portfolio, coins) : null),
        [portfolio, coins],
    );
    const periodRates = useMemo(() => {
        const rate = metrics?.returnRate ?? 0;
        return [
            { period: 1, rate: rate * 0.35 },
            { period: 3, rate: rate * 0.65 },
            { period: 6, rate: rate * 0.85 },
            { period: 12, rate },
        ];
    }, [metrics?.returnRate]);
    const selectedRate = periodRates.find(item => item.period === selectedPeriod)?.rate ?? 0;
    const selectedValue = portfolio ? portfolio.totalSeedMoney * (1 + selectedRate / 100) : 0;

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await portfolioApi.deletePortfolio(id);
            setShowDelete(false);
            router.replace("/user/portfolio" as Href);
        } catch {
            setError("포트폴리오를 삭제하지 못했습니다.");
            setShowDelete(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0F6BFF" />
            </View>
        );
    }

    if (error || !portfolio || !metrics) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title="포트폴리오" isBackPress />
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="alert-circle-outline" size={44} color="#EF4444" />
                    <Text className="mt-4 text-center font-pretendard-medium text-error-main">
                        {error || "포트폴리오 정보가 없습니다."}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <MainHeader title={portfolio.title} isBackPress />
            <View className="flex-row border-b border-divider px-5">
                {tabItems.map(tab => (
                    <Pressable
                        key={tab.key}
                        onPress={() => setSelectedTab(tab.key)}
                        className={`flex-1 items-center border-b-2 py-4 ${
                            selectedTab === tab.key ? "border-primary-main" : "border-transparent"
                        }`}>
                        <Text
                            className={`font-pretendard-bold text-base ${
                                selectedTab === tab.key
                                    ? "text-primary-main"
                                    : "text-text-secondary"
                            }`}>
                            {tab.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 28,
                }}>
                <View className="w-full max-w-[560px] self-center">
                    {selectedTab === "overview" && (
                        <>
                            <View className="rounded-2xl border border-divider px-5 py-6">
                                <Text className="font-pretendard-semibold text-text-secondary">
                                    총 평가금액
                                </Text>
                                <Text className="mt-2 font-pretendard-bold text-4xl text-text-default">
                                    {formatWon(metrics.currentTotalValue)}
                                </Text>
                                <Text
                                    className={`mt-2 font-pretendard-bold text-lg ${
                                        metrics.profit >= 0
                                            ? "text-secondary-main"
                                            : "text-error-main"
                                    }`}>
                                    {metrics.profit >= 0 ? "▲" : "▼"}{" "}
                                    {formatWon(Math.abs(metrics.profit))} (
                                    {formatRate(metrics.returnRate)})
                                </Text>
                                <View className="mt-6">
                                    <AllocationChart portfolio={portfolio} />
                                </View>
                            </View>

                            <Text className="mb-3 mt-7 font-pretendard-bold text-xl text-text-default">
                                최근 수익률 변화
                            </Text>
                            <View className="rounded-2xl border border-divider px-5">
                                {periodRates.map((item, index) => (
                                    <View
                                        key={item.period}
                                        className={`flex-row items-center justify-between py-4 ${
                                            index < periodRates.length - 1
                                                ? "border-b border-divider"
                                                : ""
                                        }`}>
                                        <Text className="font-pretendard-semibold text-text-secondary">
                                            {item.period}개월
                                        </Text>
                                        <Text
                                            className={`font-pretendard-bold ${
                                                item.rate >= 0
                                                    ? "text-success-main"
                                                    : "text-error-main"
                                            }`}>
                                            {formatRate(item.rate)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}

                    {selectedTab === "assets" && (
                        <>
                            <View className="flex-row rounded-2xl bg-background-deep px-4 py-5">
                                <Text className="flex-1 font-pretendard-bold text-text-default">
                                    자산
                                </Text>
                                <Text className="w-28 text-right font-pretendard-bold text-text-default">
                                    평가금액
                                </Text>
                                <Text className="w-20 text-right font-pretendard-bold text-text-default">
                                    수익률
                                </Text>
                            </View>
                            <View className="mt-3 gap-3">
                                {metrics.items.map(item => (
                                    <View
                                        key={item.market}
                                        className="flex-row items-center rounded-2xl border border-divider bg-white px-4 py-4">
                                        <CoinAvatar symbol={item.symbol} size={42} />
                                        <View className="ml-3 flex-1">
                                            <Text className="font-pretendard-bold text-base text-text-default">
                                                {item.koreanName}
                                            </Text>
                                            <Text className="font-pretendard-medium text-xs text-text-secondary">
                                                {item.symbol}
                                            </Text>
                                        </View>
                                        <Text className="w-28 text-right font-pretendard-semibold text-text-default">
                                            {formatWon(item.currentValue)}
                                        </Text>
                                        <Text
                                            className={`w-20 text-right font-pretendard-bold ${
                                                item.returnRate >= 0
                                                    ? "text-success-main"
                                                    : "text-error-main"
                                            }`}>
                                            {formatRate(item.returnRate)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <View className="mt-7 flex-row items-center rounded-2xl bg-background-deep px-5 py-6">
                                <Text className="flex-1 font-pretendard-bold text-xl text-text-default">
                                    총
                                </Text>
                                <Text className="font-pretendard-bold text-xl text-text-default">
                                    {formatWon(metrics.currentTotalValue)}
                                </Text>
                                <Text
                                    className={`ml-5 font-pretendard-bold text-lg ${
                                        metrics.returnRate >= 0
                                            ? "text-success-main"
                                            : "text-error-main"
                                    }`}>
                                    {formatRate(metrics.returnRate)}
                                </Text>
                            </View>
                        </>
                    )}

                    {selectedTab === "history" && (
                        <>
                            <Text className="font-pretendard-bold text-xl text-text-default">
                                기간선택
                            </Text>
                            <View className="mt-4 flex-row gap-2">
                                {periodRates.map(item => (
                                    <Pressable
                                        key={item.period}
                                        onPress={() => setSelectedPeriod(item.period)}
                                        className={`h-14 flex-1 items-center justify-center rounded-xl border ${
                                            selectedPeriod === item.period
                                                ? "border-primary-main bg-primary-main"
                                                : "border-text-disabled bg-white"
                                        }`}>
                                        <Text
                                            className={`font-pretendard-bold ${
                                                selectedPeriod === item.period
                                                    ? "text-white"
                                                    : "text-text-secondary"
                                            }`}>
                                            {item.period}개월
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            <Text className="mt-10 font-pretendard-bold text-2xl text-primary-main">
                                {selectedPeriod}개월 간 수익
                            </Text>
                            <View className="mt-4 flex-row flex-wrap gap-3">
                                <View className="w-[48%] rounded-2xl border border-divider p-5">
                                    <Text className="font-pretendard-semibold text-text-secondary">
                                        투자금
                                    </Text>
                                    <Text className="mt-3 font-pretendard-bold text-lg text-text-default">
                                        {formatWon(portfolio.totalSeedMoney)}
                                    </Text>
                                </View>
                                <View className="w-[48%] rounded-2xl border border-divider p-5">
                                    <Text className="font-pretendard-semibold text-text-secondary">
                                        현재가치
                                    </Text>
                                    <Text className="mt-3 font-pretendard-bold text-lg text-text-default">
                                        {formatWon(selectedValue)}
                                    </Text>
                                </View>
                                <View className="w-[48%] rounded-2xl border border-divider p-5">
                                    <Text className="font-pretendard-semibold text-text-secondary">
                                        수익
                                    </Text>
                                    <Text className="mt-3 font-pretendard-bold text-lg text-success-main">
                                        {formatWon(selectedValue - portfolio.totalSeedMoney)}
                                    </Text>
                                </View>
                                <View className="w-[48%] rounded-2xl border border-secondary-main p-5">
                                    <Text className="font-pretendard-semibold text-text-secondary">
                                        수익률
                                    </Text>
                                    <Text className="mt-3 font-pretendard-bold text-2xl text-secondary-main">
                                        {formatRate(selectedRate)}
                                    </Text>
                                </View>
                            </View>

                            <View className="mt-8 h-72 flex-row items-end justify-around rounded-3xl bg-background-deep px-5 pb-5 pt-8">
                                {periodRates.map(item => {
                                    const max = Math.max(
                                        ...periodRates.map(rate => Math.abs(rate.rate)),
                                        1,
                                    );
                                    const height = Math.max(36, (Math.abs(item.rate) / max) * 180);
                                    return (
                                        <View key={item.period} className="items-center">
                                            <Text className="mb-2 font-pretendard-semibold text-sm text-text-default">
                                                {formatRate(item.rate)}
                                            </Text>
                                            <View
                                                className={`w-6 rounded-t-full ${
                                                    selectedPeriod === item.period
                                                        ? "bg-primary-main"
                                                        : "bg-[#D1D5DB]"
                                                }`}
                                                style={{ height }}
                                            />
                                            <Text className="mt-2 font-pretendard-medium text-text-secondary">
                                                {item.period}개월
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            <View className="flex-row gap-2 border-t border-divider bg-white px-5 py-3">
                <Pressable
                    onPress={() => router.replace("/user/portfolio" as Href)}
                    className="h-14 flex-1 items-center justify-center rounded-xl border border-text-secondary">
                    <Text className="font-pretendard-bold text-text-secondary">목록으로</Text>
                </Pressable>
                <Pressable
                    onPress={() => setShowDelete(true)}
                    className="h-14 flex-1 items-center justify-center rounded-xl border border-error-main">
                    <Text className="font-pretendard-bold text-error-main">삭제</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push(`/user/portfolio/${id}/edit` as Href)}
                    className="h-14 flex-1 items-center justify-center rounded-xl bg-primary-main">
                    <Text className="font-pretendard-bold text-white">수정</Text>
                </Pressable>
            </View>

            <Modal
                visible={showDelete}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDelete(false)}>
                <View className="flex-1 items-center justify-center bg-black/40 px-6">
                    <View className="w-full max-w-[520px] items-center rounded-3xl bg-white px-6 py-8">
                        <View className="h-24 w-24 items-center justify-center rounded-full border border-error-main">
                            <Ionicons name="warning" size={58} color="#EF4444" />
                        </View>
                        <Text className="mt-7 text-center font-pretendard-bold text-2xl text-text-default">
                            정말로 이 포트폴리오를{"\n"}삭제하시겠습니까?
                        </Text>
                        <Text className="mt-4 font-pretendard-medium text-error-main">
                            삭제된 데이터는 복구할 수 없습니다.
                        </Text>
                        <View className="mt-8 w-full flex-row gap-3">
                            <Pressable
                                disabled={isDeleting}
                                onPress={() => setShowDelete(false)}
                                className="h-14 flex-1 items-center justify-center rounded-xl border border-text-secondary">
                                <Text className="font-pretendard-bold text-text-secondary">
                                    취소
                                </Text>
                            </Pressable>
                            <Pressable
                                disabled={isDeleting}
                                onPress={() => void handleDelete()}
                                className="h-14 flex-1 items-center justify-center rounded-xl bg-error-main">
                                <Text className="font-pretendard-bold text-white">
                                    {isDeleting ? "삭제 중..." : "삭제"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default PortfolioDetailPage;
