import { create } from "axios";
import { Platform } from "react-native";
import { useUserStore } from "@/stores/user/useUserStore";

const defaultBaseUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || defaultBaseUrl).replace(/\/$/, "");

const api = create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

api.interceptors.request.use(config => {
    const token = useUserStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
