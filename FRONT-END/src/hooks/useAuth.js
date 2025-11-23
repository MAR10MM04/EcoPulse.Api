
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('eco-pulse-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('eco-pulse-user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = (userData) => {
    localStorage.setItem('eco-pulse-user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('eco-pulse-user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('eco-pulse-users') || '[]');
    users.push(userData);
    localStorage.setItem('eco-pulse-users', JSON.stringify(users));
  };

  const value = { user, isAuthenticated, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};