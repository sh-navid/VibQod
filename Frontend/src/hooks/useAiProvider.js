import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAiProvider, getAiProviders, getAiProviderById, deleteAiProvider, getDefaultAiProvider, setDefaultAiProvider } from '../services/aiProviderService';

const useAiProvider = () => {
    const queryClient = useQueryClient();

    // Fetch all AI providers
    const { data: aiProviders, isLoading: isLoadingProviders, isError: isErrorProviders, error: providersError, refetch: refetchProviders } = useQuery({
        queryKey: ['aiProviders'],
        queryFn: getAiProviders,
        refetchOnWindowFocus: true, // Refetch on window focus
    });

    // Fetch AI provider by ID
    const useAiProviderById = (id) => {
        return useQuery({
            queryKey: ['aiProvider', id],
            queryFn: () => getAiProviderById(id),
            enabled: !!id, // Only run the query if an ID is provided
        });
    };


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

    // Delete AI provider
    const { mutate: removeAiProvider, isLoading: isRemovingProvider, isSuccess: isProviderRemoved, isError: isRemoveProviderError, error: removeProviderError } = useMutation({
        mutationFn: deleteAiProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aiProviders'] }); // Invalidate and refetch
        },
        onError: (err) => {
            console.error('Failed to delete AI provider:', err);
        },
    });

    // Fetch default AI provider
    const { data: defaultAiProvider, isLoading: isLoadingDefaultProvider, isError: isErrorDefaultProvider, error: defaultProviderError, refetch: refetchDefaultProvider } = useQuery({
        queryKey: ['defaultAiProvider'],
        queryFn: getDefaultAiProvider,
        refetchOnWindowFocus: true,
    });

    // Set AI provider as default
    const { mutate: setAsDefaultAiProvider, isLoading: isSettingAsDefault, isSuccess: isSetAsDefaultSuccess, isError: isSetAsDefaultError, error: setAsDefaultError } = useMutation({
        mutationFn: setDefaultAiProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aiProviders','defaultAiProvider'] }); // Invalidate and refetch
            refetchDefaultProvider(); // Refetch here
        },
        onError: (err) => {
            console.error('Failed to set AI provider as default:', err);
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
        useAiProviderById,
        defaultAiProvider,
        isLoadingDefaultProvider,
        isErrorDefaultProvider,
        defaultProviderError,
        refetchDefaultProvider,
        removeAiProvider,
        isRemovingProvider,
        isProviderRemoved,
        isRemoveProviderError,
        removeProviderError,
        setAsDefaultAiProvider,
        isSettingAsDefault,
        isSetAsDefaultSuccess,
        isSetAsDefaultError,
        setAsDefaultError
    };
};

export default useAiProvider;
