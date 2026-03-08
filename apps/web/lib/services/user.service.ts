import { apiClient } from '../api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    theme?: string;
    language?: string;
  };
  createdAt: string;
}

interface UpdateProfileData {
  name?: string;
  avatar?: string;
  preferences?: {
    theme?: string;
    language?: string;
  };
}

export const userService = {
  async getMe(): Promise<User> {
    const response = await apiClient<{ data: User }>('/users/me');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiClient<{ data: User }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    return apiClient<void>('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(): Promise<void> {
    return apiClient<void>('/users/me', {
      method: 'DELETE',
    });
  },
};
