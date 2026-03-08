const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ApiError {
  message: string;
  statusCode: number;
}

export class ApiClientError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      message: 'Erro desconhecido',
      statusCode: response.status,
    }));

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    throw new ApiClientError(error.statusCode, error.message);
  }

  return response.json();
}
