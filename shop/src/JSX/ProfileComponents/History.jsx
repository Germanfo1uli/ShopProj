import { useState, useEffect } from 'react';
import styles from '../../CSS/ProfileCSS/History.module.css';
import { FaClock } from 'react-icons/fa';
import { useAuth } from '../Hooks/UseAuth.js';
import { apiRequest } from '../Api/ApiRequest.js';
import ProductCard from '../Components/HistoryCard';
import st from "../../CSS/LoadingSpinner.module.css";

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
                    <div className={styles.loadingState}>Загрузка...</div>
                </div>
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
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>История просмотров</h1>
            </div>
            {history.length > 0 ? (
                <div className={styles.products}>
                    {history.map(item => (
                        <ProductCard
                            key={`${item.productId}-${item.viewedAt}`}
                            item={item}
                            productImages={productImages}
                        />
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