import React, { useState, useEffect, use } from 'react';
import styles from '../CSS/Catalog.module.css';
import sb from '../CSS/Breadcrumbs.module.css';
import { useLocation } from "react-router-dom";
import {
    FaHeart, FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt,
    FaChevronLeft, FaChevronRight, FaStore, FaSearch,
    FaChevronDown, FaChevronUp, FaGift, FaGem, FaFire
} from 'react-icons/fa';
import Footer from "./Components/Footer";
import { Link } from "react-router-dom";
import { apiRequest } from './Api/ApiRequest';
import { useAuth} from './Hooks/UseAuth.js';

const Catalog = () => {
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState('Все товары');
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [expandedFilterCategory, setExpandedFilterCategory] = useState(null);
    const [expandedMainCategory, setExpandedMainCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 12000]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('popularity');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productImages, setProductImages] = useState({}); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {userId, isAuthenticated, logout } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const handleMouseEnterCategory = (categoryName) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setExpandedMainCategory(categoryName);
    };

    const handleMouseLeaveCategory = () => {
        const timer = setTimeout(() => {
            setExpandedMainCategory(null);
        }, 300);
        setHoverTimeout(timer);
    };

    const handleMouseEnterSubmenu = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
    };

    const handleMouseLeaveSubmenu = () => {
        const timer = setTimeout(() => {
            setExpandedMainCategory(null);
        }, 300);
        setHoverTimeout(timer);
    };

        useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const allCategories = await apiRequest('/api/categories');
                const parentCategories = await apiRequest('/api/categories/parents');

                if (userId) {
                    const userFavorites = await apiRequest(`/api/userfavorites/${userId}`, {
                        authenticated: isAuthenticated  
                    });
                    
                    const favoriteIds = userFavorites.map(fav => Number(fav.id)); 
                    setFavorites(favoriteIds);
                } else {
                    setFavorites([]);
                }

                const categoriesStructure = parentCategories.map(parent => {
                    const children = allCategories.filter(
                        cat => cat.parentCategoryId === parent.id
                    );
                    
                    return {
                        id: parent.id,
                        name: parent.name,
                        subcategories: children.map(child => ({
                            id: child.id,
                            name: child.name
                        })),
                        icon: null,
                        buttonStyle: styles.defaultCategoryButton,
                        isPopular: parent.name === 'Популярные товары',
                        isRecommended: parent.name === 'Рекомендации для вас',
                        isSpecial: parent.name === 'Спецпредложения'
                    };
                });

                const specialCategories = [
                    {
                        id: 0,
                        name: 'Все товары',
                        subcategories: [],
                        icon: null,
                        buttonStyle: styles.defaultCategoryButton
                    },
                    {
                        id: -1,
                        name: 'Популярные товары',
                        subcategories: [],
                        icon: <FaFire className={styles.categoryIcon} />,
                        buttonStyle: styles.popularButton,
                        isPopular: true
                    },
                    {
                        id: -2,
                        name: 'Рекомендации для вас',
                        subcategories: [],
                        icon: <FaGem className={styles.categoryIcon} />,
                        buttonStyle: styles.recommendationsButton,
                        isRecommended: true
                    },
                    {
                        id: -3,
                        name: 'Спецпредложения',
                        subcategories: [],
                        icon: <FaGift className={styles.categoryIcon} />,
                        buttonStyle: styles.specialOffersButton,
                        isSpecial: true
                    }
                ];

                setCategories([...specialCategories, ...categoriesStructure]);
                const productsData = await apiRequest('/api/products');
                setProducts(productsData);

                // Загружаем изображения для всех продуктов
                const imagesResponse = await apiRequest('/api/productimages');
                const imagesByProduct = {};
                
                imagesResponse.forEach(image => {
                    if (!imagesByProduct[image.productId]) {
                        imagesByProduct[image.productId] = [];
                    }
                    imagesByProduct[image.productId].push(image);
                });

                setProductImages(imagesByProduct);
                
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, isAuthenticated]);

    useEffect(() => {
    if (products.length === 0 || categories.length === 0) return;

    let result = [...products];

    if (activeCategory !== 'Все товары') {
        const category = categories.find(cat => cat.name === activeCategory);
        if (category) {
        if (category.isPopular) {
            result = result.filter(product => product.isPopular);
        } 
        else if (category.isRecommended) {
            result = result.filter(product => product.isRecommended);
        } 
        else if (category.isSpecial) {
            result = result.filter(product => product.isSpecial);
        } 
        else {
            const categoryIds = [category.id, ...category.subcategories?.map(sub => sub.id) || []];
            result = result.filter(product => categoryIds.includes(product.categoryId));
        }
        }
    }

    if (activeSubcategory) {
        const subcategory = categories
        .flatMap(cat => cat.subcategories || [])
        .find(sub => sub.name === activeSubcategory);
        
        if (subcategory) {
        result = result.filter(product => product.categoryId === subcategory.id);
        }
    }

    result = result.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedSizes.length > 0) {
        result = result.filter(product =>
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
        );
    }

    if (selectedColors.length > 0) {
        result = result.filter(product =>
        product.color && selectedColors.includes(product.color)
        );
    }
    result = sortProducts(result, sortOption);
    setFilteredProducts(result);
    }, [activeCategory, activeSubcategory, priceRange, selectedSizes, selectedColors, sortOption, products, categories]);

    useEffect(() => {
        if (location.state?.filter) {
            switch(location.state.filter) {
                case 'popular':
                    setActiveCategory('Популярные товары');
                    break;
                case 'recommended':
                    setActiveCategory('Рекомендации для вас');
                    break;
                case 'special':
                    setActiveCategory('Спецпредложения');
                    break;
                default:
                    setActiveCategory('Все товары');
            }
        }
    }, [location.state]);

    const sortProducts = (products, option) => {
        const sorted = [...products];
        switch(option) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'popularity':
            default:
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0));
        }
    };

     const toggleCategory = (categoryName, section = 'main') => {
        if (section === 'filter') {
            setExpandedFilterCategory(prev => 
                prev === categoryName ? null : categoryName
            );
        } else {
            setExpandedMainCategory(prev => 
                prev === categoryName ? null : categoryName
            );
        }
    };

     const selectCategory = (categoryName, subcategory = null) => {
        setActiveCategory(categoryName);
        setActiveSubcategory(subcategory);
        setExpandedFilterCategory(null);
        setExpandedMainCategory(null);
    };

    const handleCategoryClick = (category) => {
        if (category.subcategories.length > 0) {
            toggleCategory(category.name, 'main');
        } else {
            selectCategory(category.name);
        }
    };

    const handleFilterCategoryClick = (categoryName) => {
        selectCategory(categoryName);
        setExpandedFilterCategory(null);
    };


    const toggleFavorite = async (productId) => {
        const numericProductId = Number(productId);
        if (!userId) {
            alert('Войдите в систему, чтобы добавлять товары в избранное');
            return;
        }

        try {
            const isCurrentlyFavorite = favorites.includes(numericProductId);
            const newFavorites = isCurrentlyFavorite
                ? favorites.filter(id => id !== numericProductId)
                : [...favorites, numericProductId];
            setFavorites(newFavorites);
            const response = await apiRequest('/api/userfavorites', {
                method: isCurrentlyFavorite ? 'DELETE' : 'POST',
                body: {
                    userId: userId,
                    productId: numericProductId
                },
                authenticated: isAuthenticated
            });
            if (response) {
                const updatedFavorites = await apiRequest(`/api/userfavorites/${userId}`, {
                    authenticated: isAuthenticated
                });
                
                const favoriteIds = updatedFavorites.map(item => {
                    if (item.id) return Number(item.id);
                    if (item.productId) return Number(item.productId);
                    return null;
                }).filter(id => id !== null);
                
                setFavorites(favoriteIds);
            }
        } 
        catch (error) {
            console.error('Ошибка при обновлении избранного:', error);
            
            // Восстанавливаем предыдущее состояние
            try {
                const currentFavorites = await apiRequest(`/api/userfavorites/${userId}`, {
                    authenticated: isAuthenticated
                });
                
                const favoriteIds = currentFavorites.map(item => {
                    if (item.id) return Number(item.id);
                    if (item.productId) return Number(item.productId);
                    return null;
                }).filter(id => id !== null);
                
                setFavorites(favoriteIds);
            } catch (err) {
                console.error('Не удалось восстановить избранное:', err);
                setFavorites([]); // В крайнем случае сбрасываем избранное
            }
            
            alert('Не удалось обновить избранное: ' + error.message);
        }
    };

    const handlePriceChange = (e, index) => {
        const newValue = parseInt(e.target.value) || 0;
        const newPriceRange = [...priceRange];
        newPriceRange[index] = newValue;
        setPriceRange(newPriceRange);
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

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className={styles.star} />);
            } 
            else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
            } 
            else {
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

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }
    const colors = ['white', 'black', 'blue', 'gray', 'red', 'green', 'yellow', 'purple', 'pink'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    return (
        <div className={styles.catalog}>
            <div className={styles.container}>
                <nav className={sb.breadcrumbs}>
                    <Link to="/home" className={sb.breadcrumbLink}>Главная</Link>
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
                                    <li key={category.id}>
                                        <div 
                                            className={`${styles.categoryLink} ${
                                                activeCategory === category.name ? styles.active : ''
                                            }`}
                                            onMouseEnter={() => category.subcategories.length > 0 && setExpandedFilterCategory(category.name)}
                                            onMouseLeave={() => setExpandedFilterCategory(null)}
                                            onClick={() => handleFilterCategoryClick(category.name)}
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
                                                {category.subcategories.map(subcategory => (
                                                    <li key={subcategory.id}>
                                                        <div
                                                            className={`${styles.subcategoryLink} ${
                                                                activeSubcategory === subcategory.name ? styles.active : ''
                                                            }`}
                                                            onClick={() => selectCategory(category.name, subcategory.name)}
                                                        >
                                                            {subcategory.name}
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
                                    key={category.id}
                                    className={styles.categoryItem}
                                >
                                    <button
                                        className={`${styles.categoryButton} ${
                                            activeCategory === category.name ? styles.activeCategory : ''
                                        } ${category.buttonStyle || ''}`}
                                        onClick={() => handleCategoryClick(category)}
                                        onMouseEnter={() => category.subcategories.length > 0 && handleMouseEnterCategory(category.name)}
                                        onMouseLeave={handleMouseLeaveCategory}
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
                                        <div
                                            className={styles.subcategories}
                                            onMouseEnter={handleMouseEnterSubmenu}
                                            onMouseLeave={handleMouseLeaveSubmenu}
                                        >
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
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => {
                                    const images = productImages[product.id] || [];
                                    const mainImage = images.find(img => img.isMain) || images[0];

                                    return (
                                        <div key={product.id} className={styles.productCard}>
                                            <div className={styles.productImage}>
                                                {mainImage ? (
                                                    <img 
                                                        src={mainImage.imageUrl} 
                                                        alt={product.name}
                                                        className={styles.productImage}
                                                    />
                                                ) : (
                                                    <div className={styles.imagePlaceholder}>Нет изображения</div>
                                                )}
                                                
                                                {product.badge && (
                                                    <span className={`${styles.badge} ${styles[product.badgeColor || 'blue']}`}>
                                                        {product.badge}
                                                    </span>
                                                )}
                                                
                                                <button
                                                    className={styles.favoriteButton}
                                                    onClick={() => toggleFavorite(Number(product.id))} 
                                                    disabled={!userId} 
                                                    title={!userId ? "Войдите, чтобы добавить в избранное" : ""}
                                                >
                                                    {favorites.includes(Number(product.id)) ? ( 
                                                        <FaHeart className={styles.favoriteIconActive} />
                                                    ) : (
                                                        <FaRegHeart className={styles.favoriteIcon} />
                                                    )}
                                                </button>
                                            </div>
                                            
                                            <div className={styles.productInfo}>
                                                <h3 className={styles.productName}>{product.name}</h3>
                                                <div className={styles.productPrice}>
                                                    <span className={styles.currentPrice}>
                                                        {product.price.toLocaleString('ru-RU')} ₽
                                                    </span>
                                                    {product.oldPrice && product.oldPrice > 0 && (
                                                        <del className={styles.oldPrice}>
                                                            {product.oldPrice.toLocaleString('ru-RU')} ₽
                                                        </del>
                                                    )}
                                                </div>
                                                <div className={styles.productRating}>
                                                    {renderStars(product.rating || 0)}
                                                    <span className={styles.reviews}>({product.reviews || 0})</span>
                                                </div>
                                                <button className={styles.addToCart}>
                                                    <Link to={`/product/${product.id}`} className={styles.linkToCart}>
                                                        <FaSearch className={styles.cartIcon} />
                                                        Перейти к товару
                                                    </Link>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
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
                        </div>`

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