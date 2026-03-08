export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  preferences?: any;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken?: string;
}

export type SocialProvider = 'google' | 'github';
