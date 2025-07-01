import styles from '../../CSS/Profile.module.css';

const History = () => {
    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>История просмотров</h1>
            </div>
            <div className={styles.emptyState}>
                <i className="fas fa-clock"></i>
                <p>Ваша история просмотров пуста</p>
            </div>
        </div>
    );
};

export default History;