import { UserSignupType } from "@/schema/registerUserSchema";
import { LoginResponse, User } from "@/types/user";
import axiosInstance from "@/api/axiosInstance";
import { LoginInputType } from "@/schema/loginUserSchema";

const registerUser = async (data: UserSignupType): Promise<User> => {
    const response = await axiosInstance.post("/users/create", data);
    return response.data.data;
};

const login = async (data: LoginInputType): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data.data;
};

export default {
    registerUser,
    login,
};