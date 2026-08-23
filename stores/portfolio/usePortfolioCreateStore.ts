import { create } from "zustand";

import { Portfolio, PortfolioAllocation, PortfolioCoinOption } from "@/types/portfolio";

export const RECOMMENDED_PORTFOLIO_COINS: PortfolioAllocation[] = [
    {
        market: "KRW-BTC",
        symbol: "BTC",
        koreanName: "비트코인",
        currentPrice: 0,
        allocation: 50,
    },
    {
        market: "KRW-ETH",
        symbol: "ETH",
        koreanName: "이더리움",
        currentPrice: 0,
        allocation: 30,
    },
    {
        market: "KRW-XRP",
        symbol: "XRP",
        koreanName: "리플",
        currentPrice: 0,
        allocation: 20,
    },
];

interface PortfolioCreateState {
    name: string;
    seedMoney: number;
    coins: PortfolioAllocation[];
    createdPortfolio: Portfolio | null;
    setBasics: (name: string, seedMoney: number) => void;
    ensureRecommendedCoins: () => void;
    syncCoinMarketData: (coins: PortfolioCoinOption[]) => void;
    toggleCoin: (coin: PortfolioCoinOption) => void;
    setAllocation: (market: string, allocation: number) => void;
    changeAllocation: (market: string, direction: -1 | 1) => void;
    setCreatedPortfolio: (portfolio: Portfolio) => void;
    resetDraft: () => void;
}

const clampAllocation = (allocation: number) => Math.min(100, Math.max(0, Math.round(allocation)));

export const usePortfolioCreateStore = create<PortfolioCreateState>(set => ({
    name: "",
    seedMoney: 10_000_000,
    coins: [],
    createdPortfolio: null,

    setBasics: (name, seedMoney) => set({ name, seedMoney }),

    ensureRecommendedCoins: () =>
        set(state =>
            state.coins.length > 0
                ? state
                : { coins: RECOMMENDED_PORTFOLIO_COINS.map(coin => ({ ...coin })) },
        ),

    syncCoinMarketData: marketCoins =>
        set(state => {
            const marketMap = new Map(marketCoins.map(coin => [coin.market, coin]));

            return {
                coins: state.coins.map(coin => {
                    const marketCoin = marketMap.get(coin.market);

                    return marketCoin
                        ? {
                              ...coin,
                              symbol: marketCoin.symbol,
                              koreanName: marketCoin.koreanName,
                              currentPrice: marketCoin.currentPrice,
                          }
                        : coin;
                }),
            };
        }),

    toggleCoin: coin =>
        set(state => {
            const selected = state.coins.find(item => item.market === coin.market);

            if (selected) {
                return { coins: state.coins.filter(item => item.market !== coin.market) };
            }

            return { coins: [...state.coins, { ...coin, allocation: 0 }] };
        }),

    setAllocation: (market, allocation) =>
        set(state => ({
            coins: state.coins.map(coin =>
                coin.market === market
                    ? { ...coin, allocation: clampAllocation(allocation) }
                    : coin,
            ),
        })),

    changeAllocation: (market, direction) =>
        set(state => ({
            coins: state.coins.map(coin =>
                coin.market === market
                    ? {
                          ...coin,
                          allocation: clampAllocation(coin.allocation + direction * 5),
                      }
                    : coin,
            ),
        })),

    setCreatedPortfolio: createdPortfolio => set({ createdPortfolio }),

    resetDraft: () =>
        set({
            name: "",
            seedMoney: 10_000_000,
            coins: [],
            createdPortfolio: null,
        }),
}));
