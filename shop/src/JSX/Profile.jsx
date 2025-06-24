import { useState, useEffect } from 'react';
import styles from '../CSS/Profile.module.css';
import Footer from "./Components/Footer";


const Profile = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.profileContainer}>
            <main className={styles.mainContent}>
                <div className={styles.profileLayout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <div className={styles.userInfo}>
                                <div className={styles.avatarEdit}>
                                    <img
                                        src="https://randomuser.me/api/portraits/men/32.jpg"
                                        alt="User avatar"
                                        className={styles.avatar}
                                    />
                                    <div className={styles.avatarOverlay}>
                                        <i className="fas fa-camera"></i>
                                    </div>
                                </div>
                                <div>
                                    <h2 className={styles.userName}>Никита Ш</h2>
                                    <p className={styles.userLevel}>Адский покупатель</p>
                                </div>
                            </div>

                            <nav className={styles.sidebarNav}>
                                <a href="#" className={`${styles.navLink} ${styles.activeLink}`}>
                                    <i className="fas fa-user"></i>
                                    <span>Профиль</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-shopping-bag"></i>
                                    <span>Мои заказы</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-heart"></i>
                                    <span>Избранное</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-clock"></i>
                                    <span>История просмотров</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-map-marked-alt"></i>
                                    <span>Адреса доставки</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-credit-card"></i>
                                    <span>Платежные методы</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-cog"></i>
                                    <span>Настройки</span>
                                </a>
                                <a href="#" className={styles.navLink}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Выход</span>
                                </a>
                            </nav>
                        </div>
                    </aside>


                    <div className={styles.profileContent}>

                        <div className={styles.profileCard}>
                            <div className={styles.cardHeader}>
                                <h1 className={styles.cardTitle}>Мой профиль</h1>
                                <button className={styles.editButton}>
                                    <i className="fas fa-pen"></i> Редактировать
                                </button>
                            </div>

                            <div className={styles.profileGrid}>
                                <div>
                                    <h3 className={styles.sectionTitle}>Основная информация</h3>
                                    <div className={styles.infoSection}>
                                        <div>
                                            <p className={styles.infoLabel}>Имя</p>
                                            <p className={styles.infoValue}>Никита</p>
                                        </div>
                                        <div>
                                            <p className={styles.infoLabel}>Фамилия</p>
                                            <p className={styles.infoValue}>Шушаков</p>
                                        </div>
                                        <div>
                                            <p className={styles.infoLabel}>Дата рождения</p>
                                            <p className={styles.infoValue}>15 января 2000</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className={styles.sectionTitle}>Контакты</h3>
                                    <div className={styles.infoSection}>
                                        <div>
                                            <p className={styles.infoLabel}>Эл. почта</p>
                                            <p className={styles.infoValue}>Zolodov@gmail.com</p>
                                        </div>
                                        <div>
                                            <p className={styles.infoLabel}>Телефон</p>
                                            <p className={styles.infoValue}>+7 (912) 345-67-89</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.preferencesSection}>
                                <h3 className={styles.sectionTitle}>Предпочтения</h3>
                                <div className={styles.preferencesTags}>
                                    <span className={styles.tag}>Электроника</span>
                                    <span className={styles.tag}>Спорт</span>
                                    <span className={styles.tag}>Книги</span>
                                    <button className={styles.addTagButton}>
                                        <i className="fas fa-plus"></i> Добавить
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statContent}>
                                    <div>
                                        <p className={styles.statLabel}>Заказов</p>
                                        <p className={styles.statValue}>24</p>
                                    </div>
                                    <div className={styles.statIcon}>
                                        <i className="fas fa-box"></i>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statContent}>
                                    <div>
                                        <p className={styles.statLabel}>Бонусов</p>
                                        <p className={styles.statValue}>8,725</p>
                                    </div>
                                    <div className={styles.statIcon}>
                                        <i className="fas fa-coins"></i>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statContent}>
                                    <div>
                                        <p className={styles.statLabel}>Экономия</p>
                                        <p className={styles.statValue}>34.560 ₽</p>
                                    </div>
                                    <div className={styles.statIcon}>
                                        <i className="fas fa-piggy-bank"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.ordersCard}>
                            <div className={styles.tabsContainer}>
                                <div className={styles.tabs}>
                                    <button className={`${styles.tab} ${styles.activeTab}`}>Заказы</button>
                                    <button className={styles.tab}>Возвраты</button>
                                    <button className={styles.tab}>Подписки</button>
                                </div>
                            </div>

                            <div className={styles.ordersContent}>
                                <div className={styles.ordersHeader}>
                                    <h2 className={styles.ordersTitle}>Последние заказы</h2>
                                    <a href="#" className={styles.allOrdersLink}>Все заказы →</a>
                                </div>

                                <div className={styles.ordersList}>
                                    <div className={styles.orderItem}>
                                        <div className={styles.orderHeader}>
                                            <div>
                                                <p className={styles.orderNumber}>Заказ #32456</p>
                                                <p className={styles.orderDate}>15 февраля 2023 • 3 товара</p>
                                            </div>
                                            <span className={`${styles.statusBadge} ${styles.delivered}`}>Доставлен</span>
                                        </div>

                                        <div className={styles.orderProducts}>
                                            <div className={styles.productImage}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/71h6PpGaz9L._AC_UL320_.jpg"
                                                    alt="Product"
                                                />
                                            </div>
                                            <div className={styles.productImage}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/71Kc2oLYRFL._AC_UL320_.jpg"
                                                    alt="Product"
                                                />
                                            </div>
                                            <div className={styles.productImage}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/71xBS8kJ0jL._AC_UL320_.jpg"
                                                    alt="Product"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.orderFooter}>
                                            <p className={styles.orderTotal}>12,490 ₽</p>
                                            <div className={styles.orderActions}>
                                                <button className={styles.actionButton}>Повторить заказ</button>
                                                <button className={styles.actionButton}>Оставить отзыв</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.orderItem}>
                                        <div className={styles.orderHeader}>
                                            <div>
                                                <p className={styles.orderNumber}>Заказ #32189</p>
                                                <p className={styles.orderDate}>10 февраля 2023 • 2 товара</p>
                                            </div>
                                            <span className={`${styles.statusBadge} ${styles.inDelivery}`}>В пути</span>
                                        </div>

                                        <div className={styles.orderProducts}>
                                            <div className={styles.productImage}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/61L1ItFgFHL._AC_UL320_.jpg"
                                                    alt="Product"
                                                />
                                            </div>
                                            <div className={styles.productImage}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/71Q8gm97H6L._AC_UL320_.jpg"
                                                    alt="Product"
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.orderFooter}>
                                            <p className={styles.orderTotal}>8,750 ₽</p>
                                            <div className={styles.orderActions}>
                                                <button className={styles.actionButton}>Отследить</button>
                                                <button className={styles.actionButton}>Подробнее</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.recommendationsCard}>
                            <h2 className={styles.recommendationsTitle}>Рекомендуем вам</h2>
                            <p className={styles.recommendationsSubtitle}>На основе ваших покупок и просмотров</p>

                            <div className={styles.productsGrid}>
                                <div className={styles.productCard}>
                                    <div className={styles.productImageWrapper}>
                                        <img
                                            src="https://m.media-amazon.com/images/I/71h6PpGaz9L._AC_UL320_.jpg"
                                            alt="Наушники"
                                            className={styles.productImage}
                                        />
                                        <button className={styles.favoriteButton}>
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>
                                    <p className={styles.productTitle}>Наушники Sony WH-1000XM4</p>
                                    <div className={styles.rating}>
                                        <div className={styles.stars}>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star-half-alt"></i>
                                        </div>
                                        <span className={styles.ratingValue}>4.7</span>
                                    </div>
                                    <p className={styles.productPrice}>24,990 ₽</p>
                                </div>
                                <div className={styles.productCard}>
                                    <div className={styles.productImageWrapper}>
                                        <img
                                            src="https://m.media-amazon.com/images/I/71Kc2oLYRFL._AC_UL320_.jpg"
                                            alt="Фитнес-браслет"
                                            className={styles.productImage}
                                        />
                                        <button className={styles.favoriteButton}>
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>
                                    <p className={styles.productTitle}>Фитнес-браслет Xiaomi Mi Band 6</p>
                                    <div className={styles.rating}>
                                        <div className={styles.stars}>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="far fa-star"></i>
                                        </div>
                                        <span className={styles.ratingValue}>4.5</span>
                                    </div>
                                    <p className={styles.productPrice}>3,490 ₽</p>
                                </div>
                                <div className={styles.productCard}>
                                    <div className={styles.productImageWrapper}>
                                        <img
                                            src="https://m.media-amazon.com/images/I/71xBS8kJ0jL._AC_UL320_.jpg"
                                            alt="Чехол"
                                            className={styles.productImage}
                                        />
                                        <button className={styles.favoriteButton}>
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>
                                    <p className={styles.productTitle}>Чехол для iPhone 13 Pro, черный</p>
                                    <div className={styles.rating}>
                                        <div className={styles.stars}>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <span className={styles.ratingValue}>5.0</span>
                                    </div>
                                    <p className={styles.productPrice}>1,290 ₽</p>
                                </div>
                                <div className={styles.productCard}>
                                    {loading ? (
                                        <>
                                            <div className={`${styles.productImageWrapper} ${styles.skeletonLoading}`}></div>
                                            <div className={`${styles.skeletonText} ${styles.skeletonLoading}`}></div>
                                            <div className={`${styles.skeletonText} ${styles.skeletonLoading}`}></div>
                                            <div className={`${styles.skeletonPrice} ${styles.skeletonLoading}`}></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={styles.productImageWrapper}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/61L1ItFgFHL._AC_UL320_.jpg"
                                                    alt="Умная колонка"
                                                    className={styles.productImage}
                                                />
                                                <button className={styles.favoriteButton}>
                                                    <i className="fas fa-heart"></i>
                                                </button>
                                            </div>
                                            <p className={styles.productTitle}>Умная колонка Яндекс Станция Мини</p>
                                            <div className={styles.rating}>
                                                <div className={styles.stars}>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="far fa-star"></i>
                                                </div>
                                                <span className={styles.ratingValue}>4.0</span>
                                            </div>
                                            <p className={styles.productPrice}>5,990 ₽</p>
                                        </>
                                    )}
                                </div>
                                <div className={styles.productCard}>
                                    {loading ? (
                                        <>
                                            <div className={`${styles.productImageWrapper} ${styles.skeletonLoading}`}></div>
                                            <div className={`${styles.skeletonText} ${styles.skeletonLoading}`}></div>
                                            <div className={`${styles.skeletonText} ${styles.skeletonLoading}`}></div>
                                            <div className={`${styles.skeletonPrice} ${styles.skeletonLoading}`}></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={styles.productImageWrapper}>
                                                <img
                                                    src="https://m.media-amazon.com/images/I/71Q8gm97H6L._AC_UL320_.jpg"
                                                    alt="Монитор"
                                                    className={styles.productImage}
                                                />
                                                <button className={styles.favoriteButton}>
                                                    <i className="fas fa-heart"></i>
                                                </button>
                                            </div>
                                            <p className={styles.productTitle}>Монитор Samsung 27"</p>
                                            <div className={styles.rating}>
                                                <div className={styles.stars}>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star"></i>
                                                    <i className="fas fa-star-half-alt"></i>
                                                </div>
                                                <span className={styles.ratingValue}>4.6</span>
                                            </div>
                                            <p className={styles.productPrice}>18,490 ₽</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button className={styles.allRecommendationsButton}>
                                Все рекомендации
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Profile;