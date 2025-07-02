import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import st from '../CSS/NavBar.module.css';
import AuthModal from './Components/AuthModal';
import { useToken } from './Hooks/UseToken';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { 
        isAuthenticated, 
        logout,
        login, 
        isLoading: authLoading 
    } = useToken();

    const toggleMenu = useCallback(() => {
        const newState = !isMenuOpen;
        setIsMenuOpen(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    }, [isMenuOpen]);

    const toggleAuthModal = useCallback(() => {
        const newState = !isAuthModalOpen;
        setIsAuthModalOpen(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    }, [isAuthModalOpen]);

    const handleLoginSuccess = useCallback((token, refreshToken, userId) => {
        login(token, refreshToken, userId); 
        setIsAuthModalOpen(false);
        navigate('/profile');
    }, [login, navigate]);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
    }, [logout, navigate]);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    }, []);
    const userAvatar = isAuthenticated 
        ? 'https://randomuser.me/api/portraits/men/32.jpg' 
        : '';

    return (
        <>
            <nav className={st.navPage}>
                <div className={st.burger} onClick={toggleMenu}>
                    {[1, 2, 3].map((i) => (
                        <div 
                            key={i}
                            className={`${st.burgerLine} ${isMenuOpen ? st.active : ''}`}
                        />
                    ))}
                </div>

                <div className={st.navigation}>
                    <Link to="/home" className={st.logo}><h2>TempName</h2></Link>
                    {['catalog', 'cart', 'new'].map((path) => (
                        <Link 
                            key={path}
                            to={`/${path}`} 
                            className={st.navLink}
                        >
                            {path === 'cart' ? 'Корзина' : path === 'new' ? 'Новинки' : 'Каталог'}
                        </Link>
                    ))}
                </div>

                <div className={st.searchInput}>
                    <div className={st.searchContainer}>
                        <input 
                            type="text" 
                            placeholder="Поиск..." 
                            className={st.Input}
                        />
                    </div>
                    
                    {!authLoading && isAuthenticated ? (
                        <div className={st.userAvatarContainer}>
                            <img
                                src={userAvatar}
                                alt="User avatar"
                                className={st.userAvatar}
                                onClick={() => navigate('/profile')}
                            />
                        </div>
                    ) : (
                        <button 
                            className={st.loginButton} 
                            onClick={toggleAuthModal}
                            disabled={authLoading}
                        >
                            {authLoading ? 'Загрузка...' : 'Войти'}
                        </button>
                    )}
                </div>
            </nav>

            {isMenuOpen && (
                <div className={st.mobileMenu}>
                    <span className={st.closeButton} onClick={closeMenu}>&times;</span>
                    <ul className={st.mobileNavList}>
                        {['', 'catalog', 'popular', 'new'].map((path) => (
                            <li key={path} className={st.mobileNavItem}>
                                <Link 
                                    to={`/${path}`} 
                                    className={st.mobileNavLink} 
                                    onClick={closeMenu}
                                >
                                    {!path ? 'Главная' : path === 'new' ? 'Новинки' : path === 'popular' ? 'Популярное' : 'Каталог'}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className={st.mobileSearchContainer}>
                        <input 
                            type="text" 
                            placeholder="Поиск..." 
                            className={st.mobileInput}
                        />
                        {!authLoading && isAuthenticated ? (
                            <div className={st.mobileUserInfo}>
                                <img
                                    src={userAvatar}
                                    alt="User avatar"
                                    className={st.mobileUserAvatar}
                                    onClick={() => navigate('/profile')}
                                />
                                <button 
                                    className={st.mobileLogoutButton} 
                                    onClick={handleLogout}
                                >
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <button 
                                className={st.mobileLoginButton} 
                                onClick={toggleAuthModal}
                                disabled={authLoading}
                            >
                                {authLoading ? 'Загрузка...' : 'Войти'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={toggleAuthModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default NavBar;