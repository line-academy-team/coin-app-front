import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Href, router, Stack } from "expo-router";

import { useUserStore } from "@/stores/user/useUserStore";

function UserLayout() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let active = true;

        const prepareAuthenticatedArea = async () => {
            if (!useUserStore.persist.hasHydrated()) {
                await new Promise<void>(resolve => {
                    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
                        unsubscribe();
                        resolve();
                    });
                });
            }

            const state = useUserStore.getState();
            if (!state.isLoggedIn || !state.token || !state.user) {
                await state.restoreLogin();
            }

            if (!active) {
                return;
            }

            const restored = useUserStore.getState();
            if (!restored.isLoggedIn || !restored.token || !restored.user) {
                router.replace("/auth/login" as Href);
                return;
            }

            setIsReady(true);
        };

        void prepareAuthenticatedArea();

        return () => {
            active = false;
        };
    }, []);

    if (!isReady) {
        return (
            <View className="flex-1 items-center justify-center bg-background-paper">
                <ActivityIndicator size="large" color="#2288ED" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}

export default UserLayout;
