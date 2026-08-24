import { Href, router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { createPortfolioMock } from "@/api/user/portfolioApi";
import MainHeader from "@/components/layout/MainHeader";
import PortfolioBottomActions from "@/components/portfolio/PortfolioBottomActions";
import {
    formatCoinQuantity,
    formatWon,
    getEstimatedPurchase,
} from "@/components/portfolio/portfolioFormat";
import PortfolioStepIndicator from "@/components/portfolio/PortfolioStepIndicator";
import { usePortfolioCreateStore } from "@/stores/portfolio/usePortfolioCreateStore";

function PortfolioConfirm() {
    const name = usePortfolioCreateStore(state => state.name);
    const seedMoney = usePortfolioCreateStore(state => state.seedMoney);
    const coins = usePortfolioCreateStore(state => state.coins);
    const setCreatedPortfolio = usePortfolioCreateStore(state => state.setCreatedPortfolio);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalAllocation = coins.reduce((total, coin) => total + coin.allocation, 0);

    const handleCreate = async () => {
        if (isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const createdPortfolio = await createPortfolioMock({ name, seedMoney, coins });
            setCreatedPortfolio(createdPortfolio);
            router.replace("/user/portfolio/create/complete" as Href);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "포트폴리오 생성 중 문제가 발생했습니다.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <MainHeader title="포트폴리오 최종 확인" isBackPress />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 28 }}>
                <View className="w-full self-center px-5 pt-6" style={{ maxWidth: 560 }}>
                    <Text className="text-center font-pretendard-medium text-lg leading-7 text-[#6B7280]">
                        아래 내용을 확인하고{"\n"}포트폴리오를 생성하세요
                    </Text>

                    <PortfolioStepIndicator activeStep={3} />

                    <View className="mt-7 rounded-2xl border border-[#E5E9F0] bg-white px-4 py-5">
                        <View className="flex-row items-center justify-between">
                            <Text className="font-pretendard-semibold text-base text-[#6B7280]">
                                포트폴리오
                            </Text>
                            <Text
                                numberOfLines={1}
                                className="ml-4 flex-1 text-right font-pretendard-bold text-base text-[#111827]">
                                {name || "이름 미입력"}
                            </Text>
                        </View>
                        <View className="my-4 h-px bg-[#EEF1F5]" />
                        <View className="flex-row items-center justify-between">
                            <Text className="font-pretendard-semibold text-base text-[#6B7280]">
                                시드머니
                            </Text>
                            <Text className="font-pretendard-bold text-xl text-[#111827]">
                                {formatWon(seedMoney)}
                            </Text>
                        </View>
                    </View>

                    <Text className="mb-3 mt-7 font-pretendard-bold text-xl text-[#111827]">
                        선택한 자산
                    </Text>

                    <View className="gap-3">
                        {coins.map(coin => {
                            const estimate = getEstimatedPurchase(
                                seedMoney,
                                coin.allocation,
                                coin.currentPrice,
                            );

                            return (
                                <View
                                    key={coin.market}
                                    className="rounded-2xl bg-[#EEF4FB] px-4 py-4">
                                    <View className="flex-row items-center">
                                        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#11B5D0]">
                                            <Text className="font-pretendard-bold text-base text-white">
                                                {coin.symbol.slice(0, 1)}
                                            </Text>
                                        </View>
                                        <View className="ml-3 flex-1">
                                            <Text className="font-pretendard-bold text-base text-[#111827]">
                                                {coin.koreanName}
                                            </Text>
                                            <Text className="mt-0.5 font-pretendard-medium text-xs text-[#6B7280]">
                                                {coin.symbol} · 기준가{" "}
                                                {formatWon(coin.currentPrice)}
                                            </Text>
                                        </View>
                                        <View className="ml-3 min-w-[58px] rounded-xl bg-white px-2 py-2.5">
                                            <Text className="text-center font-pretendard-bold text-base text-[#111827]">
                                                {coin.allocation}%
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="mt-3 flex-row items-end justify-between border-t border-white pt-3">
                                        <View>
                                            <Text className="font-pretendard-medium text-xs text-[#6B7280]">
                                                예상 투자금
                                            </Text>
                                            <Text className="mt-1 font-pretendard-bold text-sm text-[#111827]">
                                                {formatWon(estimate.investmentAmount)}
                                            </Text>
                                        </View>
                                        <View className="ml-3 flex-1 items-end">
                                            <Text className="font-pretendard-medium text-xs text-[#6B7280]">
                                                예상 구매
                                            </Text>
                                            <Text className="mt-1 text-right font-pretendard-bold text-sm text-[#0F6BFF]">
                                                약 {formatCoinQuantity(estimate.quantity)}{" "}
                                                {coin.symbol}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    <View className="mt-4 flex-row items-center justify-between rounded-2xl border border-[#E5E9F0] bg-white px-5 py-5">
                        <Text className="font-pretendard-bold text-lg text-[#6B7280]">총</Text>
                        <Text className="font-pretendard-bold text-lg text-[#6B7280]">
                            {formatWon(seedMoney)}
                        </Text>
                        <Text className="font-pretendard-bold text-lg text-[#6B7280]">
                            {totalAllocation}%
                        </Text>
                    </View>

                    <View className="mt-5 flex-row rounded-2xl border border-[#E5E9F0] bg-[#F5F8FC] px-4 py-5">
                        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F59E0B]">
                            <Text className="font-pretendard-bold text-xl text-white">!</Text>
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="font-pretendard-bold text-base text-[#111827]">
                                유의사항
                            </Text>
                            <Text className="mt-1 font-pretendard-medium text-sm leading-5 text-[#6B7280]">
                                이 시뮬레이션은 실제 매매가 아닌 가상 매매 시뮬레이션입니다. 실제
                                주문이나 자금 전송은 발생하지 않으며, 예상 구매 수량은 현재가
                                기준이라 실제 시세에 따라 달라질 수 있습니다.
                            </Text>
                        </View>
                    </View>

                    {error && (
                        <View className="mt-4 rounded-xl bg-[#FEE2E2] px-4 py-3">
                            <Text className="font-pretendard-medium text-sm text-[#EF4444]">
                                {error}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <PortfolioBottomActions
                nextLabel="포트폴리오 생성"
                onPrevious={() => router.back()}
                onNext={() => void handleCreate()}
                nextDisabled={
                    !name || seedMoney <= 0 || coins.length === 0 || totalAllocation !== 100
                }
                isLoading={isSubmitting}
            />
        </View>
    );
}

export default PortfolioConfirm;
