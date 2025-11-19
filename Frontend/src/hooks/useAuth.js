import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('eco-pulse-user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

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

  return { user, isAuthenticated, login, logout, register };
};