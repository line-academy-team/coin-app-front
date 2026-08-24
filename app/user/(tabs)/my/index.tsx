import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Href, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import userApi from "@/api/user/userApi";
import MainHeader from "@/components/layout/MainHeader";
import { useUserStore } from "@/stores/user/useUserStore";

function MyPage() {
    const user = useUserStore(state => state.user);
    const updateUserInfo = useUserStore(state => state.updateUserInfo);
    const logout = useUserStore(state => state.logout);
    const token = useUserStore(state => state.token);
    const [isLoading, setIsLoading] = useState(!user);

    useFocusEffect(
        useCallback(() => {
            if (!token) {
                return;
            }

            let active = true;
            const load = async () => {
                try {
                    const currentUser = await userApi.getMe();
                    if (active) {
                        updateUserInfo(currentUser);
                    }
                } catch {
                    if (active && !useUserStore.getState().user) {
                        await logout();
                        router.replace("/auth/login" as Href);
                    }
                } finally {
                    if (active) {
                        setIsLoading(false);
                    }
                }
            };
            void load();
            return () => {
                active = false;
            };
        }, [logout, token, updateUserInfo]),
    );

    const handleLogout = async () => {
        await logout();
        router.replace("/auth/login" as Href);
    };

    const joinedAt = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
          })
        : "-";

    return (
        <View className="flex-1 bg-background-default">
            <MainHeader title="마이" />
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0F6BFF" />
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
                    <View className="w-full max-w-[560px] self-center items-center">
                        <View className="mt-8 h-24 w-24 items-center justify-center rounded-full bg-[#E5E7EB]">
                            <Ionicons name="person" size={48} color="#3B82F6" />
                        </View>
                        <Text className="mt-5 font-pretendard-bold text-3xl text-text-default">
                            {user?.nickname || "사용자"}
                        </Text>

                        <View className="mt-10 w-full overflow-hidden rounded-2xl bg-white">
                            <View className="flex-row items-center justify-between border-b border-divider px-5 py-6">
                                <Text className="font-pretendard-bold text-lg text-text-secondary">
                                    이메일
                                </Text>
                                <Text className="ml-4 flex-1 text-right font-pretendard-medium text-base text-text-secondary">
                                    {user?.email || "-"}
                                </Text>
                            </View>
                            <View className="flex-row items-center justify-between px-5 py-6">
                                <Text className="font-pretendard-bold text-lg text-text-secondary">
                                    가입일
                                </Text>
                                <Text className="font-pretendard-medium text-base text-text-secondary">
                                    {joinedAt}
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => router.push("/user/settings/password" as Href)}
                            className="mt-12 h-16 w-full items-center justify-center rounded-xl bg-primary-main">
                            <Text className="font-pretendard-bold text-xl text-white">
                                비밀번호 변경
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => void handleLogout()}
                            className="mt-4 h-16 w-full items-center justify-center rounded-xl border border-primary-main bg-white">
                            <Text className="font-pretendard-bold text-xl text-primary-main">
                                로그아웃
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

export default MyPage;
