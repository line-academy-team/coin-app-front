import { Text, View } from "react-native";

import { CoinDetail, RealtimePricePoint } from "@/types/coin";

import CoinLineChart from "@/components/coin/CoinLineChart";

interface CoinInfoProps {
    coin: CoinDetail;

    realtimeData: RealtimePricePoint[];
}

const formatKRW = (value: number) => {
    return `₩${value.toLocaleString("ko-KR", {
        maximumFractionDigits: value < 1 ? 8 : value < 100 ? 4 : 0,
    })}`;
};

/**
 * 큰 금액
 *
 * 조 / 억으로 표현
 */
const formatLargeKRW = (value: number) => {
    if (value >= 1_000_000_000_000) {
        return `₩${(value / 1_000_000_000_000).toFixed(1)}조`;
    }

    if (value >= 100_000_000) {
        return `₩${(value / 100_000_000).toFixed(1)}억`;
    }

    return formatKRW(value);
};

interface InfoCardProps {
    title: string;

    value: string;
}

function InfoCard({ title, value }: InfoCardProps) {
    return (
        <View
            className="
                flex-1
                rounded-xl
                border
                border-divider
                bg-background-paper
                p-4
            ">
            <Text
                className="
                    text-sm
                    text-text-secondary
                    font-pretendard-semibold
                ">
                {title}
            </Text>

            <Text
                className="
                    mt-2
                    text-base
                    font-pretendard-bold
                    text-text-default
                ">
                {value}
            </Text>
        </View>
    );
}

export default function CoinInfo({ coin, realtimeData }: CoinInfoProps) {
    return (
        <View>
            {/* 첫 번째 줄 */}

            <View
                className="
                    flex-row
                ">
                <View
                    className="
                        mr-2
                        flex-1
                    ">
                    <InfoCard title="시가" value={formatKRW(coin.openingPrice)} />
                </View>

                <View
                    className="
                        flex-1
                    ">
                    <InfoCard title="24시간 거래대금" value={formatLargeKRW(coin.tradePrice24h)} />
                </View>
            </View>

            {/* 두 번째 줄 */}

            <View
                className="
                    mt-2
                    flex-row
                ">
                <View
                    className="
                        mr-2
                        flex-1
                    ">
                    <InfoCard title="최고가" value={formatKRW(coin.highPrice)} />
                </View>

                <View
                    className="
                        flex-1
                    ">
                    <InfoCard title="최저가" value={formatKRW(coin.lowPrice)} />
                </View>
            </View>

            {/* 실시간 작은 그래프 */}

            <View
                className="
                    mt-4
                ">
                <View
                    className="
                        mb-2
                        flex-row
                        items-center
                        justify-between
                    ">
                    <Text
                        className="
                            text-base
                            font-pretendard-bold
                            text-text-default
                        ">
                        실시간 가격
                    </Text>

                    <Text
                        className="
                            text-xs
                            text-primary-main
                        ">
                        1초 갱신
                    </Text>
                </View>

                <CoinLineChart data={realtimeData} height={130} />
            </View>
        </View>
    );
}
