import { useState } from "react";
import { Image, Text, View } from "react-native";
import { getCoinIconUrl } from "@/api/coinApi";

interface CoinAvatarProps {
    symbol: string;
    size?: number;
}

function CoinAvatar({ symbol, size = 44 }: CoinAvatarProps) {
    const [hasError, setHasError] = useState(false);
    const upperSymbol = symbol.toUpperCase();

    if (!hasError) {
        return (
            <Image
                source={{ uri: getCoinIconUrl(upperSymbol) }}
                style={{ width: size, height: size }}
                resizeMode="contain"
                onError={() => setHasError(true)}
            />
        );
    }

    return (
        <View
            className="items-center justify-center rounded-full bg-secondary-main"
            style={{ width: size, height: size }}>
            <Text className="font-pretendard-bold text-white">{upperSymbol.slice(0, 1)}</Text>
        </View>
    );
}

export default CoinAvatar;
