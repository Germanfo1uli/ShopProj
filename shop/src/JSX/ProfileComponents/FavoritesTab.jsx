import { useState, useEffect } from 'react';
import styles from '../../CSS/ProfileCSS/FavoritetesTab.module.css';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../Hooks/UseAuth.js';
import { apiRequest } from '../Api/ApiRequest.js';

const FavoritesTab = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (!userId || !isAuthenticated) return;
                
                setLoading(true);
                const response = await apiRequest(`/api/userfavorites/${userId}`, {
                    authenticated: isAuthenticated 
                });
                setFavorites(response || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch favorites');
                console.error('Error fetching favorites:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [userId, isAuthenticated]);

    const removeFromFavorites = async (productId) => {
        try {
            if (!userId || !isAuthenticated) return;
            
            await apiRequest('/api/userfavorites', {
                method: 'DELETE',
                body: {
                    userId: userId,
                    productId: productId
                },
                authenticated: isAuthenticated
            });
            setFavorites(favorites.filter(item => item.id !== productId));
        } 
        catch (err) {
            console.error('Error removing favorite:', err);
            alert(err.message || 'Failed to remove favorite');
        }
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

    if (loading) {
        return (
            <div className={styles.profileCard}>
                <h1 className={styles.cardTitle}>Избранное</h1>
                <div className={styles.loadingState}>Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.profileCard}>
                <h1 className={styles.cardTitle}>Избранное</h1>
                <div className={styles.errorState}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.profileCard}>
            <h1 className={styles.cardTitle}>Избранное</h1>
            {favorites.length > 0 ? (
                <div className={styles.products}>
                    {favorites.map(item => (
                        <div key={item.id} className={styles.productCard}>
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
                                    src={item.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className={styles.productImage}
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
                                    <span className={styles.reviewsCount}>({item.reviewsCount || 0})</span>
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