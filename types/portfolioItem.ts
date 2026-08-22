export interface PortfolioItem {
    id: number;
    market: string;
    targetRatio: number;
    buyPrice: number;
    quantity: number;
}

export interface CreatePortfolioItemRequest {
    market: string;
    targetRatio: number;
    buyPrice: number;
    quantity: number;
}
