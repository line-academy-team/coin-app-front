import axiosInstance, { API_BASE_URL } from "@/api/axiosInstance";
import { Coin, CoinDetail, CoinTicker } from "@/types/coin";

export const getCoins = async (): Promise<Coin[]> => {
    const response = await axiosInstance.get("/coins");
    return response.data.data;
};

export const getCoin = async (market: string): Promise<CoinDetail> => {
    const response = await axiosInstance.get(`/coins/${encodeURIComponent(market)}`);
    return response.data.data;
};

export const getCoinTicker = async (market: string): Promise<CoinTicker> => {
    const response = await axiosInstance.get(`/coins/${encodeURIComponent(market)}/ticker`);
    return response.data.data;
};

export const getCoinIconUrl = (symbol: string): string =>
    `${API_BASE_URL}/coins/icons/${encodeURIComponent(symbol.toUpperCase())}`;
