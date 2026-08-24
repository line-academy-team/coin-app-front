import { CalculatedPortfolio, Portfolio } from "@/types/portfolio";
import { Coin } from "@/types/coin";

const calculatePortfolioReturns = (
    portfolios: Portfolio[],
    upbitCoins: Coin[],
): CalculatedPortfolio[] => {
    const currentPriceMap = new Map<string, number>(
        upbitCoins.map(coin => [coin.market, coin.price]),
    );

    return portfolios.map(portfolio => {
        if (!portfolio.coins || portfolio.coins.length === 0) {
            return {
                ...portfolio,
                returnRate: 0,
                currentTotalValue: portfolio.totalSeedMoney,
            };
        }

        let currentTotalValue = 0;

        portfolio.coins.forEach(coin => {
            const currentPrice = currentPriceMap.get(coin.market);

            currentTotalValue += currentPrice
                ? currentPrice * coin.quantity
                : portfolio.totalSeedMoney * (coin.targetRatio / 100);
        });

        const totalReturnRate =
            portfolio.totalSeedMoney > 0
                ? ((currentTotalValue - portfolio.totalSeedMoney) / portfolio.totalSeedMoney) * 100
                : 0;

        return {
            ...portfolio,
            returnRate: Number(totalReturnRate.toFixed(2)),
            currentTotalValue: Math.floor(currentTotalValue),
        };
    });
};

const getPortfolioTags = (portfolio: Portfolio) =>
    portfolio.coins
        .slice(0, 3)
        .map(coin => `${coin.market.split("-")[1]} ${Number(coin.targetRatio)}%`)
        .join(" · ");

export default {
    calculatePortfolioReturns,
    getPortfolioTags,
};
