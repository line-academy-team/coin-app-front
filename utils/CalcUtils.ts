import { CalculatedPortfolio, Portfolio } from "@/types/portfolio";

const calculatePortfolioReturns = (
    portfolios: Portfolio[],
    upbitCoins: any[],
): CalculatedPortfolio[] => {
    // 업비트 현재가를 쉽게 찾기 위한 Map 생성
    const currentPriceMap = new Map<string, number>(
        upbitCoins.map(coin => [coin.market, coin.price]),
    );

    return portfolios.map(portfolio => {
        let totalReturnRate = 0;

        // 코인이 없으면 수익률 0, 현재 가치는 원금 그대로 반환 (items -> coins로 수정)
        if (!portfolio.coins || portfolio.coins.length === 0) {
            return {
                ...portfolio,
                returnRate: 0,
                currentTotalValue: portfolio.totalSeedMoney, // totalAmount -> totalSeedMoney
            };
        }

        portfolio.coins.forEach(coin => {
            const currentPrice = currentPriceMap.get(coin.market);

            if (currentPrice && coin.buyPrice > 0) {
                // 개별 코인 수익률 (%)
                const coinReturnRate = ((currentPrice - coin.buyPrice) / coin.buyPrice) * 100;

                // 포트폴리오 전체 수익률에 비중(targetRatio)만큼 반영
                totalReturnRate += coinReturnRate * (coin.targetRatio / 100);
            }
        });

        // 현재 총 자산 가치 계산
        const currentTotalValue = portfolio.totalSeedMoney * (1 + totalReturnRate / 100);

        return {
            ...portfolio,
            returnRate: Number(totalReturnRate.toFixed(2)),
            currentTotalValue: Math.floor(currentTotalValue), // 원단위 절사
        };
    });
};

export default {
    calculatePortfolioReturns,
};
