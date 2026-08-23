import { Ionicons } from "@expo/vector-icons";
import { CreatePortfolioItemRequest, PortfolioItem } from "@/types/portfolioItem";

export interface Portfolio {
    id: number;
    createdAt: string;
    title: string;
    totalSeedMoney: number;
    tags: string;
    icon: keyof typeof Ionicons.glyphMap;
    coins: PortfolioItem[];
}

export interface CreatePortfolioRequest {
    title: string;
    totalSeedMoney: number;
    items: CreatePortfolioItemRequest[];
}

export type UpdatePortfolioRequest = CreatePortfolioRequest;

export interface PortfolioCoinOption {
    market: string;
    symbol: string;
    koreanName: string;
    currentPrice: number;
}

export interface PortfolioAllocation extends PortfolioCoinOption {
    allocation: number;
}

export type CalculatedPortfolio = Portfolio & {
    returnRate: number;
    currentTotalValue: number;
};
