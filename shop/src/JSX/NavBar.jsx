import React, { useState, useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBoxOpen, FaStar, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import st from '../CSS/NavBar.module.css';
import AuthModal from './Components/AuthModal';
import { useAuth } from './Hooks/UseAuth.js';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    const {
        isAuthenticated,
        login,
        isLoading: authLoading
    } = useAuth();

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
                    {isMenuOpen ? <FaTimes className={st.burgerIcon} /> : <FaBars className={st.burgerIcon} />}
                </div>

                <Link to="/home" className={st.logo}><h2>TempName</h2></Link>

                <div className={st.searchContainer}>
                    <FaSearch className={st.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className={st.Input}
                    />
                </div>

                <div className={st.navSection}>
                    <div className={st.navButtons}>
                        {[
                            { path: '/home', icon: <FaHome />, label: 'Главная' },
                            { path: '/catalog', icon: <FaBoxOpen />, label: 'Каталог' },
                            { path: '/cart', icon: <FaShoppingCart />, label: 'Корзина' }
                        ].map((item) => (
                            <button
                                key={item.path}
                                className={st.navButton}
                                onClick={() => navigate(item.path)}
                            >
                                <span className={st.navIcon}>{item.icon}</span>
                                <span className={st.navLabel}>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {!authLoading && isAuthenticated ? (
                        <button
                            className={st.profileButton}
                            onClick={() => navigate('/profile')}
                        >
                            <img
                                src={userAvatar}
                                alt="User avatar"
                                className={st.userAvatar}
                            />
                            <span className={st.profileText}>Профиль</span>
                        </button>
                    ) : (
                        <button
                            className={st.loginButton}
                            onClick={toggleAuthModal}
                            disabled={authLoading}
                        >
                            <FaUser className={st.loginIcon} />
                            <span>{authLoading ? 'Загрузка...' : 'Войти'}</span>
                        </button>
                    )}
                </div>
            </nav>

            {isMenuOpen && (
                <div className={st.mobileMenu}>
                    <div className={st.mobileHeader}>
                        <Link to="/home" className={st.mobileLogo} onClick={closeMenu}>
                            <h2>TempName</h2>
                        </Link>
                        <FaTimes className={st.closeButton} onClick={closeMenu} />
                    </div>

                    <div className={st.mobileSearchContainer}>
                        <FaSearch className={st.mobileSearchIcon} />
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className={st.mobileInput}
                        />
                    </div>

                    <div className={st.mobileNavButtons}>
                        {[
                            { path: '/home', icon: <FaHome />, label: 'Главная' },
                            { path: '/catalog', icon: <FaBoxOpen />, label: 'Каталог' },
                            { path: '/new', icon: <FaStar />, label: 'Новинки' },
                            { path: '/cart', icon: <FaShoppingCart />, label: 'Корзина' }
                        ].map((item) => (
                            <button
                                key={item.path}
                                className={st.mobileNavButton}
                                onClick={() => {
                                    navigate(item.path);
                                    closeMenu();
                                }}
                            >
                                <span className={st.mobileNavIcon}>{item.icon}</span>
                                <span className={st.mobileNavLabel}>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className={st.mobileAuthButton}>
                        {!authLoading && isAuthenticated ? (
                            <button
                                className={st.mobileProfileButton}
                                onClick={() => {
                                    navigate('/profile');
                                    closeMenu();
                                }}
                            >
                                <img
                                    src={userAvatar}
                                    alt="User avatar"
                                    className={st.mobileUserAvatar}
                                />
                                <span>Мой профиль</span>
                            </button>
                        ) : (
                            <button
                                className={st.mobileLoginButton}
                                onClick={toggleAuthModal}
                                disabled={authLoading}
                            >
                                <FaUser className={st.mobileLoginIcon} />
                                <span>{authLoading ? 'Загрузка...' : 'Войти в аккаунт'}</span>
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