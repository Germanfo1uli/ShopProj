import { useState, useEffect } from 'react';
import {useToken} from './Hooks/UseToken.js';
import { apiRequest } from './Api/ApiRequest.js'; 
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
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [activeMenu, setActiveMenu] = useState('profile');
    const [userData, setUserData] = useState(null); 
    const { isAuthenticated, userId, token, isLoading: authLoading } = useToken();
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Никита',
        lastName: 'Шушаков',
        birthDate: '15 января 2000',
        email: 'Zolodov@gmail.com',
        phone: '+7 (912) 345-67-89',
        preferences: ['Электроника', 'Спорт', 'Книги']
    });
    const [newPreference, setNewPreference] = useState('');

useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || authLoading || !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await apiRequest(`/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setUserData(data);
        console.log('Data:', data);
      } 
      
      catch (err) {
        console.error('Ошибка загрузки данных пользователя:', err);
        setError('Не удалось загрузить данные пользователя');
      } 
      
      finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, userId, token, authLoading]);



    //ТУТ ЛОГИКУ С ВЫХОДОМ!!!!
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        navigate('/home');
    };




    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        setIsEditing(false);
        //  GIVE ME would typically send the updated data to your suka backend
        console.log('Profile data saved:', profileData);
    };

    const handleAddPreference = () => {
        if (newPreference.trim() && !profileData.preferences.includes(newPreference)) {
            setProfileData(prev => ({
                ...prev,
                preferences: [...prev.preferences, newPreference.trim()]
            }));
            setNewPreference('');
        }
    };

    const handleRemovePreference = (prefToRemove) => {
        setProfileData(prev => ({
            ...prev,
            preferences: prev.preferences.filter(pref => pref !== prefToRemove)
        }));
    };

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

    const renderProfileInfo = () => {
        if (isEditing) {
            return (
                <div className={styles.profileGrid}>
                    <div>
                        <h3 className={styles.sectionTitle}>Основная информация</h3>
                        <div className={styles.infoSection}>
                            <div>
                                <p className={styles.infoLabel}>Имя</p>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleInputChange}
                                    className={styles.editInput}
                                />
                            </div>
                            <div>
                                <p className={styles.infoLabel}>Фамилия</p>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleInputChange}
                                    className={styles.editInput}
                                />
                            </div>
                            <div>
                                <p className={styles.infoLabel}>Дата рождения</p>
                                <input
                                    type="text"
                                    name="birthDate"
                                    value={profileData.birthDate}
                                    onChange={handleInputChange}
                                    className={styles.editInput}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className={styles.sectionTitle}>Контакты</h3>
                        <div className={styles.infoSection}>
                            <div>
                                <p className={styles.infoLabel}>Эл. почта</p>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    className={styles.editInput}
                                />
                            </div>
                            <div>
                                <p className={styles.infoLabel}>Телефон</p>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleInputChange}
                                    className={styles.editInput}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.profileGrid}>
                    <div>
                        <h3 className={styles.sectionTitle}>Основная информация</h3>
                        <div className={styles.infoSection}>
                            <div>
                                <p className={styles.infoLabel}>Имя</p>
                                <p className={styles.infoValue}>{profileData.firstName}</p>
                            </div>
                            <div>
                                <p className={styles.infoLabel}>Фамилия</p>
                                <p className={styles.infoValue}>{profileData.lastName}</p>
                            </div>
                            <div>
                                <p className={styles.infoLabel}>Дата рождения</p>
                                <p className={styles.infoValue}>{profileData.birthDate}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className={styles.sectionTitle}>Контакты</h3>
                        <div className={styles.infoSection}>
                            <div>
                                <p className={styles.infoLabel}>Эл. почта</p>
                                <p className={styles.infoValue}>{profileData.email}</p>
                            </div>
                            <div>
                                <p className={styles.infoLabel}>Телефон</p>
                                <p className={styles.infoValue}>{profileData.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderPreferences = () => {
        if (isEditing) {
            return (
                <div className={styles.preferencesSection}>
                    <h3 className={styles.sectionTitle}>Предпочтения</h3>
                    <div className={styles.preferencesTags}>
                        {profileData.preferences.map((pref, index) => (
                            <span key={index} className={styles.tag}>
                            {pref}
                                <button
                                    onClick={() => handleRemovePreference(pref)}
                                    className={styles.removeTagButton}
                                >
                                <i className="fas fa-times"></i>
                            </button>
                        </span>
                        ))}
                        <div className={styles.addPreferenceContainer}>
                            <input
                                type="text"
                                value={newPreference}
                                onChange={(e) => setNewPreference(e.target.value)}
                                placeholder="Добавить предпочтение"
                                className={styles.addPreferenceInput}
                            />
                            <button
                                onClick={handleAddPreference}
                                className={styles.addTagButton}
                            >
                                <i className="fas fa-plus"></i> Добавить
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.preferencesSection}>
                    <h3 className={styles.sectionTitle}>Предпочтения</h3>
                    <div className={styles.preferencesTags}>
                        {profileData.preferences.map((pref, index) => (
                            <span key={index} className={styles.tag}>{pref}</span>
                        ))}
                    </div>
                </div>
            );
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
                                {isEditing ? (
                                    <div className={styles.editActions}>
                                        <button
                                            className={styles.saveButton}
                                            onClick={handleSaveChanges}
                                        >
                                            <i className="fas fa-check"></i> Сохранить
                                        </button>
                                        <button
                                            className={styles.cancelButton}
                                            onClick={() => setIsEditing(false)}
                                        >
                                            <i className="fas fa-times"></i> Отмена
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className={styles.editButton}
                                        onClick={handleEditClick}
                                    >
                                        <i className="fas fa-pen"></i> Редактировать
                                    </button>
                                )}
                            </div>

                            {renderProfileInfo()}
                            {renderPreferences()}
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
                                {/* Product cards remain the same */}
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
                                    <h2 className={styles.userName}>{profileData.firstName} {profileData.lastName.charAt(0)}</h2>
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
                                <button
                                    className={styles.navLink}
                                    onClick={handleLogout}
                                >
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