import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Href, router, usePathname } from "expo-router";
import { IconType } from "react-icons";
import { FiBriefcase, FiHome, FiSearch, FiUser } from "react-icons/fi";

interface FooterMenu {
    label: string;
    href: string;
    icon: IconType;
    exact?: boolean;
    activePaths?: string[];
}

const userMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/user",
        icon: FiHome,
        exact: true,
    },
    {
        label: "코인검색",
        href: "/user/coin",
        icon: FiSearch,
    },
    {
        label: "포트폴리오",
        href: "/user/portfolio",
        icon: FiBriefcase,
    },
    {
        label: "마이",
        href: "/user/my",
        icon: FiUser,
    },
];

function MainFooter() {
    const pathname = usePathname();

    const isActiveMenu = (menu: FooterMenu) => {
        // 홈은 /user에서만 활성화
        if (menu.exact) {
            return pathname === menu.href;
        }

        // 추가 활성화 경로가 있을 경우
        if (
            menu.activePaths &&
            menu.activePaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
        ) {
            return true;
        }

        // 현재 경로 또는 하위 경로일 경우 활성화
        return pathname === menu.href || pathname.startsWith(`${menu.href}/`);
    };

    return (
        <View className={twMerge("h-[100px] w-full flex-row bg-background-paper", "z-50")}>
            {userMenus.map(menu => {
                const Icon = menu.icon;
                const isActive = isActiveMenu(menu);

                const menuColor = isActive ? "#0F6BFF" : "#6B7280";

                return (
                    <Pressable
                        key={menu.href}
                        onPress={() => router.push(menu.href as Href)}
                        className="flex-1 items-center justify-center">
                        <Icon size={24} color={menuColor} />

                        <Text
                            className={twMerge(
                                "mt-2 font-pretendard-medium",
                                isActive && "font-pretendard-semibold",
                            )}
                            style={{
                                color: menuColor,
                            }}>
                            {menu.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default MainFooter;
