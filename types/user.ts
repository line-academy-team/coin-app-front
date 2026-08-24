export interface User {
    id: number;
    email: string;
    nickname: string;
    createdAt?: string;
}

export type AuthUser = User;

export interface LoginResponse {
    user: User;
    token: string;
}

export interface GetMeResponse {
    user: User;
}
