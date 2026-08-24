import { View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface ErrorMessageProps {
    children: string;
    className?: string;
}

function ErrorMessage({ children, className }: ErrorMessageProps) {
    return (
        <View className={twMerge("mt-1.5", className)}>
            <Text className={"text-error-main text-sm font-pretendard-medium"}>{children}</Text>
        </View>
    );
}

export default ErrorMessage;
