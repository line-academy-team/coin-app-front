import z from "zod";

export const loginSchema = z.object({
    email: z.email("유효한 이메일 주소를 입력해주세요.").min(1, "이메일을 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
    autoLogin: z.boolean(),
});

export type LoginInputType = z.infer<typeof loginSchema>;

export type LoginRequestType = Omit<LoginInputType, "autoLogin">;
