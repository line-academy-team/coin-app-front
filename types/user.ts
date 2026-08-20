export interface User {
    id: number;
    email: string;
    nickname: string;
}

export interface AuthUser extends User {}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface GetMeResponse {
    user: User;
}
