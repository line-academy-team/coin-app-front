import { z } from "zod";

const baseSignupSchema = z.object({
    email: z.string().email("유효한 이메일 주소를 입력해주세요.").max(100),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다.").max(255),
    confirmPassword: z.string().min(6, "비밀번호를 입력해주세요."),
    nickname: z.string().min(2, "닉네임은 2자 이상 10자 이하여야 합니다.").max(10),
});

export const userSignupInputSchema = baseSignupSchema.refine(
    data => data.password === data.confirmPassword,
    {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
    },
);

export type UserSignupInputType = z.infer<typeof userSignupInputSchema>;

export const userSignupSchema = baseSignupSchema.omit({
    confirmPassword: true,
});

export type UserSignupType = z.infer<typeof userSignupSchema>;