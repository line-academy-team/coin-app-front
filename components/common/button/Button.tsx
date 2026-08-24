import React from "react";
import { GestureResponderEvent, Pressable, Text } from "react-native";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "solid" | "outline";

type ButtonColor = "primary" | "secondary" | "error" | "success" | "warning";

interface ButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    children: string;
    className?: string;
    textClassName?: string;
    variant?: ButtonVariant;
    color?: ButtonColor;
}

const solidButtonStyles: Record<ButtonColor, string> = {
    primary:
        "bg-primary-main border-primary-main hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active active:border-primary-active",

    secondary: "bg-secondary-main border-secondary-main",

    error: "bg-error-main border-error-main",

    success: "bg-success-main border-success-main",

    warning: "bg-warning-main border-warning-main",
};

const outlineButtonStyles: Record<ButtonColor, string> = {
    primary:
        "bg-transparent border-primary-main hover:border-primary-hover active:border-primary-active",

    secondary: "bg-transparent border-secondary-main",

    error: "bg-transparent border-error-main",

    success: "bg-transparent border-success-main",

    warning: "bg-transparent border-warning-main",
};

const solidTextStyles: Record<ButtonColor, string> = {
    primary: "text-primary-contrast",
    secondary: "text-secondary-contrast",
    error: "text-error-contrast",
    success: "text-success-contrast",
    warning: "text-warning-contrast",
};

const outlineTextStyles: Record<ButtonColor, string> = {
    primary: "text-primary-main hover:text-primary-hover active:text-primary-active",

    secondary: "text-secondary-main",

    error: "text-error-main",
    success: "text-success-main",
    warning: "text-warning-main",
};

function Button({
    disabled = false,
    isLoading = false,
    onPress,
    children,
    className,
    textClassName,
    variant = "solid",
    color = "primary",
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    const buttonStyle = isDisabled
        ? variant === "solid"
            ? "bg-divider border-text-disabled"
            : "bg-transparent border-divider"
        : variant === "solid"
          ? solidButtonStyles[color]
          : outlineButtonStyles[color];

    const textStyle = isDisabled
        ? "text-text-secondary"
        : variant === "solid"
          ? solidTextStyles[color]
          : outlineTextStyles[color];

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            className={twMerge(
                "h-[60px] w-full items-center justify-center rounded-xl border transition-colors duration-200",
                isDisabled ? "cursor-not-allowed" : "cursor-pointer",
                buttonStyle,
                className,
            )}>
            <Text className={twMerge("font-pretendard-bold text-lg", textStyle, textClassName)}>
                {isLoading ? "처리 중..." : children}
            </Text>
        </Pressable>
    );
}

export default Button;
