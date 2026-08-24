import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { isAxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";
import Button from "@/components/common/button/Button";
import userApi from "@/api/user/userApi";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
function AuthRegisterPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerUserSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            nickname: "",
        },
    });

    const { email, password, confirmPassword, nickname } = useWatch({ control });
    const isFilled = Boolean(
        email?.trim() && password?.trim() && confirmPassword?.trim() && nickname?.trim(),
    );

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            await userApi.registerUser(data);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/auth/login");
            } else {
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
                ]);
            }
        } catch (error) {
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white">
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}>
                <MainHeader title={"회원가입"} isBackPress />

                <Text className={"text-primary-main font-pretendard-bold text-xl text-center py-3"}>
                    새로운 투자를 시작하세요
                </Text>

                <View className="px-5">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="이메일"
                                placeholder="이메일을 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="비밀번호"
                                placeholder="비밀번호를 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                                isPassword={true}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="비밀번호 확인"
                                placeholder="비밀번호를 다시 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.confirmPassword?.message}
                                isPassword={true}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="nickname"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="닉네임"
                                placeholder="닉네임을 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.nickname?.message}
                            />
                        )}
                    />

                    {errors.root?.message && (
                        <ErrorMessage className="mt-4 self-center">
                            {errors.root.message}
                        </ErrorMessage>
                    )}

                    <Button
                        disabled={!isFilled}
                        isLoading={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                        variant={"solid"} color={"primary"}
                        className={"mt-10"}>
                        회원가입
                    </Button>
                </View>

                <View className="mt-6 flex-row items-center justify-center gap-1">
                    <Text className="text-text-secondary font-pretendard text-sm">
                        이미 계정이 있으신가요?
                    </Text>
                    <Link href="/auth/login" asChild>
                        <Pressable>
                            <Text className="text-primary-main font-pretendard-bold text-sm">
                                로그인
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthRegisterPage;
