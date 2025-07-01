import { useState } from 'react';
import styles from '../../CSS/Profile.module.css';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FavoritesTab = () => {
    const [favorites, setFavorites] = useState([
        {
            id: 1,
            image: "https://m.media-amazon.com/images/I/71h6PpGaz9L._AC_UL320_.jpg",
            title: "Наушники Sony WH-1000XM4",
            price: 24990,
            oldPrice: 27990,
            rating: 4.7,
            reviews: 128,
            bgColor: "#f5f5f5"
        },
        {
            id: 2,
            image: "https://m.media-amazon.com/images/I/71Kc2oLYRFL._AC_UL320_.jpg",
            title: "Фитнес-браслет Xiaomi Mi Band 6",
            price: 3490,
            rating: 4.5,
            reviews: 86,
            bgColor: "#e6e6e6"
        },
        {
            id: 3,
            image: "https://m.media-amazon.com/images/I/71xBS8kJ0jL._AC_UL320_.jpg",
            title: "Чехол для iPhone 13 Pro, черный",
            price: 1290,
            oldPrice: 1990,
            rating: 5.0,
            reviews: 42,
            bgColor: "#f0f0f0"
        },

    ]);

    const removeFromFavorites = (id) => {
        setFavorites(favorites.filter(item => item.id !== id));
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className={styles.star} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStarHalfAlt key={i} className={styles.star} />);
            } else {
                stars.push(<FaRegStar key={i} className={styles.star} />);
            }
        }
        return stars;
    };

    return (
        <div className={styles.profileCard}>
            <h1 className={styles.cardTitle}>Избранное</h1>
            {favorites.length > 0 ? (
                <div className={styles.products}>
                    {favorites.map(item => (
                        <div key={item.id} className={styles.productCard}>
                            <div
                                className={styles.productImageWrapper}
                                style={{ backgroundColor: item.bgColor }}
                            >
                                {item.badge && (
                                    <span className={`${styles.badge} ${styles[item.badgeColor]}`}>
                                        {item.badge}
                                    </span>
                                )}
                                <button
                                    className={styles.favoriteButton}
                                    onClick={() => removeFromFavorites(item.id)}
                                >
                                    <FaHeart className={styles.favoriteIconActive} />
                                </button>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={styles.productImage}
                                />
                            </div>
                            <div className={styles.productDetails}>
                                <h3 className={styles.productTitle}>{item.title}</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.currentPrice}>{item.price.toLocaleString()} ₽</span>
                                    {item.oldPrice && (
                                        <span className={styles.oldPrice}>{item.oldPrice.toLocaleString()} ₽</span>
                                    )}
                                </div>
                                <div className={styles.ratingContainer}>
                                    <div className={styles.stars}>
                                        {renderStars(item.rating)}
                                    </div>
                                    <span className={styles.reviewsCount}>({item.reviews})</span>
                                </div>
                                <Link
                                    to={`/productPage`}
                                    className={styles.viewProductButton}
                                >
                                    <FaSearch className={styles.searchIcon} />
                                    Перейти к товару
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FaRegHeart className={styles.emptyHeartIcon} />
                    <p>В избранном пока ничего нет</p>
                    <p>Добавляйте товары в избранное, чтобы не потерять их</p>
                </div>
            )}
        </div>
    );
};

export default FavoritesTab;