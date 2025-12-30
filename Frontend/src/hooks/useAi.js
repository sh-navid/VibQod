import { useAskAi, useGetAiHistory } from '../services/aiService';

const useAi = () => {
    const { mutate: sendPrompt, data, isLoading, isSuccess, isError, error } = useAskAi();
    const { data: history, isLoading: isHistoryLoading, isError: isHistoryError, error: historyError } = useGetAiHistory();

    return {
        sendPrompt,
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        history,
        isHistoryLoading,
        isHistoryError,
        historyError,
    };
};

export default useAi;
