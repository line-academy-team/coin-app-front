export interface PortfolioCoinOption {
    market: string;
    symbol: string;
    koreanName: string;
    currentPrice: number;
}

export interface PortfolioAllocation extends PortfolioCoinOption {
    allocation: number;
}

export interface PortfolioDraft {
    name: string;
    seedMoney: number;
    coins: PortfolioAllocation[];
}

export interface CreatedPortfolio extends PortfolioDraft {
    id: string;
    createdAt: string;
}
