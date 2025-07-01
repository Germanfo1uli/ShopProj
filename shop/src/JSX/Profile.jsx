import { useState, useEffect } from 'react';
import styles from '../CSS/Profile.module.css';
import Footer from "./Components/Footer";
import History from './ProfileComponents/History';
import Addresses from './ProfileComponents/Addresses';
import Payments from './ProfileComponents/Payments';
import Settings from './ProfileComponents/Settings';
import OrdersTab from './ProfileComponents/OrdersTab';
import ReturnsTab from './ProfileComponents/ReturnsTab';
import SubscriptionsTab from './ProfileComponents/SubscriptionsTab';
import FavoritesTab from './ProfileComponents/FavoritesTab';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [activeMenu, setActiveMenu] = useState('profile');

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'returns':
                return <ReturnsTab />;
            case 'subscriptions':
                return <SubscriptionsTab />;
            default:
                return <OrdersTab />;
        }
    };

    const renderMenuContent = () => {
        switch (activeMenu) {
            case 'favorites':
                return <FavoritesTab />;
            case 'history':
                return <History />;
            case 'addresses':
                return <Addresses />;
            case 'payments':
                return <Payments />;
            case 'settings':
                return <Settings />;
            default:
                return (
                    <>
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
                                    <button
                                        className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        Заказы
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'returns' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('returns')}
                                    >
                                        Возвраты
                                    </button>
                                    <button
                                        className={`${styles.tab} ${activeTab === 'subscriptions' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('subscriptions')}
                                    >
                                        Подписки
                                    </button>
                                </div>
                            </div>

                            {renderTabContent()}
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
                    </>
                );
        }
    };

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
                                </div>
                                <div>
                                    <h2 className={styles.userName}>Никита Ш</h2>
                                    <p className={styles.userLevel}>Адский покупатель</p>
                                </div>
                            </div>

                            <nav className={styles.sidebarNav}>
                                <button
                                    className={`${styles.navLink} ${activeMenu === 'profile' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('profile')}
                                >
                                    <i className="fas fa-user"></i>
                                    <span>Профиль</span>
                                </button>
                                <button
                                    className={`${styles.navLink} ${activeMenu === 'favorites' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('favorites')}
                                >
                                    <i className="fas fa-heart"></i>
                                    <span>Избранное</span>
                                </button>
                                <button
                                    className={`${styles.navLink} ${activeMenu === 'history' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('history')}
                                >
                                    <i className="fas fa-clock"></i>
                                    <span>История просмотров</span>
                                </button>
                                <button
                                    className={`${styles.navLink} ${activeMenu === 'addresses' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('addresses')}
                                >
                                    <i className="fas fa-map-marked-alt"></i>
                                    <span>Адреса доставки</span>
                                </button>
                                <button
                                    className={`${styles.navLink} ${activeMenu === 'payments' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('payments')}
                                >
                                    <i className="fas fa-credit-card"></i>
                                    <span>Платежные методы</span>
                                </button>
                                <button
                                    className={`${styles.navLink} ${activeMenu === 'settings' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('settings')}
                                >
                                    <i className="fas fa-cog"></i>
                                    <span>Настройки</span>
                                </button>
                                <button className={styles.navLink}>
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Выход</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <div className={styles.profileContent}>
                        {renderMenuContent()}
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default Profile;