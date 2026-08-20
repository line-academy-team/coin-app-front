export const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export const formatCoinQuantity = (value: number) =>
    value.toLocaleString("ko-KR", {
        maximumFractionDigits: value >= 1_000 ? 2 : value >= 1 ? 4 : 8,
    });

export const getEstimatedPurchase = (
    seedMoney: number,
    allocation: number,
    currentPrice: number,
) => {
    const investmentAmount = Math.round((seedMoney * allocation) / 100);
    const quantity = currentPrice > 0 ? investmentAmount / currentPrice : 0;

    return { investmentAmount, quantity };
};

export const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(
        date.getDate(),
    ).padStart(2, "0")}일`;
};
