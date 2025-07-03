import React, { useState, useEffect } from 'react';
import styles from '../CSS/Catalog.module.css';
import sb from '../CSS/Breadcrumbs.module.css'
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight, FaStore, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Footer from "./Components/Footer";
import { Link } from "react-router-dom";
import { apiRequest } from './Api/ApiRequest';

const Catalog = () => {
    const [activeCategory, setActiveCategory] = useState('Все товары');
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedFilterCategory, setExpandedFilterCategory] = useState(null); // для filterSection
    const [expandedMainCategory, setExpandedMainCategory] = useState(null); // для main
    const [favorites, setFavorites] = useState([2]);
    const [priceRange, setPriceRange] = useState([0, 12000]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const allCategories = await apiRequest('/api/categories');
                const parentCategories = await apiRequest('/api/categories/parents');
                const categoriesStructure = parentCategories.map(parent => {
                    const children = allCategories.filter(
                        cat => cat.parentCategoryId === parent.id
                    );
                    
                    return {
                        id: parent.id,
                        name: parent.name,
                        subcategories: children
                    };
                });

                setCategories([
                    {
                        id: 0,
                        name: 'Все товары',
                        subcategories: []
                    },
                    ...categoriesStructure
                ]);
                
            } catch (err) {
                console.error('Ошибка загрузки категорий:', err);
                setError('Не удалось загрузить категории');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);


    const products = [
        {
            id: 1,
            name: 'Платье хлопковое нежно-розовое',
            price: 3490,
            oldPrice: 4290,
            rating: 4.5,
            reviews: 24,
            badge: 'Новинка',
            badgeColor: 'blue',
            bgColor: '#f5f5f5'
        },
        {
            id: 2,
            name: 'Чайный набор фарфоровый, 12 предметов',
            price: 7290,
            rating: 4,
            reviews: 18,
            bgColor: '#e6e6e6'
        },
        {
            id: 3,
            name: 'Свитер мужской с принтом, хлопок',
            price: 4990,
            oldPrice: 6290,
            rating: 5,
            reviews: 32,
            badge: 'Скидка',
            badgeColor: 'red',
            bgColor: '#f0f0f0'
        },
        {
            id: 4,
            name: 'Плед вязаный, 140×180 см, голубой',
            price: 2990,
            rating: 4.5,
            reviews: 27,
            bgColor: '#e6e6e6'
        },
        {
            id: 5,
            name: 'Платье детское с вышивкой, 3-5 лет',
            price: 1790,
            oldPrice: 2490,
            rating: 4,
            reviews: 15,
            badge: 'Акция',
            badgeColor: 'blue',
            bgColor: '#f5f5f5'
        },
        {
            id: 6,
            name: 'Кружка керамическая с рисунком, 350 мл',
            price: 690,
            rating: 5,
            reviews: 42,
            badge: 'Хит',
            badgeColor: 'red',
            bgColor: 'white'
        }
    ];

    const colors = [
        'white', 'black', 'blue', 'gray', 'red',
        'green', 'yellow', 'purple', 'pink'
    ];

    const toggleCategory = (categoryName) => {
        if (expandedCategory === categoryName) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryName);
        }
    };

    const selectCategory = (categoryName, subcategory = null) => {
        setActiveCategory(categoryName);
        setActiveSubcategory(subcategory);
        setExpandedCategory(null);
    };

    const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
            setFavorites(favorites.filter(id => id !== productId));
        } else {
            setFavorites([...favorites, productId]);
        }
    };

    const handlePriceChange = (e, index) => {
        const newValue = parseInt(e.target.value);
        const newPriceRange = [...priceRange];
        newPriceRange[index] = newValue;
        setPriceRange(newPriceRange);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className={styles.star} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
            } else {
                stars.push(<FaRegStar key={i} className={styles.star} />);
            }
        }
        return stars;
    };

    return (
        <div className={styles.catalog}>
            <div className={styles.container}>
                <nav className={sb.breadcrumbs}>
                    <a href="/home" className={sb.breadcrumbLink}>Главная</a>
                    <span className={sb.breadcrumbSeparator}>/</span>
                    <span className={sb.breadcrumbActive}>Каталог</span>
                </nav>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        <FaStore className={styles.cartTitleIcon} />
                        Каталог
                    </h1>
                    <div className={styles.sort}>
                        <span>Сортировка:</span>
                        <select className={styles.sortSelect}>
                            <option>По популярности</option>
                            <option>По возрастанию цены</option>
                            <option>По убыванию цены</option>
                            <option>По новизне</option>
                        </select>
                    </div>
                </div>

                <div className={styles.content}>
                    <aside className={styles.filters}>
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Категории</h3>
                            <ul className={styles.categoryList}>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <button 
                                            className={`${styles.categoryLink} ${
                                                activeCategory === category.name ? styles.active : ''
                                            }`}
                                            onClick={() => selectCategory(category.name)}
                                            onMouseEnter={() => category.subcategories.length > 0 && setExpandedFilterCategory(category.name)}
                                            onMouseLeave={() => setExpandedFilterCategory(null)}
                                        >
                                            <span>{category.name}</span>
                                            {category.subcategories.length > 0 && (
                                                <span className={styles.categoryArrow}>
                                                    {expandedFilterCategory === category.name ? 
                                                        <FaChevronUp /> : <FaChevronDown />
                                                    }
                                                </span>
                                            )}
                                        </button>
                                        
                                        {category.subcategories.length > 0 && expandedFilterCategory === category.name && (
                                            <ul className={styles.subcategoryList}>
                                                {category.subcategories.map(subcategory => (
                                                    <li key={subcategory.id}>
                                                        <button
                                                            className={`${styles.subcategoryLink} ${
                                                                activeSubcategory === subcategory.name ? styles.active : ''
                                                            }`}
                                                            onClick={() => selectCategory(category.name, subcategory.name)}
                                                        >
                                                            {subcategory.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                    </div>

                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Цена</h3>
                            <div className={styles.priceRange}>
                                <span>0 ₽</span>
                                <span>20 000 ₽</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(e, 1)}
                                className={styles.priceSlider}
                            />
                            <div className={styles.priceInputs}>
                                <div className={styles.priceInputWrapper}>
                                    <span>₽</span>
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => handlePriceChange(e, 0)}
                                        className={styles.priceInput}
                                    />
                                </div>
                                <span>—</span>
                                <div className={styles.priceInputWrapper}>
                                    <span>₽</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => handlePriceChange(e, 1)}
                                        className={styles.priceInput}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Размер</h3>
                            <div className={styles.sizeGrid}>
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button key={size} className={styles.sizeButton}>
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Цвет</h3>
                            <div className={styles.colorGrid}>
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        className={styles.colorButton}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <button className={styles.applyFilters}>Применить фильтры</button>
                    </aside>

                    <main className={styles.main}>
                    <div className={styles.categoryMenu}>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={styles.categoryItem}
                                onMouseEnter={() => category.subcategories.length > 0 && setExpandedMainCategory(category.name)}
                                onMouseLeave={() => setExpandedMainCategory(null)}
                            >
                                <button
                                    className={`${styles.categoryButton} ${
                                        activeCategory === category.name ? styles.activeCategory : ''
                                    }`}
                                    onClick={() => {
                                        if (category.subcategories.length > 0) {
                                            setExpandedMainCategory(expandedMainCategory === category.name ? null : category.name);
                                        } else {
                                            selectCategory(category.name);
                                        }
                                    }}
                                >
                                    {category.name}
                                    {category.subcategories.length > 0 && (
                                        expandedMainCategory === category.name ?
                                            <FaChevronUp className={styles.categoryArrow} /> :
                                            <FaChevronDown className={styles.categoryArrow} />
                                    )}
                                </button>

                                {category.subcategories.length > 0 && expandedMainCategory === category.name && (
                                    <div className={styles.subcategories}>
                                        {category.subcategories.map((subcategory) => (
                                            <button
                                                key={subcategory.id}
                                                className={`${styles.subcategoryButton} ${
                                                    activeSubcategory === subcategory.name ? styles.activeSubcategory : ''
                                                }`}
                                                onClick={() => selectCategory(category.name, subcategory.name)}
                                            >
                                                {subcategory.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                        <div className={styles.products}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div
                                        className={styles.productImage}
                                        style={{ backgroundColor: product.bgColor }}
                                    >
                                        {product.badge && (
                                            <span className={`${styles.badge} ${styles[product.badgeColor]}`}>
                                                {product.badge}
                                            </span>
                                        )}
                                        <button
                                            className={styles.favoriteButton}
                                            onClick={() => toggleFavorite(product.id)}
                                        >
                                            {favorites.includes(product.id) ? (
                                                <FaHeart className={styles.favoriteIconActive} />
                                            ) : (
                                                <FaRegHeart className={styles.favoriteIcon} />
                                            )}
                                        </button>
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <div className={styles.productPrice}>
                                            <span className={styles.currentPrice}>{product.price.toLocaleString()} ₽</span>
                                            {product.oldPrice && (
                                                <del className={styles.oldPrice}>{product.oldPrice.toLocaleString()} ₽</del>
                                            )}
                                        </div>
                                        <div className={styles.productRating}>
                                            {renderStars(product.rating)}
                                            <span className={styles.reviews}>({product.reviews})</span>
                                        </div>
                                        <button className={styles.addToCart}>
                                            <Link to="/productPage" className={styles.linkToCart}>
                                                <FaSearch className={styles.cartIcon} />
                                                Перейти к товару
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.pagination}>
                            <button className={styles.paginationButton}>
                                <FaChevronLeft />
                            </button>
                            <button className={`${styles.paginationButton} ${styles.activePage}`}>1</button>
                            <button className={styles.paginationButton}>2</button>
                            <button className={styles.paginationButton}>3</button>
                            <span className={styles.paginationDots}>...</span>
                            <button className={styles.paginationButton}>8</button>
                            <button className={styles.paginationButton}>
                                <FaChevronRight />
                            </button>
                        </div>
                    </main>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Catalog;