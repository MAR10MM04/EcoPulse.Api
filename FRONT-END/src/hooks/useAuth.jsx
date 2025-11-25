import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('eco-pulse-user');
      const storedToken = localStorage.getItem('eco-pulse-token');
      
      console.log('🔄 Cargando usuario desde localStorage:', { storedUser, storedToken });
      
      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ Usuario cargado desde localStorage:', userData);
      } else {
        console.log('❌ No hay usuario o token en localStorage');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error al cargar usuario desde localStorage:", error);
      localStorage.removeItem('eco-pulse-user');
      localStorage.removeItem('eco-pulse-token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = (userData) => {
    console.log('🔐 Iniciando sesión con datos:', userData);
    
    // Validar que tenemos los datos necesarios
    if (!userData || !userData.token) {
      console.error('❌ Datos de usuario incompletos para login');
      return;
    }
    
    try {
      // Guardar en localStorage
      localStorage.setItem('eco-pulse-user', JSON.stringify(userData));
      localStorage.setItem('eco-pulse-token', userData.token);
      
      // Actualizar estado
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('✅ Login exitoso, usuario guardado:', userData);
    } catch (error) {
      console.error('❌ Error al guardar usuario en localStorage:', error);
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('eco-pulse-user');
    localStorage.removeItem('eco-pulse-token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem('eco-pulse-user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = { 
    user, 
    isAuthenticated, 
    loading, 
    login, 
    logout, 
    updateUser 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};