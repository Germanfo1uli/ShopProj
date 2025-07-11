import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiRequest } from '../Api/ApiRequest.js';

const AuthContext = createContext();

const useToken = () => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        userId: null,
        email: null,
        role: null,
        token: null,
        refreshToken: null,
        isLoading: true
    });

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                userId: Number(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || localStorage.getItem('userId') || 0),
                email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email || decoded.Email || 'Пользователь',
                role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role || decoded.Role || 'null'
            };
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
            return null;
        }
    };

    const login = useCallback((token, refreshToken, userId) => {
        const decoded = decodeToken(token);
        if (!decoded) return;

        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userId || decoded.userId);

        setAuth({
            isAuthenticated: true,
            userId: Number(userId || decoded.userId),
            email: decoded.email,
            role: decoded.role,
            token,
            refreshToken,
            isLoading: false
        });
    }, []);
    
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');

        setAuth({
            isAuthenticated: false,
            userId: null,
            email: null,
            role: null,
            token: null,
            refreshToken: null,
            isLoading: false
        });
    }, []);
    
    const refreshTokens = useCallback(async () => {
        try {
            console.log('Получение нового токена...');
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('Refresh token not found');
                return null;
            }
            
            const response = await apiRequest('/api/users/generatetokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { token: refreshToken }
            });

            const newToken = response.token || response.jwtToken || response?.message?.jwtToken;
            const newRefreshToken = response.refreshToken || response?.message?.refreshToken;

            if (!newToken || !newRefreshToken) {
                throw new Error('Invalid token refresh response');
            }

            const decoded = decodeToken(newToken);
            if (!decoded) {
                throw new Error('Failed to decode new token');
            }

            localStorage.setItem('authToken', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            localStorage.setItem('userId', decoded.userId);
            console.log('Токен получен для:', decoded.userId);
            return {
                token: newToken,
                refreshToken: newRefreshToken,
                userId: decoded.userId
            };
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        let timer;
        
        const checkTokenExpiration = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            
            try {
                const decoded = jwtDecode(token);
                const expiresIn = (decoded.exp * 1000) - Date.now();
                
                if (expiresIn < 60000) {
                    const newTokens = await refreshTokens();
                    if (newTokens) {
                        const decodedNew = decodeToken(newTokens.token);
                        if (!decodedNew) {
                            logout();
                            return;
                        }

                        setAuth({
                            isAuthenticated: true,
                            userId: decodedNew.userId,
                            email: decodedNew.email,
                            role: decodedNew.role,
                            token: newTokens.token,
                            refreshToken: newTokens.refreshToken,
                            isLoading: false
                        });
                        
                        const newExpiresIn = (jwtDecode(newTokens.token).exp * 1000) - Date.now();
                        timer = setTimeout(checkTokenExpiration, newExpiresIn - 60000);
                    } else {
                        logout();
                    }
                } else {
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

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('authToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const storedUserId = localStorage.getItem('userId');

            if (token) {
                const decoded = decodeToken(token);
                if (!decoded) {
                    const newTokens = await refreshTokens();
                    if (!newTokens) logout();
                    return;
                }

                const userId = decoded.userId || Number(storedUserId);
                
                setAuth({
                    isAuthenticated: true,
                    userId: Number(userId),
                    email: decoded.email,
                    role: decoded.role,
                    token,
                    refreshToken,
                    isLoading: false
                });
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
        refreshTokens
    };
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const auth = useToken();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};