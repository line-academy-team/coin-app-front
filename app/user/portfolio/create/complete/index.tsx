import { Href, router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import Button from "@/components/common/button/Button";
import { formatDate, formatWon } from "@/components/portfolio/portfolioFormat";
import { usePortfolioCreateStore } from "@/stores/portfolio/usePortfolioCreateStore";

function PortfolioComplete() {
    const portfolio = usePortfolioCreateStore(state => state.createdPortfolio);

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 36 }}>
            <View className="w-full self-center px-5" style={{ maxWidth: 560 }}>
                <View className="items-center">
                    <View className="h-28 w-28 items-center justify-center rounded-full bg-[#0F6BFF]">
                        <Text className="font-pretendard-bold text-6xl text-white">✓</Text>
                    </View>

                    <Text className="mt-8 text-center font-pretendard-bold text-3xl text-[#111827]">
                        포트폴리오가 생성되었습니다!
                    </Text>
                    <Text className="mt-5 text-center font-pretendard-medium text-lg leading-7 text-[#6B7280]">
                        이제 시작한 돈으로 투자 시뮬레이션을 진행하고{"\n"}수익률을 확인해보세요.
                    </Text>
                </View>

                {portfolio ? (
                    <View className="mt-8 rounded-2xl bg-[#EEF4FB] px-5 py-5">
                        <View className="flex-row items-center justify-between border-b border-white pb-4">
                            <Text className="font-pretendard-semibold text-base text-[#6B7280]">
                                투자 시작일
                            </Text>
                            <Text className="font-pretendard-bold text-base text-[#111827]">
                                {formatDate(portfolio.createdAt)}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between border-b border-white py-4">
                            <Text className="font-pretendard-semibold text-base text-[#6B7280]">
                                시드머니
                            </Text>
                            <Text className="font-pretendard-bold text-base text-[#111827]">
                                {formatWon(portfolio.totalSeedMoney)}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between pt-4">
                            <Text className="font-pretendard-semibold text-base text-[#6B7280]">
                                선택한 자산
                            </Text>
                            <Text className="font-pretendard-bold text-base text-[#111827]">
                                {portfolio.coins.length}개
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View className="mt-8 rounded-2xl bg-[#FEE2E2] px-5 py-4">
                        <Text className="text-center font-pretendard-medium text-sm text-[#EF4444]">
                            생성된 포트폴리오 정보를 찾을 수 없습니다.
                        </Text>
                    </View>
                )}

                <View className="mt-8 gap-3">
                    <Button
                        onPress={() => router.replace("/user/portfolio" as Href)}
                        className="h-14 rounded-xl"
                        textClassName="text-base">
                        내 포트폴리오 보기
                    </Button>
                    <Button
                        variant="outline"
                        onPress={() => router.replace("/user" as Href)}
                        className="h-14 rounded-xl"
                        textClassName="text-base">
                        홈으로 돌아가기
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

export default PortfolioComplete;
