export interface Coin {
    market: string;

    symbol: string;

    koreanName: string;
    englishName: string;

    price: number;
    changeRate: number;
}

export interface CoinDetail extends Coin {
    changePrice: number;

    openingPrice: number;

    highPrice: number;
    lowPrice: number;

    tradePrice24h: number;
    tradeVolume24h: number;

    timestamp: number;
}

export interface CoinTicker {
    price: number;

    changePrice: number;
    changeRate: number;

    openingPrice: number;
    highPrice: number;
    lowPrice: number;

    tradePrice24h: number;
    tradeVolume24h: number;

    timestamp: number;
}

export interface RealtimePricePoint {
    timestamp: number;

    time: string;

    price: number;
}
