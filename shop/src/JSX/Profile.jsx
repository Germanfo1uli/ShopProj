import { useState, useEffect } from 'react';
import { useAuth } from './Hooks/UseAuth.js';
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
import { useNavigate } from "react-router-dom";
import AdminPanel from "./ProfileComponents/AdminPanel";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
    const { isAuthenticated, userId, token, logout, isLoading: authLoading } = useAuth();

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phoneNumber: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [activeMenu, setActiveMenu] = useState('profile');
    const [activeTab, setActiveTab] = useState('orders');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStats, setUserStats] = useState({
        totalOrders: 0,
        totalSavings: 0
    });

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Имя обязательно'),
        lastName: Yup.string().required('Фамилия обязательна'),
        middleName: Yup.string(),
        phoneNumber: Yup.string().matches(/^\+?\d{10,15}$/, 'Неверный формат телефона'),
    });

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
                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    middleName: data.middleName || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                });

                const ordersResponse = await apiRequest(`/api/orders/${userId}/stats`, {
                    authenticated: isAuthenticated
                });

                setUserStats({
                    totalOrders: ordersResponse.orderCount || 0,
                    totalSavings: ordersResponse.totalSavings || 0,
                });

            } catch (err) {
                console.error('Ошибка загрузки данных пользователя:', err);
                setError('Не удалось загрузить данные пользователя');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isAuthenticated, userId, token, authLoading]);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async (values) => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);
            const updatedData = await apiRequest(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            setProfileData(updatedData);
            setIsEditing(false);
        } catch (err) {
            console.error('Ошибка сохранения данных:', err);
            setError('Не удалось сохранить изменения');
        } finally {
            setLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'returns':
                return <ReturnsTab />;
            case 'subscriptions':
                return <SubscriptionsTab />;
            case 'admin':
                return <AdminPanel />;
            default:
                return <OrdersTab />;
        }
    };

    const renderProfileInfo = () => {
        if (authLoading || loading) return <div className={styles.loading}>Загрузка...</div>;
        if (error) return <div className={styles.error}>{error}</div>;
        if (!isAuthenticated) return <div className={styles.error}>Требуется авторизация</div>;

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
                            <p className={styles.infoLabel}>Отчество</p>
                            <p className={styles.infoValue}>{profileData.middleName}</p>
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
                            <p className={styles.infoValue}>{profileData.phoneNumber || 'Не указан'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
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
            case 'admin':
                return <AdminPanel />;
            default:
                return (
                    <>
                        <div className={styles.profileCard}>
                            <div className={styles.cardHeader}>
                                <h1 className={styles.cardTitle}>Мой профиль</h1>
                                {!isEditing && (
                                    <button
                                        className={styles.editButton}
                                        onClick={handleEditClick}
                                    >
                                        <i className="fas fa-pen"></i> Редактировать
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <Formik
                                    initialValues={profileData}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, { setSubmitting }) => {
                                        handleSaveChanges(values).finally(() => setSubmitting(false));
                                    }}
                                >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className={styles.profileGrid}>
                                                <div>
                                                    <h3 className={styles.sectionTitle}>Основная информация</h3>
                                                    <div className={styles.infoSection}>
                                                        <div>
                                                            <p className={styles.infoLabel}>Имя</p>
                                                            <Field
                                                                type="text"
                                                                name="firstName"
                                                                className={styles.editInput}
                                                            />
                                                            <ErrorMessage name="firstName" component="div" className={styles.error} />
                                                        </div>
                                                        <div>
                                                            <p className={styles.infoLabel}>Фамилия</p>
                                                            <Field
                                                                type="text"
                                                                name="lastName"
                                                                className={styles.editInput}
                                                            />
                                                            <ErrorMessage name="lastName" component="div" className={styles.error} />
                                                        </div>
                                                        <div>
                                                            <p className={styles.infoLabel}>Отчество</p>
                                                            <Field
                                                                type="text"
                                                                name="middleName"
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
                                                            <Field
                                                                type="email"
                                                                name="email"
                                                                className={styles.editInput}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className={styles.infoLabel}>Телефон</p>
                                                            <Field
                                                                type="tel"
                                                                name="phoneNumber"
                                                                className={styles.editInput}
                                                            />
                                                            <ErrorMessage name="phoneNumber" component="div" className={styles.error} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.editActions}>
                                                <button
                                                    type="submit"
                                                    className={styles.saveButton}
                                                    disabled={isSubmitting}
                                                >
                                                    <i className="fas fa-check"></i> Сохранить
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.cancelButton}
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    <i className="fas fa-times"></i> Отмена
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            ) : (
                                renderProfileInfo()
                            )}
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statContent}>
                                    <div>
                                        <p className={styles.statLabel}>Заказов</p>
                                        <p className={styles.statValue}>{userStats.totalOrders}</p>
                                    </div>
                                    <div className={styles.statIcon}>
                                        <i className="fas fa-box"></i>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statContent}>
                                    <div>
                                        <p className={styles.statLabel}>Экономия</p>
                                        <p className={styles.statValue}>
                                            {userStats.totalSavings.toLocaleString('ru-RU')} ₽
                                        </p>
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
                                </div>
                            </div>
                            {renderTabContent()}
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
                                    className={`${styles.navLink} ${activeMenu === 'admin' ? styles.activeLink : ''}`}
                                    onClick={() => setActiveMenu('admin')}
                                >
                                    <i className="fas fa-user-shield"></i>
                                    <span>Админ панель</span>
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