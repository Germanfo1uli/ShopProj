import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from '../../CSS/ProfileCSS/HistoryCard.module.css';

const HistoryCard = ({ item, productImages }) => {
    return (
        <div className={styles.productCard}>
            <div className={styles.productImageWrapper}>
                <img
                    src={productImages[item.productId] || 'https://via.placeholder.com/300'}
                    alt={item.productName}
                    className={styles.productImage}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300';
                    }}
                />
            </div>
            <div className={styles.productDetails}>
                <h3 className={styles.productTitle}>{item.productName}</h3>
                <div className={styles.viewedAt}>
                    Просмотрено: {new Date(item.viewedAt).toLocaleDateString()}
                </div>
                <Link
                    to={`/product/${item.productId}`}
                    className={styles.viewProductButton}
                >
                    <FaSearch className={styles.searchIcon} />
                    Перейти к товару
                </Link>
            </div>
        </div>
    );
};

export default HistoryCard;