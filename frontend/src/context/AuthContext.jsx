import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user on start or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await userApi.getProfile();
        setUser(res.data.data);
      } catch (err) {
        console.error('Failed to load user', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await userApi.login({ email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const refreshUser = async () => {
    const res = await userApi.getProfile();
    setUser(res.data.data);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
