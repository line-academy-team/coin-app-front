import { Text, View } from "react-native";

interface PortfolioStepIndicatorProps {
    activeStep: 1 | 2 | 3;
}

const steps = [
    { number: 1, label: "시드머니" },
    { number: 2, label: "코인선택" },
    { number: 3, label: "최종확인" },
] as const;

function PortfolioStepIndicator({ activeStep }: PortfolioStepIndicatorProps) {
    return (
        <View className="mt-6 rounded-2xl bg-[#EEF4FB] px-4 py-5">
            <View className="relative flex-row items-start justify-between">
                <View className="absolute left-[16%] right-[16%] top-5 h-[2px] bg-[#A7B0BE]" />

                {steps.map(step => {
                    const isActive = step.number === activeStep;
                    const isComplete = step.number < activeStep;
                    const circleColor = isActive
                        ? "bg-[#0F6BFF] border-[#0F6BFF]"
                        : isComplete
                          ? "bg-[#11B5D0] border-[#11B5D0]"
                          : "bg-white border-[#A7B0BE]";
                    const labelColor = isActive
                        ? "text-[#0F6BFF]"
                        : isComplete
                          ? "text-[#11B5D0]"
                          : "text-[#6B7280]";

                    return (
                        <View key={step.number} className="w-[30%] items-center">
                            <View
                                className={`z-10 h-10 w-10 items-center justify-center rounded-full border-2 ${circleColor}`}>
                                <Text
                                    className={`font-pretendard-bold text-base ${
                                        isActive || isComplete ? "text-white" : "text-[#111827]"
                                    }`}>
                                    {step.number}
                                </Text>
                            </View>

                            <Text className={`mt-3 font-pretendard-semibold text-xs ${labelColor}`}>
                                {step.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

export default PortfolioStepIndicator;
