import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:9099/api/v1/AI';

/* ──────────────────────────  API HELPERS  ────────────────────────── */
const askAi = async (prompt) => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch');
  }

  return response.json();
};

const getAiHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/history/parsed`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch history');
  }
  return response.json();
};

const clearAiHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/clear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to clear history');
  }

  /* API might return 204 No-Content or an empty body → always give back an empty list */
  if (response.status === 204 || !(await response.clone().text()).trim()) {
    return [];
  }

  return response.json().catch(() => []);
};

/* ──────────────────────────  REACT-QUERY HOOKS  ────────────────────────── */
export const useAskAi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: askAi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aiHistory'] }),
    onError: (err) => console.error('askAi error:', err)
  });
};

export const useGetAiHistory = () =>
  useQuery({
    queryKey: ['aiHistory'],
    queryFn: getAiHistory,
    refetchOnWindowFocus: false
  });

export const useClearAiHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAiHistory,
    onSuccess: (data) => {
      /* 1️⃣  instant UI update  */
      queryClient.setQueryData(['aiHistory'], data);
      /* 2️⃣  background re-validation (optional) */
      queryClient.invalidateQueries({ queryKey: ['aiHistory'] });
    },
    onError: (err) => console.error('clearAiHistory error:', err)
  });
};
