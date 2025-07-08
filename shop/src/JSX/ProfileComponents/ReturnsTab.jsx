import styles from '../../CSS/ProfileCSS/ReturnsTab.module.css';

const ReturnsTab = () => {
    return (
        <div className={styles.ordersContent}>
            <div className={styles.ordersHeader}>
                <h2 className={styles.ordersTitle}>Возвраты</h2>
            </div>
            <div className={styles.emptyState}>
                <i className="fas fa-box-open"></i>
                <p>У вас нет возвратов</p>
            </div>
        </div>
    );
};

export default ReturnsTab;