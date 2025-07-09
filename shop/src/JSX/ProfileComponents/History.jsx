import { useState, useEffect } from 'react';
import styles from '../../CSS/ProfileCSS/History.module.css';
import { FaSearch, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../Hooks/UseAuth.js';
import { apiRequest } from '../Api/ApiRequest.js';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, isAuthenticated } = useAuth();
    const [productImages, setProductImages] = useState({});

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (!userId || !isAuthenticated) return;

                setLoading(true);
                const response = await apiRequest(`/api/productviewshistory/user/${userId}`, {
                    authenticated: isAuthenticated
                });
                setHistory(response?.slice(0, 10) || []);

                const images = {};
                const itemsToProcess = response?.slice(0, 10) || [];
                for (const item of itemsToProcess) {
                    try {
                        const imageResponse = await apiRequest(`/api/products/${item.productId}/main`);
                        images[item.productId] = imageResponse?.imageUrl || 'https://via.placeholder.com/300';
                    } catch (err) {
                        console.error(`Error fetching image for product ${item.productId}:`, err);
                        images[item.productId] = 'https://via.placeholder.com/300';
                    }
                }
                setProductImages(images);
            } catch (err) {
                setError(err.message || 'Failed to fetch view history');
                console.error('Error fetching view history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId, isAuthenticated]);

    if (loading) {
        return (
            <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                    <h1 className={styles.cardTitle}>История просмотров</h1>
                </div>
                <div className={styles.loadingState}>Загрузка...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                    <h1 className={styles.cardTitle}>История просмотров</h1>
                </div>
                <div className={styles.errorState}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>История просмотров</h1>
            </div>
            {history.length > 0 ? (
                <div className={styles.products}>
                    {history.map(item => (
                        <div key={`${item.productId}-${item.viewedAt}`} className={styles.productCard}>
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
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FaClock className={styles.emptyClockIcon} />
                    <p>Ваша история просмотров пуста</p>
                </div>
            )}
        </div>
    );
};

export default History;