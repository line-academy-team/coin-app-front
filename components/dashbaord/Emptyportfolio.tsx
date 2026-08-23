import { Image, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { AntDesign, Ionicons } from "@expo/vector-icons";

function EmptyPortfolio() {
    return (
        <>
            <View>
                <Text
                    className={twMerge([
                        "text-text-secondary",
                        "font-pretendard-semibold",
                        "text-base",
                    ])}>
                    지금이 바로 시작할 시간이에요. {"\n"}
                    나만의 가상 포트폴리오를 만들어 보세요.
                </Text>
            </View>

            <View className="items-center justify-center">
                <Image
                    source={require("@/assets/images/main/main_page_img.png")}
                    style={{
                        width: 273,
                        height: 182,
                        marginVertical: 20,
                    }}
                    resizeMode="contain"
                />
            </View>

            <View className="gap-4">
                <View
                    className={twMerge(
                        ["flex-row", "gap-3", "items-center"],
                        ["p-2", "rounded-xl"],
                        ["border", "border-secondary-main", "bg-background-paper"],
                    )}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-11", "h-11", "rounded-xl", "bg-secondary-main"],
                        )}>
                        <Ionicons name="trending-up" size={24} color="#FFFFFF" />
                    </View>

                    <Text
                        className={twMerge([
                            "font-pretendard-semibold",
                            "text-xl",
                            "text-text-default",
                        ])}>
                        실제 투자 없이 시뮬레이션
                    </Text>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "gap-3", "items-center"],
                        ["p-2", "rounded-xl"],
                        ["border", "border-secondary-chart", "bg-background-paper"],
                    )}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-11", "h-11", "rounded-xl", "bg-secondary-chart"],
                        )}>
                        <AntDesign name="dollar" size={24} color="#FFFFFF" />
                    </View>

                    <Text
                        className={twMerge([
                            "font-pretendard-semibold",
                            "text-xl",
                            "text-text-default",
                        ])}>
                        다양한 코인으로 포트폴리오 구성
                    </Text>
                </View>

                <View
                    className={twMerge(
                        ["flex-row", "gap-3", "items-center"],
                        ["p-2", "rounded-xl"],
                        ["border", "border-warning-main", "bg-background-paper"],
                    )}>
                    <View
                        className={twMerge(
                            ["justify-center", "items-center"],
                            ["w-11", "h-11", "rounded-xl", "bg-warning-main"],
                        )}>
                        <Ionicons name="bar-chart" size={24} color="#FFFFFF" />
                    </View>

                    <Text
                        className={twMerge([
                            "font-pretendard-semibold",
                            "text-xl",
                            "text-text-default",
                        ])}>
                        과거 데이터를 통한 수익률 확인
                    </Text>
                </View>
            </View>
        </>
    );
}

export default EmptyPortfolio;
