import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAiProvider, getAiProviders } from '../services/aiProviderService';

const useAiProvider = () => {
    const queryClient = useQueryClient();

    // Fetch AI providers
    const { data: aiProviders, isLoading: isLoadingProviders, isError: isErrorProviders, error: providersError, refetch: refetchProviders } = useQuery({
        queryKey: ['aiProviders'],
        queryFn: getAiProviders,
        refetchOnWindowFocus: true, // Refetch on window focus
    });

    // Create AI provider
    const { mutate: addAiProvider, isLoading: isAddingProvider, isSuccess: isProviderAdded, isError: isAddProviderError, error: addProviderError } = useMutation({
        mutationFn: createAiProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aiProviders'] }); // Invalidate and refetch
        },
        onError: (err) => {
            console.error('Failed to add AI provider:', err);
        },
    });

    return {
        aiProviders,
        isLoadingProviders,
        isErrorProviders,
        providersError,
        refetchProviders,
        addAiProvider,
        isAddingProvider,
        isProviderAdded,
        isAddProviderError,
        addProviderError,
    };
};

export default useAiProvider;
