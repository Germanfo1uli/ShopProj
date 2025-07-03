import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiRequest } from '../Api/ApiRequest.js';

const AuthContext = createContext();

const useToken = () => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        userId: null,
        email: null,
        roleId: null,
        token: null,
        refreshToken: null,
        isLoading: true
    });

    const login = useCallback((token, refreshToken, userId) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);

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

    const logout = useCallback(() => {
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
    }, []);
    
    const refreshTokens = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('Refresh token not found');
                return null;
            }
            
            console.log('Attempting to refresh tokens...');
            const response = await apiRequest('/api/users/generatetokens', {
                method: 'POST',
                body: { refreshToken }
            });

            // Добавим логирование ответа для отладки
            console.log('Token refresh response:', response);

            // Проверяем разные возможные форматы ответа
            const newToken = response.token || response.jwtToken || response?.message?.jwtToken;
            const newRefreshToken = response.refreshToken || response?.message?.refreshToken;

            if (!newToken || !newRefreshToken) {
                console.error('Invalid token refresh response format');
                throw new Error('Invalid token refresh response');
            }

            localStorage.setItem('authToken', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            console.log('Tokens successfully refreshed');
            return {
                token: newToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    }, []);

    // Проверка и обновление токена по таймеру
    useEffect(() => {
        let timer;
        
        const checkTokenExpiration = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            try {
                const decoded = jwtDecode(token);
                const expiresIn = (decoded.exp * 1000) - Date.now();
                
                // Если токен истекает менее чем через минуту или уже истёк
                if (expiresIn < 60000) {
                    const newTokens = await refreshTokens();
                    if (newTokens) {
                        const newDecoded = jwtDecode(newTokens.token);
                        setAuth(prev => ({
                            ...prev,
                            token: newTokens.token,
                            refreshToken: newTokens.refreshToken,
                            isAuthenticated: true,
                            userId: Number(newDecoded.userId || newDecoded.sub),
                            email: newDecoded.email || newDecoded.Email || 'Пользователь',
                            roleId: Number(newDecoded.roleId || newDecoded.role || 0)
                        }));
                        
                        // Перезапускаем таймер с новым токеном
                        const newExpiresIn = (newDecoded.exp * 1000) - Date.now();
                        timer = setTimeout(checkTokenExpiration, newExpiresIn - 60000);
                        return;
                    } else {
                        // Не удалось обновить - разлогиниваем
                        logout();
                    }
                } else {
                    // Запускаем проверку за минуту до истечения
                    timer = setTimeout(checkTokenExpiration, expiresIn - 60000);
                }
            } catch (error) {
                console.error('Ошибка проверки токена:', error);
                logout();
            }
        };
        
        if (auth.token) {
            checkTokenExpiration();
        }
        
        return () => clearTimeout(timer);
    }, [auth.token, refreshTokens, logout]);

    // Инициализация аутентификации
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('authToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const userId = localStorage.getItem('userId');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
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
                    // Пробуем обновить токен при неудачной декодировке
                    const newTokens = await refreshTokens();
                    if (!newTokens) logout();
                }
            } else {
                setAuth(prev => ({ ...prev, isLoading: false }));
            }
        };

        initAuth();
    }, []);

    return { 
        ...auth,
        login,
        logout,
        refreshTokens // Экспортируем для ручного обновления при необходимости
    };
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const auth = useToken();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};