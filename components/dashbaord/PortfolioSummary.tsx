import { Image, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

function PortfolioSummary() {
    return (
        <>
            <View>
                <Text
                    className={twMerge([
                        "text-text-secondary",
                        "font-pretendard-semibold",
                        "text-base",
                    ])}>
                    오늘의 포트폴리오 현황을 확인해보세요
                </Text>
            </View>
            <View
                className={twMerge(
                    ["bg-primary-main", "rounded-xl", "p-3"],
                    ["flex-row", "justify-between"],
                )}>
                <View>
                    <Text className={twMerge(["font-pretendard-semibold text-text-light"])}>
                        총자산
                    </Text>
                    <Text className={twMerge(["font-pretendard-semibold text-text-light"])}>
                        ￦32,430,250
                    </Text>
                    <Text className={twMerge(["font-pretendard-semibold text-text-light"])}>
                        평가손익 +￦2,430,250
                    </Text>
                    <View className={"flex-row"}>
                        <Text className={twMerge(["font-pretendard-semibold text-text-light"])}>
                            수익률
                        </Text>
                        <View
                            className={twMerge(
                                ["text-text-light", "font-pretendard-semibold", "text-base"],
                                [
                                    "p-3",
                                    "rounded-xl",
                                    "bg-[#FFFFFF/10]",
                                    "border",
                                    "border-divider",
                                ],
                            )}>
                            +8.10%
                        </View>
                    </View>
                </View>
                <View>
                    <Image
                        source={require("@/assets/images/welcome/a7b6abd48871456077a8818d2955ed94772f99ec.png")}
                        style={{
                            width: 158,
                            height: 105,
                        }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </>
    );
}

export default PortfolioSummary;
