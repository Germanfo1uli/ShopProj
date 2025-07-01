import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiRequest } from '../Api/ApiRequest'; // Импортируем ваш apiRequest

export const useAuth = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userId: null,
    username: null,
    roleId: null,
    token: null,
    refreshToken: null,
    isLoading: true
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        try {
          const decoded = jwtDecode(token);
          setAuth({
            isAuthenticated: true,
            userId: Number(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
            username: decoded.sub || null,
            roleId: Number(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']),
            token,
            refreshToken,
            isLoading: false
          });
        } catch (error) {
          console.error('Ошибка декодирования токена:', error);
          logout();
        }
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!auth.token || !auth.refreshToken) return;

    const checkToken = () => {
      try {
        const decoded = jwtDecode(auth.token);
        const expiresIn = (decoded.exp * 1000) - Date.now();
        
        if (expiresIn < 300000) {
          refreshToken();
        }
      } catch (error) {
        console.error('Ошибка проверки токена:', error);
      }
    };

    const interval = setInterval(checkToken, 60000); 
    return () => clearInterval(interval);
  }, [auth.token, auth.refreshToken]);

  const refreshToken = async () => {
    if (!auth.refreshToken) {
      logout();
      return;
    }

    try {
      const response = await apiRequest('/api/users/generatetokens', {
        method: 'POST',
        body: { Token: auth.refreshToken }
      });

      if (response.jwtToken && response.refreshToken) {
        localStorage.setItem('authToken', response.jwtToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        const decoded = jwtDecode(response.jwtToken);
        setAuth({
          isAuthenticated: true,
          userId: Number(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
          username: decoded.sub || null,
          roleId: Number(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']),
          token: response.jwtToken,
          refreshToken: response.refreshToken,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      logout();
    }
  };

  // Вход
  const login = async (email, password) => {
    try {
      const response = await apiRequest('/api/users/login', {
        method: 'POST',
        body: { Email: email, Password: password }
      });

      localStorage.setItem('authToken', response.jwtToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const decoded = jwtDecode(response.jwtToken);
      setAuth({
        isAuthenticated: true,
        userId: Number(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
        username: decoded.sub || null,
        roleId: Number(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']),
        token: response.jwtToken,
        refreshToken: response.refreshToken,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { success: false, error: error.message };
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setAuth({
      isAuthenticated: false,
      userId: null,
      username: null,
      roleId: null,
      token: null,
      refreshToken: null,
      isLoading: false
    });
  };

  return { 
    ...auth, 
    login, 
    logout 
  };
};