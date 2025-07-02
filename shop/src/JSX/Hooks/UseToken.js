import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useToken = () => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        userId: null,
        email: null,
        roleId: null,
        token: null,
        refreshToken: null,
        isLoading: true
    });

    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('authToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    
                    // Проверяем разные варианты названий полей
                    const email = decoded.email || decoded.Email || decoded.sub;
                    const roleId = decoded.roleId || decoded.role || 
                                  decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                                  decoded.RoleId || 0;
                    
                    setAuth({
                        isAuthenticated: true,
                        userId: Number(userId || decoded.userId || decoded.sub),
                        email: email || 'Пользователь',
                        roleId: Number(roleId),
                        token,
                        refreshToken,
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Ошибка декодирования токена:', error);
                    console.log('Токен, который не удалось декодировать:', token);
                    logout();
                }
            } 
            
            else {
                setAuth(prev => ({ ...prev, isLoading: false }));
            }
        };

        initAuth();
    }, []);

     const login = useCallback((token, refreshToken, userId) => {
        try {
            const decoded = jwtDecode(token);
            setAuth({
                isAuthenticated: true,
                userId: Number(userId),
                email: decoded.email || decoded.Email || 'Пользователь',
                roleId: Number(decoded.roleId || decoded.role || 0),
                token,
                refreshToken,
                isLoading: false
            });
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setAuth({
            isAuthenticated: false,
            userId: null,
            email: null,
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