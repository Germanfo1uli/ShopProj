import React, { useState, useEffect } from 'react';
import styles from '../CSS/Catalog.module.css';
import sb from '../CSS/Breadcrumbs.module.css';
import {
    FaHeart, FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt,
    FaChevronLeft, FaChevronRight, FaStore, FaSearch,
    FaChevronDown, FaChevronUp, FaGift, FaGem, FaFire
} from 'react-icons/fa';
import Footer from "./Components/Footer";
import { Link } from "react-router-dom";
import { apiRequest } from './Api/ApiRequest';

const Catalog = () => {
    const [activeCategory, setActiveCategory] = useState('Все товары');
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [expandedFilterCategory, setExpandedFilterCategory] = useState(null); // только для filterSection
    const [expandedMainCategory, setExpandedMainCategory] = useState(null); // только для main
    const [favorites, setFavorites] = useState([2]);
    const [priceRange, setPriceRange] = useState([0, 12000]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('popularity');

    const categories = [
        {
            name: 'Все товары',
            subcategories: [],
            icon: null,
            buttonStyle: styles.defaultCategoryButton
        },
        {
            name: 'Популярные товары',
            subcategories: [],
            icon: <FaFire className={styles.categoryIcon} />,
            buttonStyle: styles.popularButton,
            isPopular: true
        },
        {
            name: 'Рекомендации для вас',
            subcategories: [],
            icon: <FaGem className={styles.categoryIcon} />,
            buttonStyle: styles.recommendationsButton,
            isRecommended: true
        },
        {
            name: 'Спецпредложения',
            subcategories: [],
            icon: <FaGift className={styles.categoryIcon} />,
            buttonStyle: styles.specialOffersButton,
            isSpecial: true
        },
        {
            name: 'Одежда',
            subcategories: [
                'Женская одежда',
                'Мужская одежда',
                'Детская одежда',
                'Футболки',
                'Джинсы',
                'Платья',
                'Верхняя одежда'
            ],
            icon: null,
            buttonStyle: styles.defaultCategoryButton,
            type: 'clothing'
        },
        {
            name: 'Посуда',
            subcategories: [
                'Кухонная посуда',
                'Столовая посуда',
                'Чайные наборы',
                'Кофейные наборы',
                'Стеклянная посуда'
            ],
            icon: null,
            buttonStyle: styles.defaultCategoryButton,
            type: 'dishes'
        },
        {
            name: 'Декор',
            subcategories: [
                'Картины',
                'Вазы',
                'Статуэтки',
                'Зеркала',
                'Часы'
            ],
            icon: null,
            buttonStyle: styles.defaultCategoryButton,
            type: 'decor'
        },
        {
            name: 'Текстиль',
            subcategories: [
                'Пледы',
                'Подушки',
                'Скатерти',
                'Шторы',
                'Полотенца'
            ],
            icon: null,
            buttonStyle: styles.defaultCategoryButton,
            type: 'textile'
        },
        {
            name: 'Аксессуары',
            subcategories: [
                'Сумки',
                'Кошельки',
                'Ремни',
                'Головные уборы',
                'Шарфы'
            ],
            icon: null,
            buttonStyle: styles.defaultCategoryButton,
            type: 'accessories'
        }
    ];

    const allProducts = [
        {
            id: 1,
            name: 'Платье хлопковое нежно-розовое',
            price: 3490,
            oldPrice: 4290,
            rating: 4.5,
            reviews: 24,
            badge: 'Новинка',
            badgeColor: 'blue',
            bgColor: '#f5f5f5',
            type: 'clothing',
            sizes: ['S', 'M', 'L'],
            color: 'pink',
            isPopular: true,
            dateAdded: '2023-05-15'
        },
        {
            id: 2,
            name: 'Чайный набор фарфоровый, 12 предметов',
            price: 7290,
            rating: 4,
            reviews: 18,
            bgColor: '#e6e6e6',
            type: 'dishes',
            color: 'white',
            isRecommended: true,
            dateAdded: '2023-06-20'
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
            bgColor: '#f0f0f0',
            type: 'clothing',
            sizes: ['M', 'L', 'XL'],
            color: 'blue',
            isSpecial: true,
            dateAdded: '2023-04-10'
        },
        {
            id: 4,
            name: 'Плед вязаный, 140×180 см, голубой',
            price: 2990,
            rating: 4.5,
            reviews: 27,
            bgColor: '#e6e6e6',
            type: 'textile',
            color: 'blue',
            dateAdded: '2023-07-05'
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
            bgColor: '#f5f5f5',
            type: 'clothing',
            sizes: ['XS'],
            color: 'pink',
            dateAdded: '2023-08-12'
        },
        {
            id: 6,
            name: 'Кружка керамическая с рисунком, 350 мл',
            price: 690,
            rating: 5,
            reviews: 42,
            badge: 'Хит',
            badgeColor: 'red',
            bgColor: 'white',
            type: 'dishes',
            color: 'white',
            isPopular: true,
            dateAdded: '2023-03-22'
        }
    ];

    const colors = ['white', 'black', 'blue', 'gray', 'red', 'green', 'yellow', 'purple', 'pink'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        let result = [...allProducts];

        // Фильтрация по категории
        if (activeCategory !== 'Все товары') {
            const category = categories.find(cat => cat.name === activeCategory);

            if (category) {
                if (category.isPopular) {
                    result = result.filter(product => product.isPopular);
                } else if (category.isRecommended) {
                    result = result.filter(product => product.isRecommended);
                } else if (category.isSpecial) {
                    result = result.filter(product => product.isSpecial);
                } else if (category.type) {
                    result = result.filter(product => product.type === category.type);
                }
            }
        }

        // Фильтрация по цене
        result = result.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Фильтрация по размеру
        if (selectedSizes.length > 0) {
            result = result.filter(product =>
                product.sizes && product.sizes.some(size => selectedSizes.includes(size))
            );
        }

        // Фильтрация по цвету
        if (selectedColors.length > 0) {
            result = result.filter(product =>
                selectedColors.includes(product.color)
            );
        }

        // Сортировка
        result = sortProducts(result, sortOption);

        setFilteredProducts(result);
    }, [activeCategory, priceRange, selectedSizes, selectedColors, sortOption]);

    const sortProducts = (products, option) => {
        const sorted = [...products];

        switch(option) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'popularity':
            default:
                return sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        }
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const toggleSizeSelection = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const toggleColorSelection = (color) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const toggleCategory = (categoryName, section = 'main') => {
        if (section === 'filter') {
            setExpandedFilterCategory(expandedFilterCategory === categoryName ? null : categoryName);
        } else {
            setExpandedMainCategory(expandedMainCategory === categoryName ? null : categoryName);
        }
    };

    const selectCategory = (categoryName, subcategory = null) => {
        setActiveCategory(categoryName);
        setActiveSubcategory(subcategory);
        // Сбрасываем оба состояния раскрытия категорий
        setExpandedFilterCategory(null);
        setExpandedMainCategory(null);
    };
    const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
            setFavorites(favorites.filter(id => id !== productId));
        } else {
            setFavorites([...favorites, productId]);
        }
    };

    const handlePriceChange = (e, index) => {
        const newValue = parseInt(e.target.value) || 0;
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

    const resetFilters = () => {
        setActiveCategory('Все товары');
        setActiveSubcategory(null);
        setPriceRange([0, 12000]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setSortOption('popularity');
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
                        <select
                            className={styles.sortSelect}
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value="popularity">По популярности</option>
                            <option value="price-asc">По возрастанию цены</option>
                            <option value="price-desc">По убыванию цены</option>
                            <option value="newest">По новизне</option>
                        </select>
                    </div>
                </div>

                <div className={styles.content}>
                    <aside className={styles.filters}>
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Категории</h3>
                            <ul className={styles.categoryList}>
                                {categories.map((category) => (
                                    <li key={category.name}>
                                        <div 
                                            className={`${styles.categoryLink} ${
                                                activeCategory === category.name ? styles.active : ''
                                            }`}
                                            onMouseEnter={() => category.subcategories.length > 0 && setExpandedFilterCategory(category.name)}
                                            onMouseLeave={() => setExpandedFilterCategory(null)}
                                            onClick={() => {
                                                selectCategory(category.name);
                                                setExpandedFilterCategory(null);
                                            }}
                                        >
                                            <span>{category.name}</span>
                                            {category.subcategories.length > 0 && (
                                                <span className={styles.categoryArrow}>
                                                    {expandedFilterCategory === category.name ? 
                                                        <FaChevronUp /> : <FaChevronDown />
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        
                                        {category.subcategories.length > 0 && expandedFilterCategory === category.name && (
                                            <ul className={styles.subcategoryList}>
                                                {category.subcategories.map((subcategory, index) => (
                                                    <li key={`${category.name}-${index}`}>
                                                        <div
                                                            className={`${styles.subcategoryLink} ${
                                                                activeSubcategory === subcategory ? styles.active : ''
                                                            }`}
                                                            onClick={() => selectCategory(category.name, subcategory)}
                                                        >
                                                            {subcategory}
                                                        </div>
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
                                <span>{priceRange[0].toLocaleString()} ₽</span>
                                <span>{priceRange[1].toLocaleString()} ₽</span>
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
                                        min="0"
                                        max={priceRange[1]}
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
                                        min={priceRange[0]}
                                        max="20000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Размер</h3>
                            <div className={styles.sizeGrid}>
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`${styles.sizeButton} ${
                                            selectedSizes.includes(size) ? styles.sizeButtonActive : ''
                                        }`}
                                        onClick={() => toggleSizeSelection(size)}
                                    >
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
                                        className={`${styles.colorButton} ${
                                            selectedColors.includes(color) ? styles.colorButtonActive : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => toggleColorSelection(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            className={styles.resetFilters}
                            onClick={resetFilters}
                        >
                            Сбросить фильтры
                        </button>
                    </aside>

                    <main className={styles.main}>
                        <div className={styles.categoryMenu}>
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className={styles.categoryItem}
                                    onMouseEnter={() => category.subcategories.length > 0 && setExpandedMainCategory(category.name)}
                                    onMouseLeave={() => setExpandedMainCategory(null)}
                                >
                                    <button
                                        className={`${styles.categoryButton} ${
                                            activeCategory === category.name ? styles.activeCategory : ''
                                        } ${category.buttonStyle}`}
                                        onClick={() => {
                                            if (category.subcategories.length > 0) {
                                                toggleCategory(category.name, 'main');
                                            } else {
                                                selectCategory(category.name);
                                            }
                                        }}
                                    >
                                        <span className={styles.categoryName}>
                                            {category.icon && (
                                                <span className={styles.iconWrapper}>
                                                    {category.icon}
                                                </span>
                                            )}
                                            {category.name}
                                        </span>
                                        {category.subcategories.length > 0 && (
                                            expandedMainCategory === category.name ?
                                                <FaChevronUp className={styles.categoryArrow} /> :
                                                <FaChevronDown className={styles.categoryArrow} />
                                        )}
                                    </button>

                                    {category.subcategories.length > 0 && expandedMainCategory === category.name && (
                                        <div className={styles.subcategories}>
                                            {category.subcategories.map((subcategory, index) => (
                                                <button
                                                    key={`${category.name}-sub-${index}`}
                                                    className={`${styles.subcategoryButton} ${
                                                        activeSubcategory === subcategory ? styles.activeSubcategory : ''
                                                    }`}
                                                    onClick={() => selectCategory(category.name, subcategory)}
                                                >
                                                    {subcategory}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.products}>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
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
                                                <Link to={`/product/${product.id}`} className={styles.linkToCart}>
                                                    <FaSearch className={styles.cartIcon} />
                                                    Перейти к товару
                                                </Link>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    <FaSearch className={styles.noResultsIcon} />
                                    <h3>Товары не найдены</h3>
                                    <p>Попробуйте изменить параметры фильтров</p>
                                    <button
                                        className={styles.resetFilters}
                                        onClick={resetFilters}
                                    >
                                        Сбросить все фильтры
                                    </button>
                                </div>
                            )}
                        </div>

                        {filteredProducts.length > 0 && (
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
                        )}
                    </main>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Catalog;