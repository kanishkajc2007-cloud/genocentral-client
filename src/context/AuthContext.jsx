import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('genocentral_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('genocentral_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('genocentral_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('genocentral_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing auth cache.');
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.token) {
      const receivedToken = res.data.token;
      const receivedUser = res.data.user;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('genocentral_token', receivedToken);
      localStorage.setItem('genocentral_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res.data && res.data.token) {
      const receivedToken = res.data.token;
      const receivedUser = res.data.user;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('genocentral_token', receivedToken);
      localStorage.setItem('genocentral_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('genocentral_token');
    localStorage.removeItem('genocentral_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
