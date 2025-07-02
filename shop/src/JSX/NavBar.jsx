import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import st from '../CSS/NavBar.module.css';
import AuthModal from './Components/AuthModal';
import { useToken } from './Hooks/UseToken';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        if (token) {
            setUserAvatar('https://randomuser.me/api/portraits/men/32.jpg');
        } else {
            setUserAvatar('');
        }
    };

    const { 
        isAuthenticated, 
        userId, 
        username, 
        logout,
        isLoading: authLoading 
    } = useToken();

    useEffect(() => {
        checkAuth();
    }, [location.pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
    };

    const toggleAuthModal = () => {
        setIsAuthModalOpen(!isAuthModalOpen);
        document.body.style.overflow = isAuthModalOpen ? 'auto' : 'hidden';
    };

    const handleLoginSuccess = (token, refreshToken, userId) => {
        console.log('Успешный вход, userId:', userId);
        setIsAuthModalOpen(false);
        navigate('/profile');
    };

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };


return (
        <>
            <nav className={st.navPage}>
                <div className={st.burger} onClick={toggleMenu}>
                    <div className={`${st.burgerLine} ${isMenuOpen ? st.active : ''}`}></div>
                    <div className={`${st.burgerLine} ${isMenuOpen ? st.active : ''}`}></div>
                    <div className={`${st.burgerLine} ${isMenuOpen ? st.active : ''}`}></div>
                </div>

                <div className={st.navigation}>
                    <Link to="/home" className={st.logo}><h2>TempName</h2></Link>
                    <Link to="/catalog" className={st.navLink}>Каталог</Link>
                    <Link to="/cart" className={st.navLink}>Корзина</Link>
                    <Link to="/new" className={st.navLink}>Новинки</Link>
                </div>

                <div className={st.searchInput}>
                    <div className={st.searchContainer}>
                        <input type="text" placeholder="Поиск..." className={st.Input}/>
                    </div>
                    {!authLoading && isAuthenticated ? (
                        <div className={st.userAvatarContainer}>
                            <img
                                src={userAvatar}
                                alt="User avatar"
                                className={st.userAvatar}
                                onClick={() => navigate('/profile')}
                            />
                            <div className={st.dropdownMenu}>
                                <button onClick={handleLogout}>Выйти</button>
                            </div>
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

            <div className={`${st.mobileMenu} ${isMenuOpen ? st.active : ''}`}>
                <span className={st.closeButton} onClick={closeMenu}>&times;</span>

                <ul className={st.mobileNavList}>
                    <li className={st.mobileNavItem}>
                        <Link to="/" className={st.mobileNavLink} onClick={closeMenu}>
                            Главная
                        </Link>
                    </li>
                    <li className={st.mobileNavItem}>
                        <Link to="/catalog" className={st.mobileNavLink} onClick={closeMenu}>
                            Каталог
                        </Link>
                    </li>
                    <li className={st.mobileNavItem}>
                        <Link to="/popular" className={st.mobileNavLink} onClick={closeMenu}>
                            Популярное
                        </Link>
                    </li>
                    <li className={st.mobileNavItem}>
                        <Link to="/new" className={st.mobileNavLink} onClick={closeMenu}>
                            Новинки
                        </Link>
                    </li>
                </ul>

                <div className={st.mobileSearchContainer}>
                    <input type="text" placeholder="Поиск..." className={st.mobileInput}/>
                    {!authLoading && isAuthenticated ? (
                        <div className={st.mobileUserInfo}>
                            <img
                                src={userAvatar}
                                alt="User avatar"
                                className={st.mobileUserAvatar}
                                onClick={() => navigate('/profile')}
                            />
                            <button className={st.mobileLogoutButton} onClick={handleLogout}>
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

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={toggleAuthModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default NavBar;