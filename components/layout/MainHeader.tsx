import React, { ReactNode, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useUserStore } from "@/stores/user/useUserStore";

type HeaderVariant = "main" | "sub";

interface MainHeaderProps {
    variant?: HeaderVariant;

    title?: string;
    customTitle?: ReactNode;

    isBackPress?: boolean;
    onBackPress?: () => void;

    showMenu?: boolean;
}

function MainHeader({
    variant = "sub",
    title,
    customTitle,
    isBackPress = false,
    onBackPress,
    showMenu = false,
}: MainHeaderProps) {
    const [isModalVisible, setModalVisible] = useState(false);

    const logout = useUserStore(state => state.logout);

    const handleLogout = async () => {
        setModalVisible(false);

        await logout();

        router.replace("/auth/login");
    };

    const handleMyPage = () => {
        setModalVisible(false);

        router.push("/user/my");
    };

    return (
        <>
            <View className="w-full h-[80px] flex-row items-center justify-between px-5 relative">
                {isBackPress ? (
                    <Pressable onPress={onBackPress ? onBackPress : () => router.back()}>
                        <Ionicons name={"chevron-back-outline"} size={24} />
                    </Pressable>
                ) : (
                    <View className="w-10 h-10" />
                )}

                <View
                    pointerEvents="none"
                    className="absolute left-0 right-0 items-center justify-center">
                    {customTitle ? (
                        customTitle
                    ) : (
                        <Text className="font-pretendard-bold text-[24px] text-text-default text-center">
                            {title}
                        </Text>
                    )}
                </View>

                {showMenu ? (
                    <Pressable
                        onPress={() => setModalVisible(true)}
                        className="w-10 h-10 items-center justify-center z-10">
                        <Ionicons name="menu-outline" size={28} color="#111827" />
                    </Pressable>
                ) : (
                    <View className="w-10 h-10" />
                )}
            </View>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}>
                <Pressable className="flex-1 bg-black/40" onPress={() => setModalVisible(false)}>
                    <View className="absolute top-[80px] right-[24px] w-[200px] bg-background-paper rounded-2xl overflow-hidden">
                        <TouchableOpacity
                            onPress={handleMyPage}
                            className="flex-row items-center gap-3 px-5 py-4 border-b border-divider active:bg-gray-50">
                            <Ionicons name="person-outline" size={20} color="#111827" />

                            <Text className="font-pretendard-bold text-base text-text-default">
                                마이페이지
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center gap-3 px-5 py-4 active:bg-gray-50">
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />

                            <Text className="font-pretendard-bold text-base text-error-main">
                                로그아웃
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

export default MainHeader;
