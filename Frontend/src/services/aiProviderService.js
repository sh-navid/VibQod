const API_BASE_URL = 'http://localhost:9099/api/v1';

const createAiProvider = async (providerData) => {
    const response = await fetch(`${API_BASE_URL}/AIProvider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify(providerData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create AI provider');
    }
    return response.json();
};

const getAiProviders = async () => {
    const response = await fetch(`${API_BASE_URL}/AIProvider`, {
        headers: { "accept": "*/*" }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch AI providers');
    }
    return response.json();
};

export { createAiProvider, getAiProviders };
