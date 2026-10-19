import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Verifikasi sesi user saat awal dimuat
  const checkAuth = useCallback(async () => {
    try {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const res = await authService.getMe();
      if (res && res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.warn('Gagal memverifikasi sesi login:', error);
      setUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Login handler
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      setUser(res.data);
      setToken(res.token);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register handler
   */
  const register = async (name, email, password, role = 'user') => {
    setIsLoading(true);
    try {
      const res = await authService.register({ name, email, password, role });
      setUser(res.data);
      setToken(res.token);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
