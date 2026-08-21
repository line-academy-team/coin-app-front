import { Alert, Animated, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import ScrollView = Animated.ScrollView;
import { Link, useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignupInputSchema, UserSignupInputType } from "@/schema/registerUserSchema";
import MainHeader from "@/components/layout/MainHeader";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import userApi from "@/api/user/userApi";
import { isAxiosError } from "axios";

function AuthRegisterPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSignupInputSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            nickname: "",
        },
    });

    const { email, password, confirmPassword, nickname } = useWatch({
        control,
    });

    const isFilled = Boolean(
        email?.trim() && password?.trim() && confirmPassword?.trim() && nickname?.trim(),
    );

    const onSubmit = async (data: UserSignupInputType) => {
        try {
            const { confirmPassword, ...submitData } = data;

            await userApi.registerUser(submitData);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/auth/login");
            } else {
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
                ]);
            }
        } catch (error) {
            let msg = "회원가입 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                msg = error.response?.data.message || msg;
            } else if (error instanceof Error) {
                msg = error.message;
            }

            setError("root", { message: msg });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper">
            <ScrollView keyboardShouldPersistTaps={"handled"} className="flex-1">
                <MainHeader title={"회원가입"} isBackPress onBackPress={() => router.back()} />
                <View className="px-[30px]">
                    <Text
                        className={
                            "mt-[15px] font-pretendard-semibold text-[20px] text-primary-main text-center"
                        }>
                        새로운 투자를 시작하세요
                    </Text>
                    <View className="mt-12 gap-[15px]">
                        <Controller
                            control={control}
                            name={"email"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"이메일"}
                                        placeholder={"이메일을 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"올바른 형식의 이메일을 입력해주세요."}
                                        errorMessage={errors.email?.message}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"password"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호"}
                                        placeholder={"비밀번호를 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"6자 이상 입력해주세요."}
                                        errorMessage={errors.password?.message}
                                        isPassword={true}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"confirmPassword"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호 확인"}
                                        placeholder={"비밀번호를 다시 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"6자 이상 입력해주세요."}
                                        errorMessage={errors.confirmPassword?.message}
                                        isPassword={true}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"nickname"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"닉네임"}
                                        placeholder={"닉네임을 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"10자 이하로 입력해주세요."}
                                        errorMessage={errors.nickname?.message}
                                    />
                                );
                            }}
                        />
                    </View>

                    {errors.root?.message && (
                        <Text className={"text-error-main text-sm font-pretendard"}>
                            {errors.root.message}
                        </Text>
                    )}
                    <Button
                        disabled={!isFilled}
                        isLoading={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                        variant={"solid"}
                        color={"primary"}
                        className="mt-16"
                    >
                        회원가입
                    </Button>

                    <View className="mt-6 flex-row items-center justify-center gap-4">
                        <Text className="text-text-secondary font-pretendard-semibold text-[16px] text-center">
                            이미 계정이 있으신가요?
                        </Text>
                        <Link href={"/auth/login"}>
                            <Text className="text-primary-main font-pretendard-semibold text-[16px] text-center">
                                로그인
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthRegisterPage;
