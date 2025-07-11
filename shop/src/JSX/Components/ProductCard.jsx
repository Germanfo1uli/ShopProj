import { FaHeart, FaStar, FaRegStar, FaStarHalfAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from '../../CSS/ProfileCSS/FavoritetesTab.module.css';

const ProductCard = ({ item, productImages, removeFromFavorites, renderStars }) => {
    return (
        <div className={styles.productCard}>
            <div
                className={styles.productImageWrapper}
                style={{ backgroundColor: '#f5f5f5' }}
            >
                <button
                    className={styles.favoriteButton}
                    onClick={() => removeFromFavorites(item.id)}
                >
                    <FaHeart className={styles.favoriteIconActive} />
                </button>
                <img
                    src={productImages[item.id] || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className={styles.productImage}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                    }}
                />
            </div>
            <div className={styles.productDetails}>
                <h3 className={styles.productTitle}>{item.name}</h3>
                <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>{item.price?.toLocaleString()} ₽</span>
                    {item.oldPrice && (
                        <span className={styles.oldPrice}>{item.oldPrice?.toLocaleString()} ₽</span>
                    )}
                </div>
                <div className={styles.ratingContainer}>
                    <div className={styles.stars}>
                        {renderStars(item.rating || 0)}
                    </div>
                    <span className={styles.reviewsCount}>({item.reviewsNumber || 0})</span>
                </div>
                <Link
                    to={`/product/${item.id}`}
                    className={styles.viewProductButton}
                >
                    <FaSearch className={styles.searchIcon} />
                    Перейти к товару
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;