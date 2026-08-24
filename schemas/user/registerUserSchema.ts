import { z } from "zod";

export const registerUserSchema = z
    .object({
        email: z.email("유효한 이메일 주소를 입력해주세요."),
        password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
        confirmPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
        nickname: z
            .string()
            .min(2, "닉네임은 2자 이상이어야 합니다.")
            .max(10, "닉네임은 10자 이하여야 합니다."),
    })
    .refine(data => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export type RegisterUserInputType = z.infer<typeof registerUserSchema>;
