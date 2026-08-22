import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { User } from "@/types/user";

type UserState = {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;

    login: (user: User, token: string, autoLogin: boolean) => Promise<void>;

    logout: () => Promise<void>;

    updateUserInfo: (userInfo: Partial<User>) => void;

    restoreLogin: () => Promise<void>;
};

const TOKEN_KEY = "accessToken";


const customWebStorage: StateStorage = {
    getItem: name => {
        if (typeof window === "undefined") {
            return null;
        }

        return window.localStorage.getItem(name);
    },

    setItem: (name, value) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(name, value);
        }
    },

    removeItem: name => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
        }
    },
};


const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => customWebStorage)
        : createJSONStorage(() => AsyncStorage);


const saveAccessToken = async (token: string, autoLogin: boolean) => {
    if (Platform.OS === "web") {
        if (typeof window === "undefined") {
            return;
        }

        if (autoLogin) {
            window.localStorage.setItem(TOKEN_KEY, token);
            window.sessionStorage.removeItem(TOKEN_KEY);
        } else {
            window.sessionStorage.setItem(TOKEN_KEY, token);
            window.localStorage.removeItem(TOKEN_KEY);
        }

        return;
    }

    if (autoLogin) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
};


const getAccessToken = async () => {
    if (Platform.OS === "web") {
        if (typeof window === "undefined") {
            return null;
        }

        return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
    }

    return await SecureStore.getItemAsync(TOKEN_KEY);
};


const removeAccessToken = async () => {
    if (Platform.OS === "web") {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.removeItem(TOKEN_KEY);

        return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const useUserStore = create<UserState>()(
    persist(
        set => ({

            isLoggedIn: false,

            token: null,

            user: null,

            login: async (user, token, autoLogin) => {
                await saveAccessToken(token, autoLogin);

                set({
                    isLoggedIn: true,
                    token,
                    user,
                });
            },


            logout: async () => {
                await removeAccessToken();

                set({
                    isLoggedIn: false,
                    token: null,
                    user: null,
                });
            },


            updateUserInfo: userInfo =>
                set(state => {
                    if (!state.user) {
                        return state;
                    }

                    return {
                        user: {
                            ...state.user,
                            ...userInfo,
                        },
                    };
                }),


            restoreLogin: async () => {
                const token = await getAccessToken();


                if (!token) {
                    set({
                        isLoggedIn: false,
                        token: null,
                        user: null,
                    });

                    return;
                }


                set({
                    token,
                });

                try {

                    const userApi = require("@/api/user/userApi").default;

                    const user = await userApi.getMe();

                    set({
                        isLoggedIn: true,
                        token,
                        user,
                    });
                } catch (error) {
                    console.error("로그인 복원 실패:", error);

                    await removeAccessToken();

                    set({
                        isLoggedIn: false,
                        token: null,
                        user: null,
                    });
                }
            },
        }),
        {
            name: "user-storage",

            storage,

            partialize: state => ({
                user: state.user,
            }),
        },
    ),
);
