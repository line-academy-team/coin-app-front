import React, { ReactNode, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
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
                    <View className="absolute top-[80px] right-[24px] w-[200px] rounded-2xl bg-white overflow-hidden shadow-lg">
                        {/* 마이페이지 */}
                        <TouchableOpacity
                            onPress={handleMyPage}
                            className="flex-row items-center gap-3 px-5 py-4 border-b border-gray-100 active:bg-gray-50">
                            <Ionicons name="person-outline" size={20} color="#111827" />

                            <Text className="font-pretendard-bold text-base text-text-main">
                                마이페이지
                            </Text>
                        </TouchableOpacity>

                        {/* 로그아웃 */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center gap-3 px-5 py-4 active:bg-gray-50">
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />

                            <Text className="font-pretendard-bold text-base text-red-500">
                                로그아웃
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        );
    };

    /*
     * 메인 Header
     */
    if (isMain) {
        return (
            <>
                <LinearGradient
                    colors={["#095EE6", "#2288ED"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                        width: "100%",
                        height: 88,
                        position: "relative",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 24,
                    }}>
                    {/* 배경 장식 */}
                    <Svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 800 88"
                        preserveAspectRatio="none"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}>
                        <Path
                            d="
                                M 0 0
                                L 560 0
                                C 580 10, 390 88, 250 88
                                L 0 88
                                Z
                            "
                            fill="rgba(255,255,255,0.08)"
                        />
                    </Svg>

                    {/* Logo */}
                    <View className="flex-row items-center gap-3 z-10">
                        <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
                            <Ionicons name="pie-chart-outline" size={25} color="#FFFFFF" />
                        </View>

                        <View>
                            <Text className="font-pretendard-bold text-[22px] text-white">
                                Coin Portfolio
                            </Text>

                            <Text className="font-pretendard-medium text-xs text-white/80">
                                가상 자산 포트폴리오
                            </Text>
                        </View>
                    </View>

                    {/* Menu */}
                    {showMenu && (
                        <Pressable
                            onPress={() => setModalVisible(true)}
                            className="z-10 w-10 h-10 items-center justify-center">
                            <Ionicons name="menu-outline" size={30} color="#FFFFFF" />
                        </Pressable>
                    )}
                </LinearGradient>

                {renderMenuModal()}
            </>
        );
    }

    /*
     * Sub Header
     */
    return (
        <View
            className="w-full h-[72px] bg-white flex-row items-center justify-between px-5"
            style={
                !isBackPress
                    ? {
                          shadowColor: "#000000",
                          shadowOffset: {
                              width: 0,
                              height: 3,
                          },
                          shadowOpacity: 0.04,
                          shadowRadius: 8,
                          elevation: 3,
                      }
                    : undefined
            }>
            <View className="flex-row items-center gap-3">
                {/* 뒤로가기 */}
                {isBackPress && (
                    <Pressable
                        onPress={onBackPress ? onBackPress : () => router.back()}
                        className="w-9 h-9 items-center justify-center">
                        <Text className="font-pretendard-regular text-[38px] leading-9 text-[#111827]">
                            ‹
                        </Text>
                    </Pressable>
                )}

                {/* Title */}
                <View>
                    {customTitle ? (
                        customTitle
                    ) : (
                        <Text className="font-pretendard-bold text-xl text-text-main">{title}</Text>
                    )}
                </View>
            </View>
        </View>
    );
}

export default MainHeader;
