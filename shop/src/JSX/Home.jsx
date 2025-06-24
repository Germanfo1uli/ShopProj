import React, { useState, useRef } from 'react';
import styles from '../CSS/Home.module.css';
import Footer from "./Components/Footer";
/*Енто пизда*/
const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);
    const [isSwitching, setIsSwitching] = useState(false);

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

    const products = [
        {
            id: 1,
            name: 'Смартфон Xiaomi Redmi Note 12 Pro',
            price: '24 990 ₽',
            oldPrice: '27 990 ₽',
            discount: '11',
            specs: '8/256GB, AMOLED, 120Hz',
            rating: 4.8,
            reviews: 125,
            image: 'https://ir-5.ozone.ru/s3/multimedia-1-4/wc300/7569975388.jpg'
        },
        {
            id: 2,
            name: 'Наушники Sony WH-CH720N',
            price: '12 990 ₽',
            oldPrice: '15 990 ₽',
            discount: '19',
            specs: 'Беспроводные, ANC, 35ч',
            rating: 4.7,
            reviews: 89,
            image: 'https://sonycenter.ru/upload/resize_cache/iblock/7e3/520_520_1/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 3,
            name: 'Ноутбук ASUS VivoBook 15',
            price: '54 990 ₽',
            specs: '15.6", i5-1235U, 16GB, 512GB',
            rating: 4.9,
            reviews: 42,
            image: 'https://asusstore.ru/upload/iblock/3e8/3e8f8c8c5d5f5a5c5b5d5f5a5c5b5d5f.jpg'
        },
        {
            id: 4,
            name: 'Умные часы Amazfit GTS 4',
            price: '14 990 ₽',
            oldPrice: '16 990 ₽',
            discount: '12',
            specs: 'AMOLED, GPS, NFC',
            rating: 4.6,
            reviews: 67,
            image: 'https://amazfit.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 5,
            name: 'Планшет Samsung Galaxy Tab S9',
            price: '64 990 ₽',
            specs: '11", 8GB/128GB, S-Pen',
            rating: 5.0,
            reviews: 31,
            image: 'https://samsungstore.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 6,
            name: 'Фитнес-браслет Huawei Band 8',
            price: '3 990 ₽',
            oldPrice: '4 990 ₽',
            discount: '20',
            specs: '1.47", трекинг сна',
            rating: 4.5,
            reviews: 112,
            image: 'https://huaweistore.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 7,
            name: 'Колонка JBL Flip 6',
            price: '8 990 ₽',
            specs: 'IP67, 12ч работы',
            rating: 4.8,
            reviews: 56,
            image: 'https://jblstore.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 8,
            name: 'Игровая консоль PlayStation 5',
            price: '59 990 ₽',
            specs: '825GB SSD, 4K',
            rating: 5.0,
            reviews: 203,
            image: 'https://sonycenter.ru/upload/resize_cache/iblock/7e3/520_520_1/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 9,
            name: 'Фотоаппарат Canon EOS R50',
            price: '65 990 ₽',
            oldPrice: '69 990 ₽',
            discount: '6',
            specs: '24.2MP, 4K видео',
            rating: 4.7,
            reviews: 28,
            image: 'https://canonstore.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 10,
            name: 'Электронная книга PocketBook 740',
            price: '19 990 ₽',
            specs: '7.8", 32GB, подсветка',
            rating: 4.9,
            reviews: 47,
            image: 'https://pocketbook.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 11,
            name: 'Монитор LG UltraFine 27UP850',
            price: '48 990 ₽',
            oldPrice: '52 990 ₽',
            discount: '8',
            specs: '27", 4K, USB-C',
            rating: 4.8,
            reviews: 39,
            image: 'https://lgstore.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        },
        {
            id: 12,
            name: 'Внешний аккумулятор Anker 737',
            price: '7 990 ₽',
            specs: '24000mAh, 140W',
            rating: 4.6,
            reviews: 83,
            image: 'https://ankerstore.ru/upload/iblock/7e3/7e3b0b9c8c5d5f5a5c5b5d5f5a5c5b5d.jpg'
        }
    ];

    const recommendedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
    const specialOffers = [...products]
        .filter(product => product.discount)
        .sort((a, b) => parseFloat(b.discount) - parseFloat(a.discount))
        .slice(0, 8);

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
                        <span className={styles.titleAccent}>🔥</span> Популярные товары
                    </h2>
                    <a href="#" className={styles.showAllLink}>
                        Смотреть все <span className={styles.arrow}>→</span>
                    </a>
                </div>
                <div className={styles.productGrid}>
                    {products.slice(0, 8).map(product => (
                        <div key={`popular-${product.id}`} className={styles.productCard}>
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
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                          fill={i < product.rating ? "currentColor" : "none"}
                                                          stroke="currentColor"
                                                          strokeWidth="1.5"/>
                                                </svg>
                                            </span>
                                        ))}
                                    </div>
                                    <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                                    <span className={styles.reviews}>({product.reviews})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Рекомендации для вас */}
            <div className={styles.productSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleAccent}>💎</span> Рекомендации для вас
                    </h2>
                    <a href="#" className={styles.showAllLink}>
                        Смотреть все <span className={styles.arrow}>→</span>
                    </a>
                </div>
                <div className={styles.productGrid}>
                    {recommendedProducts.map(product => (
                        <div key={`rec-${product.id}`} className={styles.productCard}>
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
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                          fill={i < product.rating ? "currentColor" : "none"}
                                                          stroke="currentColor"
                                                          strokeWidth="1.5"/>
                                                </svg>
                                            </span>
                                        ))}
                                    </div>
                                    <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                                    <span className={styles.reviews}>({product.reviews})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.productSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleAccent}>🎁</span> Спецпредложения
                    </h2>
                    <a href="#" className={styles.showAllLinkHot}>
                        Смотреть все <span className={styles.arrow}>→</span>
                    </a>
                </div>
                <div className={styles.productGrid}>
                    {specialOffers.map(product => (
                        <div key={`spec-${product.id}`} className={styles.productCardHot}>
                            <div className={styles.specialOfferBadge}>🔥 Горящее предложение</div>
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
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                          fill={i < product.rating ? "currentColor" : "none"}
                                                          stroke="currentColor"
                                                          strokeWidth="1.5"/>
                                                </svg>
                                            </span>
                                        ))}
                                    </div>
                                    <span className={styles.ratingValue}>{product.rating.toFixed(1)}</span>
                                    <span className={styles.reviews}>({product.reviews})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Home;