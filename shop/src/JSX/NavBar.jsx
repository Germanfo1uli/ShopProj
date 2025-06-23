import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import st from '../CSS/NavBar.module.css';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';
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
                    <Link to="/favorited" className={st.navLink}>Избранное</Link>
                    <Link to="/new" className={st.navLink}>Новинки</Link>
                </div>

                <div className={st.searchInput}>
                    <div className={st.searchContainer}>
                        <input type="text" placeholder="Поиск..." className={st.Input}/>
                    </div>
                    <button className={st.loginButton}>Войти</button>
                </div>

            </nav>

            <div className={`${st.mobileMenu} ${isMenuOpen ? st.active : ''}`}>
                <span className={st.closeButton} onClick={closeMenu}>&times;</span>

                <Link to="/" className={st.mobileNavLink} onClick={closeMenu}>Главная</Link>
                <Link to="/catalog" className={st.mobileNavLink} onClick={closeMenu}>Каталог</Link>
                <Link to="/popular" className={st.mobileNavLink} onClick={closeMenu}>Популярное</Link>
                <Link to="/new" className={st.mobileNavLink} onClick={closeMenu}>Новинки</Link>

                <div className={st.mobileSearchContainer}>
                    <input type="text" placeholder="Поиск..." className={st.mobileInput}/>
                    <button className={st.mobileLoginButton}>Войти</button>
                </div>
            </div>
        </>
    );
};

export default NavBar;