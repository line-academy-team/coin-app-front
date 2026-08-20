import { Href, router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import MainHeader from "@/components/layout/MainHeader";
import PortfolioBottomActions from "@/components/portfolio/PortfolioBottomActions";
import PortfolioStepIndicator from "@/components/portfolio/PortfolioStepIndicator";
import { usePortfolioCreateStore } from "@/stores/portfolio/usePortfolioCreateStore";

const quickAmounts = [
    { label: "100만", value: 1_000_000 },
    { label: "500만", value: 5_000_000 },
    { label: "1,000만", value: 10_000_000 },
    { label: "5,000만", value: 50_000_000 },
];

function PortfolioCreateStart() {
    const storedName = usePortfolioCreateStore(state => state.name);
    const storedSeedMoney = usePortfolioCreateStore(state => state.seedMoney);
    const setBasics = usePortfolioCreateStore(state => state.setBasics);
    const ensureRecommendedCoins = usePortfolioCreateStore(state => state.ensureRecommendedCoins);

    const [name, setName] = useState(storedName);
    const [seedMoney, setSeedMoney] = useState(storedSeedMoney);
    const [showValidation, setShowValidation] = useState(false);

    const isNameValid = name.trim().length >= 2;
    const isSeedMoneyValid = seedMoney >= 100_000;

    const handleSeedMoneyChange = (value: string) => {
        const numericValue = Number(value.replace(/[^0-9]/g, ""));
        setSeedMoney(Number.isFinite(numericValue) ? numericValue : 0);
    };

    const handleNext = () => {
        setShowValidation(true);

        if (!isNameValid || !isSeedMoneyValid) {
            return;
        }

        setBasics(name.trim(), seedMoney);
        ensureRecommendedCoins();
        router.push("/user/portfolio/create/coins" as Href);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <MainHeader title="포트폴리오 만들기" isBackPress />

            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 28 }}>
                <View className="w-full self-center px-5 pt-6" style={{ maxWidth: 560 }}>
                    <Text className="text-center font-pretendard-medium text-lg leading-7 text-[#6B7280]">
                        투자를 시작하기 위한{"\n"}시드머니를 입력해주세요
                    </Text>

                    <PortfolioStepIndicator activeStep={1} />

                    <View className="mt-8">
                        <Text className="font-pretendard-bold text-lg text-[#111827]">
                            포트폴리오 이름
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            maxLength={24}
                            placeholder="예) 안정형 포트폴리오"
                            placeholderTextColor="#A7B0BE"
                            className={`mt-3 h-16 rounded-xl border bg-white px-4 font-pretendard-medium text-base text-[#111827] ${
                                showValidation && !isNameValid
                                    ? "border-[#EF4444]"
                                    : "border-[#A7B0BE]"
                            }`}
                        />
                        {showValidation && !isNameValid && (
                            <Text className="mt-2 font-pretendard-medium text-xs text-[#EF4444]">
                                두 글자 이상의 이름을 입력해주세요.
                            </Text>
                        )}
                    </View>

                    <View className="mt-7">
                        <Text className="font-pretendard-bold text-lg text-[#111827]">
                            시작할 시드머니
                        </Text>
                        <View
                            className={`mt-3 h-16 flex-row items-center rounded-xl border bg-white px-4 ${
                                showValidation && !isSeedMoneyValid
                                    ? "border-[#EF4444]"
                                    : "border-[#A7B0BE]"
                            }`}>
                            <TextInput
                                value={seedMoney > 0 ? seedMoney.toLocaleString("ko-KR") : ""}
                                onChangeText={handleSeedMoneyChange}
                                keyboardType="number-pad"
                                placeholder="0"
                                placeholderTextColor="#A7B0BE"
                                className="flex-1 font-pretendard-bold text-xl text-[#111827]"
                            />
                            <Text className="font-pretendard-bold text-lg text-[#111827]">원</Text>
                        </View>
                        {showValidation && !isSeedMoneyValid && (
                            <Text className="mt-2 font-pretendard-medium text-xs text-[#EF4444]">
                                시드머니는 10만원 이상 입력해주세요.
                            </Text>
                        )}
                    </View>

                    <View className="mt-4 flex-row gap-2">
                        {quickAmounts.map(amount => (
                            <Pressable
                                key={amount.value}
                                onPress={() => setSeedMoney(previous => previous + amount.value)}
                                className="h-12 flex-1 items-center justify-center rounded-xl border border-[#A7B0BE] bg-white active:bg-[#EEF4FB]">
                                <Text className="font-pretendard-semibold text-xs text-[#6B7280]">
                                    +{amount.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className="mt-8 rounded-2xl bg-[#F5F8FC] px-4 py-4">
                        <Text className="font-pretendard-semibold text-sm text-[#111827]">
                            입력한 금액으로 가상 투자를 시작해요
                        </Text>
                        <Text className="mt-1 font-pretendard-regular text-xs leading-5 text-[#6B7280]">
                            실제 결제나 코인 구매는 발생하지 않으며, 다음 단계에서 원하는 코인과
                            비중을 선택할 수 있습니다.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <PortfolioBottomActions
                nextLabel="다음"
                onPrevious={() => router.back()}
                onNext={handleNext}
            />
        </KeyboardAvoidingView>
    );
}

export default PortfolioCreateStart;
