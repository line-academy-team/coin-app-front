import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/common/button/Button";

function WelcomePage() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-primary-main">
            <View className="flex-1 bg-background-paper m-6 rounded-xl items-center justify-center px-6 py-12">
                <View className={"pt-10"}>
                    <Text className="text-4xl font-pretendard-bold text-primary-main mb-4 text-center">
                        CoinFolio
                    </Text>
                    <Text className="text-lg font-pretendard-bold text-text-default mb-6">
                        가상의 투자로, 더 나은 내일을
                    </Text>
                    <Text className="text-center text-text-secondary font-pretendard text-sm mb-10 leading-6">
                        실제 투자 없이{"\n"}
                        쉽게 시작하는{"\n"}
                        나만의 암호화폐 포트폴리오
                    </Text>
                </View>
                <View>
                    <Image
                        source={require("@/assets/images/welcome/a7b6abd48871456077a8818d2955ed94772f99ec.png")}
                        style={{ width: 340, height: 226, marginBottom: 48 }}
                        resizeMode="contain"
                    />
                </View>

                <View className="w-full gap-y-3 mt-auto">
                    <Button
                        variant="solid"
                        color={"primary"}
                        onPress={() => router.push("/auth/register")}>
                        시작하기
                    </Button>

                    <Button
                        variant="outline"
                        onPress={() => router.push("/auth/login")}
                        color={"primary"}>
                        로그인
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default WelcomePage;
