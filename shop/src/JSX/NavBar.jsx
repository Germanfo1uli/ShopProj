import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBoxOpen, FaStar, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import st from '../CSS/NavBar.module.css';
import AuthModal from './Components/AuthModal';
import { useAuth } from './Hooks/UseAuth.js';
import {API_BASE_URL, apiRequest} from './Api/ApiRequest';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [productImages, setProductImages] = useState({});
    const navigate = useNavigate();

    const {
        isAuthenticated,
        login,
        isLoading: authLoading
    } = useAuth();

    const searchProducts = useCallback(async (term) => {
        if (term.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const results = await apiRequest(`/api/products/search?term=${encodeURIComponent(term)}`);
            const imagesResponse = await apiRequest('/api/productimages');
            const imagesByProduct = {};
            
            imagesResponse.forEach(image => {
                if (!imagesByProduct[image.productId]) {
                    imagesByProduct[image.productId] = [];
                }
                imagesByProduct[image.productId].push(image);
            });

            setProductImages(imagesByProduct);
            setSearchResults(results);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            setSearchResults([]);
        }
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 1) {
            searchProducts(term);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleProductSelect = (productId) => {
        navigate(`/product/${productId}`);
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
        closeMenu();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.closest(`.${st.searchContainer}`) === null &&
                e.target.closest(`.${st.mobileSearchContainer}`) === null) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const renderSearchResults = (isMobile = false) => {
        if (!showResults) return null;

        return (
            <div className={isMobile ? st.mobileSearchResults : st.searchResults}>
                {searchResults.length > 0 ? (
                    searchResults.map(product => {
                        const images = productImages[product.id] || [];
                        const mainImage = images.find(img => img.isMain) || images[0];
                        
                        return (
                            <div
                                key={product.id}
                                className={isMobile ? st.mobileSearchResultItem : st.searchResultItem}
                                onClick={() => handleProductSelect(product.id)}
                            >
                                <div className={isMobile ? st.mobileSearchResultImage : st.searchResultImage}>
                                    {mainImage ? (
                                        <img
                                            src={mainImage.imageUrl}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100';
                                            }}
                                        />
                                    ) : (
                                        <div className={st.placeholderImage}>
                                            <FaBoxOpen className={st.placeholderIcon} />
                                        </div>
                                    )}
                                </div>
                                <div className={isMobile ? st.mobileSearchResultInfo : st.searchResultInfo}>
                                    <h4>{product.name}</h4>
                                    <p>{product.price.toLocaleString('ru-RU')} ₽</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={st.noResults}>
                        {searchTerm.length > 1 ? 'Ничего не найдено' : 'Введите запрос для поиска'}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <nav className={st.navPage}>
                <div className={st.burger} onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes className={st.burgerIcon} /> : <FaBars className={st.burgerIcon} />}
                </div>

                <Link to="/home" className={st.logo}><h2>WishWhirl</h2></Link>

                <div className={st.searchContainer}>
                    <FaSearch className={st.searchIcon} />
                    <input
                        type="text"
                        placeholder="Поиск товара..."
                        className={st.Input}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => searchTerm.length > 1 && setShowResults(true)}
                    />
                    {renderSearchResults()}
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
                            <h2>WishWhirl</h2>
                        </Link>
                        <FaTimes className={st.closeButton} onClick={closeMenu} />
                    </div>

                    <div className={st.mobileSearchContainer}>
                        <FaSearch className={st.mobileSearchIcon} />
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className={st.mobileInput}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => searchTerm.length > 1 && setShowResults(true)}
                        />
                        {renderSearchResults(true)}
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