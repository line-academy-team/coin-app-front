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

    const isMain = variant === "main";

    const handleLogout = async () => {
        setModalVisible(false);

        await logout();

        router.replace("/auth/login");
    };

    const handleMyPage = () => {
        setModalVisible(false);

        router.push("/user/my");
    };

    const renderMenuModal = () => {
        return (
            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}>
                <Pressable className="flex-1 bg-black/40" onPress={() => setModalVisible(false)}>
                    <View className="absolute top-[80px] right-[24px] w-[200px] rounded-2xl bg-background-paper overflow-hidden">
                        {/* 마이페이지 */}
                        <TouchableOpacity
                            onPress={handleMyPage}
                            className="flex-row items-center gap-3 px-5 py-4 border-b border-divider active:bg-gray-50">
                            <Ionicons name="person-outline" size={20} color="#111827" />

                            <Text className="font-pretendard-bold text-base text-text-default">
                                마이페이지
                            </Text>
                        </TouchableOpacity>

                        {/* 로그아웃 */}
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
        );
    };

    /*
     * Main Header
     */
    if (isMain) {
        return (
            <>
                <View className="w-full h-[88px] flex-row items-center justify-between px-6">
                    {/* Logo */}
                    <View>
                        <Text className="font-pretendard-bold text-[22px] text-text-default">
                            Coin Portfolio
                        </Text>

                        <Text className="font-pretendard-medium text-xs text-text-secondary">
                            가상 자산 포트폴리오
                        </Text>
                    </View>

                    {/* Menu */}
                    {showMenu && (
                        <Pressable
                            onPress={() => setModalVisible(true)}
                            className="w-10 h-10 items-center justify-center">
                            <Ionicons name="menu-outline" size={30} color="#111827" />
                        </Pressable>
                    )}
                </View>

                {renderMenuModal()}
            </>
        );
    }

    /*
     * Sub Header
     */
    return (
        <View className="relative w-full h-[72px] flex-row items-center px-5">
            {/* 뒤로가기 */}
            {isBackPress && (
                <Pressable
                    onPress={onBackPress ? onBackPress : () => router.back()}
                    className="z-10 w-9 h-9 items-center justify-center">
                    <Ionicons name="chevron-back-outline" size={26} color="#111827" />
                </Pressable>
            )}

            {/* Title */}
            <View className="absolute left-0 right-0 items-center justify-center">
                {customTitle ? (
                    customTitle
                ) : (
                    <Text className="font-pretendard-bold text-xl text-text-default">{title}</Text>
                )}
            </View>
        </View>
    );
}

export default MainHeader;
