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

const getAiProviderById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/AIProvider/${id}`, {
        headers: { "accept": "*/*" }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch AI provider with id ${id}`);
    }
    return response.json();
};

const deleteAiProvider = async (id) => {
    const response = await fetch(`${API_BASE_URL}/AIProvider/${id}`, {
        method: 'DELETE',
        headers: { 'accept': '*/*' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete AI provider with id ${id}`);
    }
    return response.status; // Return the status code, e.g., 204
};

const getDefaultAiProvider = async () => {
    const response = await fetch(`${API_BASE_URL}/AIProvider/default`, {
        headers: { "accept": "*/*" }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch default AI provider');
    }
    return response.json();
};

const setDefaultAiProvider = async (id) => {
    const response = await fetch(`${API_BASE_URL}/AIProvider/default/${id}`, {
        method: 'PUT',
        headers: { 'accept': '*/*' },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.message || `Failed to set AI provider with id ${id} as default`);
    }
    return response.status;
};


export { createAiProvider, getAiProviders, getAiProviderById, deleteAiProvider, getDefaultAiProvider, setDefaultAiProvider };
