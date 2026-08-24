import { Text, View } from "react-native";

import Svg, { Circle, Line, Polyline } from "react-native-svg";

import { RealtimePricePoint } from "@/types/coin";

interface CoinLineChartProps {
    data: RealtimePricePoint[];

    height?: number;

    showTime?: boolean;
}

export default function CoinLineChart({
    data,
    height = 150,
    showTime = false,
}: CoinLineChartProps) {
    const chartWidth = 320;

    const paddingX = 10;

    const paddingY = 15;

    if (data.length < 2) {
        return (
            <View
                className="
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#EEF5FF]
                "
                style={{
                    height,
                }}>
                <Text
                    className="
                        text-sm
                        text-gray-400
                    ">
                    실시간 가격을 수집 중입니다.
                </Text>

                <Text
                    className="
                        mt-1
                        text-xs
                        text-gray-400
                    ">
                    잠시만 기다려 주세요.
                </Text>
            </View>
        );
    }

    const prices = data.map(item => item.price);

    const minPrice = Math.min(...prices);

    const maxPrice = Math.max(...prices);

    const coordinates = data.map((item, index) => {
        const x = paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);

        let y = height / 2;

        if (maxPrice !== minPrice) {
            const priceRate = (item.price - minPrice) / (maxPrice - minPrice);

            y = height - paddingY - priceRate * (height - paddingY * 2);
        }

        return {
            x,
            y,
        };
    });

    const points = coordinates.map(point => `${point.x},${point.y}`).join(" ");

    const lastPoint = coordinates[coordinates.length - 1];

    const firstTime = data[0]?.time;

    const middleTime = data[Math.floor(data.length / 2)]?.time;

    const lastTime = data[data.length - 1]?.time;

    return (
        <View>
            <View
                className="
                    overflow-hidden
                    rounded-2xl
                    bg-[#EEF5FF]
                ">
                <Svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
                    <Line
                        x1="0"
                        y1={height / 2}
                        x2={chartWidth}
                        y2={height / 2}
                        stroke="#DCE8F8"
                        strokeWidth="1"
                    />

                    <Polyline
                        points={points}
                        fill="none"
                        stroke="#2288ED"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {lastPoint && <Circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#2288ED" />}
                </Svg>
            </View>

            {showTime && (
                <View
                    className="
                        mt-2
                        flex-row
                        justify-between
                    ">
                    <Text
                        className="
                            text-[10px]
                            text-gray-400
                        ">
                        {firstTime}
                    </Text>

                    <Text
                        className="
                            text-[10px]
                            text-gray-400
                        ">
                        {middleTime}
                    </Text>

                    <Text
                        className="
                            text-[10px]
                            text-gray-400
                        ">
                        {lastTime}
                    </Text>
                </View>
            )}
        </View>
    );
}
