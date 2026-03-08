import { apiClient } from '../api';
import type { User } from '../types';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  userConfirmed: boolean;
  email: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await apiClient<{ data: LoginResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient<{ data: RegisterResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient<{ data: User }>('/users/me');
    return response.data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
};
