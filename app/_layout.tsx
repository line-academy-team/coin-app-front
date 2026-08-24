import "../styles/global.css";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme/useThemeStore";

export const unstable_settings = {
    anchor: "user",
};

SplashScreen.preventAutoHideAsync().then(() => {});

export default function RootLayout() {
    const { theme } = useThemeStore();

    const [loaded, error] = useFonts({
        "Pretendard-Thin": require("@/assets/fonts/Pretendard-Thin.otf"),
        "Pretendard-ExtraLight": require("@/assets/fonts/Pretendard-ExtraLight.otf"),
        "Pretendard-Light": require("@/assets/fonts/Pretendard-Light.otf"),
        "Pretendard-Regular": require("@/assets/fonts/Pretendard-Regular.otf"),
        "Pretendard-Medium": require("@/assets/fonts/Pretendard-Medium.otf"),
        "Pretendard-SemiBold": require("@/assets/fonts/Pretendard-SemiBold.otf"),
        "Pretendard-Bold": require("@/assets/fonts/Pretendard-Bold.otf"),
        "Pretendard-ExtraBold": require("@/assets/fonts/Pretendard-ExtraBold.otf"),
        "Pretendard-Black": require("@/assets/fonts/Pretendard-Black.otf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync().then(() => {});
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <SafeAreaView className={"flex-1"}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
