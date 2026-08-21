import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useRootNavigationState } from "expo-router";

import { useUserStore } from "@/stores/user/useUserStore";

function IndexPage() {
    const navigationState = useRootNavigationState();

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!navigationState?.key) {
            return;
        }
        if (hasInitialized.current) {
            return;
        }

        hasInitialized.current = true;
        let isMounted = true;

        const initializeAuth = async () => {
            try {
                if (!useUserStore.persist.hasHydrated()) {
                    await new Promise<void>(resolve => {
                        const unsubscribe = useUserStore.persist.onFinishHydration(() => {
                            unsubscribe();
                            resolve();
                        });
                    });
                }

                if (!isMounted) {
                    return;
                }

                const currentState = useUserStore.getState();
                if (!currentState.isLoggedIn || !currentState.token) {
                    await currentState.restoreLogin();
                }

                if (!isMounted) {
                    return;
                }

                const { isLoggedIn, token, user, logout } = useUserStore.getState();

                if (!isLoggedIn || !token || !user) {
                    router.replace("/welcome");
                    return;
                }

                if (!user.id || !user.email || !user.nickname) {
                    await logout();

                    if (isMounted) {
                        router.replace("/auth/login");
                    }

                    return;
                }

                router.replace("/user");
            } catch (error) {
                console.error("초기 로그인 검증 실패:", error);

                await useUserStore.getState().logout();

                if (isMounted) {
                    router.replace("/auth/login");
                }
            }
        };

        void initializeAuth();

        return () => {
            isMounted = false;
        };
    }, [navigationState?.key]);

    return (
        <View className="flex-1 items-center justify-center bg-background-paper">
            <ActivityIndicator size="large" color="#2288ED" />
        </View>
    );
}

export default IndexPage;