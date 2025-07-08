import React, { useState, useRef, useEffect } from 'react';
import styles from '../CSS/Home.module.css';
import Footer from "./Components/Footer";
import { FaGift, FaGem, FaFire } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { apiRequest } from '../JSX/Api/ApiRequest';
import LoadingSpinner from './Components/LoadingSpinner';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const slides = [
        {
            id: 1,
            image: "https://ir-5.ozone.ru/s3/cms/c7/t97/wc1450/1450_100.jpg"
        },
        {
            id: 2,
            image: "https://static-basket-01.wbbasket.ru/vol1/crm-bnrs/bners1/vygoda_po_letnemu_18_06_2880_336.webp"
        },
        {
            id: 3,
            image: "https://static-basket-01.wbbasket.ru/vol1/crm-bnrs/bnnrsdmn/image/2880x336/f16c5805-36dd-4a13-a69a-b7745882e72e.webp"
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiRequest('/api/products');
                const formattedProducts = data.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price.toLocaleString('ru-RU') + ' ₽',
                    oldPrice: product.oldPrice ? product.oldPrice.toLocaleString('ru-RU') + ' ₽' : null,
                    discount: product.oldPrice
                        ? Math.round((1 - product.price / product.oldPrice) * 100).toString()
                        : null,
                    specs: product.description ? product.description.substring(0, 50) + '...' : 'Нет описания',
                    rating: 4.5 + Math.random() * 0.5,
                    reviews: Math.floor(Math.random() * 200),
                    image: 'https://via.placeholder.com/300'
                }));
                setProducts(formattedProducts);
                setLoading(false);
            } catch (err) {
                console.error('Ошибка при загрузке товаров:', err);
                setError('Не удалось загрузить товары.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleTransitionEnd = () => {
        setIsSwitching(false);
    };

    const goToSlide = (index) => {
        if (isSwitching) return;
        setIsSwitching(true);
        setCurrentSlide(index);
    };

    const handlePrevSlide = () => {
        if (isSwitching) return;
        setIsSwitching(true);
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        if (isSwitching) return;
        setIsSwitching(true);
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    if (loading) {
        return <LoadingSpinner message="Загружаем товары..." status="loading" />;
    }

    if (error) {
        return <LoadingSpinner message={error} status="error" />;
    }

    if (products.length === 0) {
        return <LoadingSpinner message="Нет доступных товаров" status="empty" />;
    }

    const recommendedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
    const specialOffers = [...products]
        .filter(product => product.discount)
        .sort((a, b) => parseFloat(b.discount) - parseFloat(a.discount))
        .slice(0, 8);

    return (
        <div className={styles.container}>
            {/* Слайдер */}
            <div className={styles.slider} ref={sliderRef}>
                <div
                    className={styles.track}
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                        transition: 'transform 0.5s ease-in-out'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className={styles.slide}>
                            <img src={slide.image} alt="" className={styles.slideImage} />
                        </div>
                    ))}
                </div>

                <button className={`${styles.btn} ${styles.prev}`} onClick={handlePrevSlide}>
                    &lt;
                </button>
                <button className={`${styles.btn} ${styles.next}`} onClick={handleNextSlide}>
                    &gt;
                </button>

                <div className={styles.dots}>
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Популярные товары */}
            <div className={styles.productSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleAccent}><FaFire /></span> Популярные товары
                    </h2>
                    <Link
                        to="/catalog"
                        state={{ filter: 'popular' }}
                        className={styles.showAllLink}
                    >
                        Смотреть все <span className={styles.arrow}>→</span>
                    </Link>
                </div>
                <div className={styles.productGrid}>
                    {products.slice(0, 8).map(product => (
                        <Link
                            to={`/product/${product.id}`}
                            key={`popular-${product.id}`}
                            className={styles.productCardLink}
                        >
                            <div className={styles.productCard}>
                                {product.discount && (
                                    <div className={styles.discountContainer}>
                                        <span className={styles.discountBadge}>-{product.discount}%</span>
                                    </div>
                                )}
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                                <div className={styles.productInfo}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.productSpecs}>{product.specs}</p>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.productPrice}>{product.price}</span>
                                        {product.oldPrice && (
                                            <span className={styles.oldPrice}>{product.oldPrice}</span>
                                        )}
                                    </div>
                                    <div className={styles.ratingContainer}>
                                        {/* ... */}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Рекомендации для вас */}
            <div className={styles.productSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleAccent}><FaGem /></span> Рекомендации для вас
                    </h2>
                    <Link
                        to="/catalog"
                        state={{ filter: 'recommended' }}
                        className={styles.showAllLink}
                    >
                        Смотреть все <span className={styles.arrow}>→</span>
                    </Link>
                </div>
                <div className={styles.productGrid}>
                    {recommendedProducts.map(product => (
                        <Link
                            to={`/product/${product.id}`}
                            key={`rec-${product.id}`}
                            className={styles.productCardLink}
                        >
                            <div className={styles.productCard}>
                                {product.discount && (
                                    <div className={styles.discountContainer}>
                                        <span className={styles.discountBadge}>-{product.discount}%</span>
                                    </div>
                                )}
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                                <div className={styles.productInfo}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.productSpecs}>{product.specs}</p>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.productPrice}>{product.price}</span>
                                        {product.oldPrice && (
                                            <span className={styles.oldPrice}>{product.oldPrice}</span>
                                        )}
                                    </div>
                                    <div className={styles.ratingContainer}>
                                        <div className={styles.stars}>
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                                                >
                  ★
                </span>
                                            ))}
                                        </div>
                                        <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                                        <span className={styles.reviews}>({product.reviews})</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Спецпредложения */}
            <div className={styles.productSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleAccent}><FaGift /></span> Спецпредложения
                    </h2>
                    <Link
                        to="/catalog"
                        state={{ filter: 'special' }}
                        className={styles.showAllLinkHot}
                    >
                        Смотреть все <span className={styles.arrow}>→</span>
                    </Link>
                </div>
                <div className={styles.productGrid}>
                    {specialOffers.map(product => (
                        <Link
                            to={`/product/${product.id}`}
                            key={`spec-${product.id}`}
                            className={styles.productCardLink}
                        >
                            <div className={styles.productCardHot}>
                                <div className={styles.specialOfferBadge}>Горящее предложение</div>
                                {product.discount && (
                                    <div className={styles.discountContainer}>
                                        <span className={styles.discountBadge}>-{product.discount}%</span>
                                    </div>
                                )}
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                                <div className={styles.productInfo}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.productSpecs}>{product.specs}</p>
                                    <div className={styles.priceContainer}>
                                        <span className={styles.productPriceHot}>{product.price}</span>
                                        {product.oldPrice && (
                                            <span className={styles.oldPrice}>{product.oldPrice}</span>
                                        )}
                                    </div>
                                    <div className={styles.ratingContainer}>
                                        <div className={styles.stars}>
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                                                >
                    ★
                  </span>
                                            ))}
                                        </div>
                                        <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                                        <span className={styles.reviews}>({product.reviews})</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Home;