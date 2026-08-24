import { Coin, CoinDetail, UpbitMarket, UpbitTicker } from "@/types/coin";

const UPBIT_API_URL = "https://api.upbit.com/v1";


export const getCoins = async (): Promise<Coin[]> => {
    const [marketResponse, tickerResponse] = await Promise.all([
        fetch(`${UPBIT_API_URL}/market/all`),

        fetch(`${UPBIT_API_URL}/ticker/all?quote_currencies=KRW`),
    ]);

    if (!marketResponse.ok) {
        throw new Error("업비트 마켓 정보를 불러오지 못했습니다.");
    }

    if (!tickerResponse.ok) {
        throw new Error("업비트 현재가 정보를 불러오지 못했습니다.");
    }

    const markets: UpbitMarket[] = await marketResponse.json();

    const tickers: UpbitTicker[] = await tickerResponse.json();

    const marketMap = new Map<string, UpbitMarket>(markets.map(item => [item.market, item]));

    return tickers
        .filter(item => item.market.startsWith("KRW-"))
        .map(item => {
            const marketInfo = marketMap.get(item.market);

            return {
                market: item.market,

                symbol: item.market.split("-")[1],

                koreanName: marketInfo?.korean_name ?? "",

                englishName: marketInfo?.english_name ?? "",

                price: item.trade_price,

                changeRate: item.signed_change_rate * 100,
            };
        });
};


export const getCoin = async (market: string): Promise<CoinDetail> => {
    const [marketResponse, tickerResponse] = await Promise.all([
        fetch(`${UPBIT_API_URL}/market/all`),

        fetch(`${UPBIT_API_URL}/ticker?markets=${encodeURIComponent(market)}`),
    ]);

    if (!marketResponse.ok) {
        throw new Error("업비트 마켓 정보를 불러오지 못했습니다.");
    }

    if (!tickerResponse.ok) {
        throw new Error("업비트 현재가 정보를 불러오지 못했습니다.");
    }

    const markets: UpbitMarket[] = await marketResponse.json();

    const tickers: UpbitTicker[] = await tickerResponse.json();

    const ticker = tickers[0];

    if (!ticker) {
        throw new Error("해당 코인 정보를 찾을 수 없습니다.");
    }

    const marketInfo = markets.find(item => item.market === ticker.market);

    return {
        market: ticker.market,

        symbol: ticker.market.split("-")[1],

        koreanName: marketInfo?.korean_name ?? "",

        englishName: marketInfo?.english_name ?? "",


        price: ticker.trade_price,


        changePrice: ticker.signed_change_price,


        changeRate: ticker.signed_change_rate * 100,


        openingPrice: ticker.opening_price,


        highPrice: ticker.high_price,


        lowPrice: ticker.low_price,


        tradePrice24h: ticker.acc_trade_price_24h,


        tradeVolume24h: ticker.acc_trade_volume_24h,

        timestamp: ticker.timestamp,
    };
};


export const getCoinTicker = async (market: string): Promise<UpbitTicker> => {
    const response = await fetch(`${UPBIT_API_URL}/ticker?markets=${encodeURIComponent(market)}`);

    if (!response.ok) {
        throw new Error(`현재가 조회 실패: ${response.status}`);
    }

    const data: UpbitTicker[] = await response.json();

    const ticker = data[0];

    if (!ticker) {
        throw new Error("현재가 정보가 없습니다.");
    }

    return ticker;
};
