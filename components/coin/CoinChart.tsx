import { Text, View } from "react-native";

import { CoinDetail, RealtimePricePoint } from "@/types/coin";

import CoinLineChart from "@/components/coin/CoinLineChart";

interface CoinChartProps {
    coin: CoinDetail;

    realtimeData: RealtimePricePoint[];
}

const formatKRW = (value: number) => {
    return `₩${value.toLocaleString("ko-KR", {
        maximumFractionDigits: value < 1 ? 8 : value < 100 ? 4 : 0,
    })}`;
};

interface PriceRowProps {
    label: string;

    value: string;

    valueClassName?: string;
}

function PriceRow({ label, value, valueClassName }: PriceRowProps) {
    return (
        <View
            className="
                flex-row
                items-center
                justify-between
                border-b
                border-[#EEF0F3]
                py-4
            ">
            <Text
                className="
                    text-sm
                    text-gray-500
                ">
                {label}
            </Text>

            <Text
                className={`
                    text-sm
                    font-bold
                    ${valueClassName ?? "text-[#111827]"}
                `}>
                {value}
            </Text>
        </View>
    );
}

export default function CoinChart({ coin, realtimeData }: CoinChartProps) {
    const changeRateText =
        coin.changeRate > 0 ? `+${coin.changeRate.toFixed(2)}%` : `${coin.changeRate.toFixed(2)}%`;

    const changeColor =
        coin.changeRate > 0
            ? "text-[#00B386]"
            : coin.changeRate < 0
              ? "text-[#F04452]"
              : "text-gray-500";

    return (
        <View>
            <View
                className="
                    mb-3
                    flex-row
                    items-center
                    justify-between
                ">
                <View>
                    <Text
                        className="
                            text-sm
                            font-bold
                            text-[#111827]
                        ">
                        현재가
                    </Text>

                    <Text
                        className="
                            mt-1
                            text-xs
                            text-gray-400
                        ">
                        최근 60초 실시간 가격
                    </Text>
                </View>

                <View
                    className="
                        rounded-full
                        bg-[#EEF5FF]
                        px-3
                        py-1
                    ">
                    <Text
                        className="
                            text-xs
                            font-bold
                            text-[#2288ED]
                        ">
                        LIVE · 1초
                    </Text>
                </View>
            </View>

            <CoinLineChart data={realtimeData} height={200} showTime />

            <Text
                className="
                    mt-2
                    text-right
                    text-[10px]
                    text-gray-400
                ">
                {realtimeData.length}
                /60 데이터
            </Text>

            <View
                className="
                    mt-4
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    bg-white
                    px-4
                ">
                <PriceRow label="현재가" value={formatKRW(coin.price)} />

                <PriceRow label="최고가" value={formatKRW(coin.highPrice)} />

                <PriceRow label="최저가" value={formatKRW(coin.lowPrice)} />

                <PriceRow label="등락률" value={changeRateText} valueClassName={changeColor} />
            </View>
        </View>
    );
}
