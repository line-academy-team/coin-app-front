import { Coin } from "@/types/coin";
import { Portfolio, PortfolioAllocation, PortfolioCoinOption } from "@/types/portfolio";

export const toCoinMap = (coins: Coin[]) => new Map(coins.map(coin => [coin.market, coin]));

export const getItemMetrics = (portfolio: Portfolio, coins: Coin[]) => {
    const coinMap = toCoinMap(coins);

    return portfolio.coins.map(item => {
        const marketCoin = coinMap.get(item.market);
        const currentPrice = marketCoin?.price ?? item.buyPrice;
        const currentValue = currentPrice * item.quantity;
        const investedValue = item.buyPrice * item.quantity;
        const returnRate =
            investedValue > 0 ? ((currentValue - investedValue) / investedValue) * 100 : 0;

        return {
            ...item,
            symbol: marketCoin?.symbol ?? item.market.split("-")[1],
            koreanName: marketCoin?.koreanName ?? item.market,
            currentPrice,
            currentValue,
            investedValue,
            returnRate,
        };
    });
};

export const getPortfolioMetrics = (portfolio: Portfolio, coins: Coin[]) => {
    const items = getItemMetrics(portfolio, coins);
    const currentTotalValue = items.reduce((total, item) => total + item.currentValue, 0);
    const effectiveValue = currentTotalValue || portfolio.totalSeedMoney;
    const profit = effectiveValue - portfolio.totalSeedMoney;
    const returnRate = portfolio.totalSeedMoney > 0 ? (profit / portfolio.totalSeedMoney) * 100 : 0;

    return { items, currentTotalValue: effectiveValue, profit, returnRate };
};

export const toPortfolioAllocations = (
    portfolio: Portfolio,
    coins: Coin[],
): PortfolioAllocation[] => {
    const coinMap = toCoinMap(coins);

    return portfolio.coins.map(item => {
        const marketCoin = coinMap.get(item.market);

        return {
            market: item.market,
            symbol: marketCoin?.symbol ?? item.market.split("-")[1],
            koreanName: marketCoin?.koreanName ?? item.market,
            currentPrice: marketCoin?.price ?? item.buyPrice,
            allocation: Number(item.targetRatio),
        };
    });
};

export const toCoinOption = (coin: Coin): PortfolioCoinOption => ({
    market: coin.market,
    symbol: coin.symbol,
    koreanName: coin.koreanName,
    currentPrice: coin.price,
});
