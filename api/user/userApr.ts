import axiosInstance from "@/api/axiosInstance";
import { LoginResponse, User } from "@/types/user";
import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import { LoginRequestType } from "@/schemas/user/loginUserSchema";

const registerUser = async (data: RegisterUserInputType): Promise<User> => {
    const { confirmPassword, ...submitData } = data;
    const response = await axiosInstance.post("/users/create", submitData);
    return response.data.data;
};

const loginUser = async (data: LoginRequestType): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data.data;
};

const getMe = async (): Promise<User> => {
    const response = await axiosInstance.get("/users/me");
    return response.data.data;
};

export default {
    registerUser,
    loginUser,
    getMe,
};
