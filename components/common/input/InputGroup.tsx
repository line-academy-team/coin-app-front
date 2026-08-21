import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";

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
        <View>
            <Text className="font-pretendard-semibold text-lg text-text-default mb-2">{label}</Text>
            <TextInput
                className={twMerge(
                    "items-center px-5 py-4 mb-1 rounded-xl",
                    "border border-text-disabled",
                    "focus:outline-primary-main",
                    errorMessage && "border-error-main",
                )}
                placeholder={placeholder}
                secureTextEntry={isPassword && !visibility}
                {...props}
            />
            {isPassword && (
                <Pressable
                    className={twMerge("h-6 w-6 absolute", "right-5 top-12")}
                    onPress={() => {
                        setVisibility(!visibility);
                    }}>
                    {visibility ? (
                        <Ionicons
                            name={"eye-off-outline"}
                            size={24}
                            className="text-text-secondary"
                        />
                    ) : (
                        <Ionicons name={"eye-outline"} size={24} className="text-text-secondary" />
                    )}
                </Pressable>
            )}
            {errorMessage ? (
                <Text className={"text-error-main text-sm font-pretendard"}>{errorMessage}</Text>
            ) : infoMessage ?(
                <Text className={"text-text-secondary text-sm font-pretendard"}>{infoMessage}</Text>
            ) : null}
        </View>
    );
}

export default InputGroup;
