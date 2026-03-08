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
    return apiClient<User>('/users/me');
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return apiClient<User>('/users/me', {
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
