import styles from '../../CSS/Profile.module.css';
const SubscriptionsTab = () => {
    return (
        <div className={styles.ordersContent}>
            <div className={styles.ordersHeader}>
                <h2 className={styles.ordersTitle}>Подписки</h2>
            </div>
            <div className={styles.emptyState}>
                <i className="fas fa-bell"></i>
                <p>У вас нет активных подписок</p>
            </div>
        </div>
    );
};

export default SubscriptionsTab;