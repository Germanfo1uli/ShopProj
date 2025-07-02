import { useState, useEffect } from 'react';
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

            if (token && refreshToken && userId) {
                try {
                    const decoded = jwtDecode(token);
                    setAuth({
                        isAuthenticated: true,
                        userId: Number(userId),
                        email:  decoded.email || 'Пользователь',
                        roleId: Number(decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 0),
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
        logout
    };
};