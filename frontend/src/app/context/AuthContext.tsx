import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export type UserRole = 'CLIENTE' | 'BARBEIRO' | 'ADMIN';

export interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  userId: number | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (newEmail: string) => void;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há sessão salva no localStorage ao carregar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role') as UserRole | null;
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('email');

    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(parseInt(storedUserId));
      setEmail(storedEmail);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      console.log('Login response:', { token: response.token?.substring(0, 50), role: response.role, userId: response.userId, email: response.email });

      setToken(response.token);
      setRole(response.role as UserRole);
      setUserId(response.userId);
      setEmail(response.email);
      setIsAuthenticated(true);

      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('userId', response.userId.toString());
      localStorage.setItem('email', response.email);
      
      console.log('Auth state updated and localStorage saved');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = (newEmail: string) => {
    setEmail(newEmail);
    localStorage.setItem('email', newEmail);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUserId(null);
    setEmail(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, userId, email, login, logout, updateUserInfo, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
