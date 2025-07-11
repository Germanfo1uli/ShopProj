import { useState, useEffect } from 'react';
import styles from '../../CSS/ProfileCSS/FavoritetesTab.module.css';
import { FaRegHeart, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { useAuth } from '../Hooks/UseAuth.js';
import { apiRequest } from '../Api/ApiRequest.js';
import ProductCard from '../Components/ProductCard';
import st from "../../CSS/LoadingSpinner.module.css";

const FavoritesTab = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, isAuthenticated } = useAuth();
    const [productImages, setProductImages] = useState({});

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (!userId || !isAuthenticated) return;

                setLoading(true);
                const response = await apiRequest(`/api/userfavorites/${userId}`, {
                    authenticated: isAuthenticated
                });
                setFavorites(response || []);
                const images = {};
                for (const item of response) {
                    try {
                        const imageResponse = await apiRequest(`/api/products/${item.id}/main`);
                        images[item.id] = imageResponse?.imageUrl || 'https://via.placeholder.com/150';
                    } catch (err) {
                        console.error(`Error fetching image for product ${item.id}:`, err);
                        images[item.id] = 'https://via.placeholder.com/150';
                    }
                }
                setProductImages(images);
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
            setProductImages(prev => {
                const newImages = {...prev};
                delete newImages[productId];
                return newImages;
            });
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
            <div className={st.error}>
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className={st.retryButton}
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className={styles.profileCard}>
            <h1 className={styles.cardTitle}>Избранное</h1>
            {favorites.length > 0 ? (
                <div className={styles.products}>
                    {favorites.map(item => (
                        <ProductCard
                            key={item.id}
                            item={item}
                            productImages={productImages}
                            removeFromFavorites={removeFromFavorites}
                            renderStars={renderStars}
                        />
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