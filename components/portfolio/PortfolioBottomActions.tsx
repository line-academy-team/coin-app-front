import { View } from "react-native";

import Button from "@/components/common/button/Button";

interface PortfolioBottomActionsProps {
    nextLabel: string;
    onPrevious: () => void;
    onNext: () => void;
    nextDisabled?: boolean;
    isLoading?: boolean;
}

function PortfolioBottomActions({
    nextLabel,
    onPrevious,
    onNext,
    nextDisabled = false,
    isLoading = false,
}: PortfolioBottomActionsProps) {
    return (
        <View className="flex-row gap-3 border-t border-[#E5E9F0] bg-white px-5 pb-4 pt-3">
            <Button
                variant="outline"
                onPress={onPrevious}
                className="h-14 flex-1 rounded-xl"
                textClassName="text-base">
                이전
            </Button>

            <Button
                onPress={onNext}
                disabled={nextDisabled}
                isLoading={isLoading}
                className="h-14 flex-1 rounded-xl"
                textClassName="text-base">
                {nextLabel}
            </Button>
        </View>
    );
}

export default PortfolioBottomActions;
