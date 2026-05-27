import api from './api';

export interface AuthLoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  userId: number;
}

export const authService = {
  async login(email: string, senha: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        senha,
      });
      console.log('Login request successful');
      return response.data;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
