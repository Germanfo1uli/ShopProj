import React, { useState, useRef } from 'react';
import Breadcrumbs from "./Components/Breadcrumbs";
import styles from '../CSS/Home.module.css';
import stylesfooter from '../CSS/footer.module.css';
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
            <footer className={stylesfooter.footer}>
                <div className={stylesfooter.footerTop}>
                    <div className={stylesfooter.footerColumn}>
                        <h3 className={styles.footerTitle}>О компании</h3>
                        <ul className={stylesfooter.footerList}>
                            <li><a href="#">О нас</a></li>
                            <li><a href="#">Реквизиты</a></li>
                            <li><a href="#">Вакансии</a></li>
                            <li><a href="#">Контакты</a></li>
                            <li><a href="#">Партнерам</a></li>
                        </ul>
                    </div>

                    <div className={stylesfooter.footerColumn}>
                        <h3 className={stylesfooter.footerTitle}>Покупателям</h3>
                        <ul className={stylesfooter.footerList}>
                            <li><a href="#">Как сделать заказ</a></li>
                            <li><a href="#">Доставка</a></li>
                            <li><a href="#">Оплата</a></li>
                            <li><a href="#">Возврат</a></li>
                            <li><a href="#">Помощь</a></li>
                        </ul>
                    </div>

                    <div className={stylesfooter.footerColumn}>
                        <h3 className={stylesfooter.footerTitle}>Каталог</h3>
                        <ul className={stylesfooter.footerList}>
                            <li><a href="#">Смартфоны</a></li>
                            <li><a href="#">Ноутбуки</a></li>
                            <li><a href="#">Телевизоры</a></li>
                            <li><a href="#">Аксессуары</a></li>
                            <li><a href="#">Бытовая техника</a></li>
                        </ul>
                    </div>

                    <div className={stylesfooter.footerColumn}>
                        <h3 className={stylesfooter.footerTitle}>Контакты</h3>
                        <ul className={stylesfooter.footerList}>
                            <li className={stylesfooter.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <span>8 (800) 123-45-67</span>
                            </li>
                            <li className={stylesfooter.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <path d="M22 6l-10 7L2 6"/>
                                </svg>
                                <span>info@example.com</span>
                            </li>
                            <li className={stylesfooter.contactItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                <span>г. Москва, ул. Примерная, 123</span>
                            </li>
                        </ul>
                    </div>

                    <div className={stylesfooter.footerColumn}>
                        <h3 className={stylesfooter.footerTitle}>Мы в соцсетях</h3>
                        <div className={stylesfooter.socialLinks}>
                            <a href="#" aria-label="VKontakte">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M18.15 16.27H16.69C16.14 16.27 15.97 15.82 15 14.83C14.12 14 13.74 13.88 13.53 13.88C13.24 13.88 13.15 13.96 13.15 14.38V15.69C13.15 16.04 13.04 16.26 12.11 16.26C10.57 16.26 8.86 15.32 7.66 13.59C5.85 11.05 5.36 9.13 5.36 8.75C5.36 8.54 5.43 8.34 5.85 8.34H7.32C7.69 8.34 7.83 8.5 7.97 8.9C8.69 11 9.89 12.8 10.38 12.8C10.57 12.8 10.65 12.71 10.65 12.25V10.1C10.6 9.12 10.07 9.03 10.07 8.68C10.07 8.5 10.21 8.34 10.44 8.34H12.73C13.04 8.34 13.15 8.5 13.15 8.88V11.77C13.15 12.08 13.28 12.19 13.38 12.19C13.56 12.19 13.72 12.08 14.05 11.74C15.1 10.57 15.85 8.76 15.85 8.76C15.95 8.55 16.11 8.35 16.5 8.35H17.93C18.37 8.35 18.47 8.58 18.37 8.89C18.19 9.74 16.41 12.25 16.43 12.25C16.27 12.5 16.21 12.61 16.43 12.9C16.58 13.13 17.09 13.55 17.43 13.94C18.05 14.65 18.53 15.24 18.66 15.65C18.77 16.06 18.57 16.27 18.15 16.27"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="Telegram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="YouTube">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.65V8l6.22 3.83-6.22 3.82z"/>
                                </svg>
                            </a>
                        </div>
                        <div className={stylesfooter.appLinks}>
                            <a href="#" className={stylesfooter.appStoreLink}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
                            </a>
                            <a href="#" className={stylesfooter.googlePlayLink}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={stylesfooter.footerBottom}>
                    <div className={stylesfooter.copyright}>
                        © 2023 TechShop. Все права защищены.
                    </div>
                    <div className={stylesfooter.legalLinks}>
                        <a href="#">Политика конфиденциальности</a>
                        <a href="#">Условия использования</a>
                        <a href="#">Публичная оферта</a>
                    </div>
                    <div className={stylesfooter.paymentMethods}>
                        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <rect x="0.5" y="0.5" width="39" height="23" rx="3.5" fill="white" stroke="#E2E2E2"/>
                            <path d="M28.5 16H30.5V14H28.5V16ZM25.5 16H27.5V14H25.5V16ZM31 8H9C7.9 8 7 8.9 7 10V18C7 19.1 7.9 20 9 20H31C32.1 20 33 19.1 33 18V10C33 8.9 32.1 8 31 8ZM31 18H9V12H31V18Z" fill="#5F6368"/>
                        </svg>
                        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <rect x="0.5" y="0.5" width="39" height="23" rx="3.5" fill="white" stroke="#E2E2E2"/>
                            <path d="M30 8H10C8.9 8 8 8.9 8 10V14C8 15.1 8.9 16 10 16H30C31.1 16 32 15.1 32 14V10C32 8.9 31.1 8 30 8ZM30 14H10V10H30V14Z" fill="#5F6368"/>
                            <path d="M15.5 12C15.5 12.8284 14.8284 13.5 14 13.5C13.1716 13.5 12.5 12.8284 12.5 12C12.5 11.1716 13.1716 10.5 14 10.5C14.8284 10.5 15.5 11.1716 15.5 12Z" fill="#5F6368"/>
                            <path d="M19.5 12C19.5 12.8284 18.8284 13.5 18 13.5C17.1716 13.5 16.5 12.8284 16.5 12C16.5 11.1716 17.1716 10.5 18 10.5C18.8284 10.5 19.5 11.1716 19.5 12Z" fill="#5F6368"/>
                            <path d="M23.5 12C23.5 12.8284 22.8284 13.5 22 13.5C21.1716 13.5 20.5 12.8284 20.5 12C20.5 11.1716 21.1716 10.5 22 10.5C22.8284 10.5 23.5 11.1716 23.5 12Z" fill="#5F6368"/>
                            <path d="M27.5 12C27.5 12.8284 26.8284 13.5 26 13.5C25.1716 13.5 24.5 12.8284 24.5 12C24.5 11.1716 25.1716 10.5 26 10.5C26.8284 10.5 27.5 11.1716 27.5 12Z" fill="#5F6368"/>
                        </svg>
                        <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                            <rect x="0.5" y="0.5" width="39" height="23" rx="3.5" fill="white" stroke="#E2E2E2"/>
                            <path d="M32 8H8C6.9 8 6 8.9 6 10V14C6 15.1 6.9 16 8 16H32C33.1 16 34 15.1 34 14V10C34 8.9 33.1 8 32 8ZM32 14H8V10H32V14Z" fill="#5F6368"/>
                            <path d="M22 12C22 13.1046 21.1046 14 20 14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12Z" fill="#5F6368"/>
                        </svg>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;