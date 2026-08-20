import { Image, Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import ErrorMessage from "../form/ErrorMessage";
import InfoMessage from "../form/InfoMessage";

interface InputGroupProps extends TextInputProps {
    label: string;
    infoMessage?: string;
    errorMessage?: string;
    isPassword?: boolean;
}

function InputGroup({
    label,
    id,
    placeholder,
    infoMessage,
    errorMessage,
    isPassword = false,
    ...props
}: InputGroupProps) {
    const [visibility, setVisibility] = useState(false);

    return (
        <View className="mt-[18px]">
            <Text className={"text-secondary-main font-pretendard-semibold text-sm"}>{label}</Text>
            <TextInput
                className={twMerge(
                    "mt-3 p-4 relative font-pretendard",
                    "bg-brand-surface rounded-xl border border-secondary-main",
                    "focus:outline-secondary-hover",
                    errorMessage && "border-error-main",
                )}
                placeholder={placeholder}
                secureTextEntry={isPassword && !visibility}
                {...props}
            />
            {isPassword && (
                <Pressable
                    className={twMerge("h-5 w-5 absolute", "right-7 top-11")}
                    onPress={() => {
                        setVisibility(!visibility);
                    }}>
                    <Image
                        source={
                            visibility
                                ? require("@/assets/images/auth/visibility_off.png")
                                : require("@/assets/images/auth/visibility.png")
                        }
                        resizeMode="contain"
                        style={{ width: 28, height: 28 }}
                    />
                </Pressable>
            )}
            {errorMessage ? (
                <ErrorMessage>{errorMessage}</ErrorMessage>
            ) : infoMessage ? (
                <InfoMessage>{infoMessage}</InfoMessage>
            ) : null}
        </View>
    );
}

export default InputGroup;
