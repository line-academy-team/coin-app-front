import axiosInstance from "@/api/axiosInstance";
import { CreatePortfolioRequest, Portfolio, UpdatePortfolioRequest } from "@/types/portfolio";

const getMyPortfolios = async (): Promise<Portfolio[]> => {
    const response = await axiosInstance.get("/portfolios");
    return response.data.data;
};

const getPortfolio = async (id: number): Promise<Portfolio> => {
    const response = await axiosInstance.get(`/portfolios/${id}`);
    return response.data.data;
};

const createPortfolio = async (data: CreatePortfolioRequest): Promise<Portfolio> => {
    const response = await axiosInstance.post("/portfolios/create", data);
    return response.data.data;
};

const updatePortfolio = async (id: number, data: UpdatePortfolioRequest): Promise<Portfolio> => {
    const response = await axiosInstance.put(`/portfolios/${id}`, data);
    return response.data.data;
};

const deletePortfolio = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/portfolios/${id}`);
};

export default {
    getMyPortfolios,
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
};
