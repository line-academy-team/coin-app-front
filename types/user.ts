export interface User {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
}

export interface GetMeResponse {
    message: string;
    data: User;
}

export type LoginResponse = User & {
    token: string;
};
