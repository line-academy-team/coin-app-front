import axiosInstance from "@/api/axiosInstance";
import { CreatePortfolioRequest, Portfolio } from "@/types/portfolio";

// 포트폴리오 목록 조회
const getMyPortfolios = async (): Promise<Portfolio[]> => {
    const response = await axiosInstance.get("/portfolios");
    return response.data.data;
};

const getMyPortfolioById = async (id: number): Promise<Portfolio> => {
    const response = await axiosInstance.get(`/portfolios/${id}`);
    return response.data.data;
}

const createPortfolio = async (data: CreatePortfolioRequest): Promise<Portfolio> => {
    const response = await axiosInstance.post("/portfolios/create", data);
    return response.data.data;
};

export default {
    getMyPortfolios,
    getMyPortfolioById,
    createPortfolio,
};
