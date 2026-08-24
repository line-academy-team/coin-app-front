import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { isAxiosError } from "axios";
import { router } from "expo-router";

import userApi from "@/api/user/userApi";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import MainHeader from "@/components/layout/MainHeader";

function PasswordEditPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid =
        currentPassword.length > 0 && newPassword.length >= 6 && confirmPassword === newPassword;

    const handleSubmit = async () => {
        if (!isValid || isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await userApi.updatePassword(currentPassword, newPassword);
            if (Platform.OS === "web") {
                window.alert("비밀번호가 변경되었습니다.");
                router.back();
            } else {
                Alert.alert("변경 완료", "비밀번호가 변경되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (submitError) {
            setError(
                isAxiosError(submitError)
                    ? submitError.response?.data?.message || "비밀번호를 변경하지 못했습니다."
                    : "비밀번호를 변경하지 못했습니다.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <MainHeader title="비밀번호 변경" isBackPress />
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
                <View className="w-full max-w-[560px] self-center">
                    <InputGroup
                        label="기존 비밀번호"
                        placeholder="기존 비밀번호를 입력해주세요"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        isPassword
                        errorMessage={error || undefined}
                    />
                    <InputGroup
                        label="새 비밀번호"
                        placeholder="비밀번호를 입력해주세요"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        isPassword
                        errorMessage={
                            newPassword.length > 0 && newPassword.length < 6
                                ? "새 비밀번호는 최소 6자 이상이어야 합니다."
                                : undefined
                        }
                    />
                    <InputGroup
                        label="새 비밀번호 확인"
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        isPassword
                        errorMessage={
                            confirmPassword.length > 0 && confirmPassword !== newPassword
                                ? "새 비밀번호가 일치하지 않습니다."
                                : undefined
                        }
                    />
                    <View className="mt-16">
                        <Button
                            disabled={!isValid}
                            isLoading={isSubmitting}
                            onPress={() => void handleSubmit()}>
                            확인
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default PasswordEditPage;
