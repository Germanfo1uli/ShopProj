import styles from '../../CSS/Profile.module.css';

const Addresses = () => {
    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>Адреса доставки</h1>
                <button className={styles.editButton}>
                    <i className="fas fa-plus"></i> Добавить адрес
                </button>
            </div>
            <div className={styles.emptyState}>
                <i className="fas fa-map-marker-alt"></i>
                <p>У вас нет сохраненных адресов</p>
            </div>
        </div>
    );
};

export default Addresses;