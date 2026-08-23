import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteCoinState {
    markets: string[];
    toggle: (market: string) => void;
    has: (market: string) => boolean;
}

const webStorage = {
    getItem: (name: string) =>
        typeof window === "undefined" ? null : window.localStorage.getItem(name),
    setItem: (name: string, value: string) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(name, value);
        }
    },
    removeItem: (name: string) => {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
        }
    },
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => webStorage)
        : createJSONStorage(() => AsyncStorage);

export const useFavoriteCoinStore = create<FavoriteCoinState>()(
    persist(
        (set, get) => ({
            markets: [],
            toggle: market =>
                set(state => ({
                    markets: state.markets.includes(market)
                        ? state.markets.filter(item => item !== market)
                        : [...state.markets, market],
                })),
            has: market => get().markets.includes(market),
        }),
        { name: "favorite-coin-storage", storage },
    ),
);
