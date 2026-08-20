import { CreatedPortfolio, PortfolioDraft } from "@/types/portfolio";

const MOCK_REQUEST_DELAY = 900;

/**
 * 백엔드가 연결되기 전까지 포트폴리오 생성 요청/응답을 흉내 내는 함수입니다.
 * 실제 네트워크 요청은 발생하지 않습니다.
 */
export const createPortfolioMock = async (draft: PortfolioDraft): Promise<CreatedPortfolio> => {
    const totalAllocation = draft.coins.reduce((total, coin) => total + coin.allocation, 0);

    if (!draft.name.trim()) {
        throw new Error("포트폴리오 이름을 입력해주세요.");
    }

    if (draft.seedMoney <= 0) {
        throw new Error("시드머니를 입력해주세요.");
    }

    if (draft.coins.length === 0 || totalAllocation !== 100) {
        throw new Error("코인 비중의 합계를 100%로 맞춰주세요.");
    }

    if (draft.coins.some(coin => coin.currentPrice <= 0)) {
        throw new Error("현재가를 확인할 수 없는 코인이 있습니다.");
    }

    await new Promise<void>(resolve => {
        setTimeout(resolve, MOCK_REQUEST_DELAY);
    });

    return {
        ...draft,
        name: draft.name.trim(),
        coins: draft.coins.map(coin => ({ ...coin })),
        id: `mock-portfolio-${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
};
