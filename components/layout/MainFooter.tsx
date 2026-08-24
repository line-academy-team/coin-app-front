import { Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Href, router, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface FooterMenu {
    label: string;
    href: string;
    icon: keyof typeof Ionicons.glyphMap;
    exact?: boolean;
    activePaths?: string[];
}

const userMenus: FooterMenu[] = [
    {
        label: "홈",
        href: "/user",
        icon: "home",
        exact: true,
    },
    {
        label: "코인검색",
        href: "/user/coin",
        icon: "search",
    },
    {
        label: "포트폴리오",
        href: "/user/portfolio",
        icon: "briefcase",
    },
    {
        label: "마이",
        href: "/user/my",
        icon: "person",
    },
];

function MainFooter() {
    const pathname = usePathname();

    const isActiveMenu = (menu: FooterMenu) => {
        if (menu.exact) {
            return pathname === menu.href;
        }

        if (
            menu.activePaths &&
            menu.activePaths.some(path => pathname === path || pathname.startsWith(`${path}/`))
        ) {
            return true;
        }

        return pathname === menu.href || pathname.startsWith(`${menu.href}/`);
    };

    return (
        <View
            className={twMerge(
                "h-[86px] w-full flex-row border-t border-divider bg-background-paper",
                "z-50",
            )}>
            {userMenus.map(menu => {
                const isActive = isActiveMenu(menu);

                const menuColor = isActive ? "#0F6BFF" : "#6B7280";

                return (
                    <Pressable
                        key={menu.href}
                        onPress={() => router.push(menu.href as Href)}
                        className="flex-1 items-center justify-center">
                        <Ionicons
                            name={
                                isActive
                                    ? menu.icon
                                    : (`${menu.icon}-outline` as keyof typeof Ionicons.glyphMap)
                            }
                            size={26}
                            color={menuColor}
                        />

                        <Text
                            className={twMerge(
                                "mt-1 text-xs font-pretendard-medium",
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
