import { useState, useEffect } from 'react';
import styles from '../../CSS/Profile.module.css';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('ru');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    // При загрузке компонента проверяем сохранённую тему
    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            setDarkMode(isDark);
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Тут по желанию системы типа
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                setDarkMode(true);
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    }, []);

    const handleThemeChange = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        const theme = newDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('darkMode', theme);
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        // Логика изменения языка
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>Настройки</h1>
            </div>

            <div className={styles.settingsContainer}>
                <div className={styles.settingsSection}>
                    <h3 className={styles.settingsTitle}>Внешний вид</h3>
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingName}>Тёмная тема</span>
                            <span className={styles.settingDescription}>
                                Включите тёмную тему для комфортного использования ночью
                            </span>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={handleThemeChange}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3 className={styles.settingsTitle}>Язык и регион</h3>
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingName}>Язык</span>
                        </div>
                        <select
                            className={styles.languageSelect}
                            value={language}
                            onChange={handleLanguageChange}
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3 className={styles.settingsTitle}>Уведомления</h3>
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingName}>Уведомления</span>
                            <span className={styles.settingDescription}>
                                Разрешить отправку уведомлений в браузере
                            </span>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={notificationsEnabled}
                                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingName}>Email-уведомления</span>
                            <span className={styles.settingDescription}>
                                Получать уведомления на электронную почту
                            </span>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() => setEmailNotifications(!emailNotifications)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <span className={styles.settingName}>SMS-уведомления</span>
                            <span className={styles.settingDescription}>
                                Получать уведомления по SMS
                            </span>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={smsNotifications}
                                onChange={() => setSmsNotifications(!smsNotifications)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3 className={styles.settingsTitle}>Конфиденциальность</h3>
                    <div className={styles.settingItem}>
                        <button className={styles.privacyButton}>
                            Настройки конфиденциальности
                        </button>
                    </div>
                    <div className={styles.settingItem}>
                        <button className={styles.privacyButton}>
                            Удалить историю просмотров
                        </button>
                    </div>
                </div>

                <div className={styles.settingsActions}>
                    <button className={styles.saveButton}>Сохранить изменения</button>
                    <button className={styles.cancelButton}>Отменить</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;