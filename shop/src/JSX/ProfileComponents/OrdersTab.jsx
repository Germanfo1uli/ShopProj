import { useState, useEffect } from 'react';
import { apiRequest } from '../Api/ApiRequest.js';
import { useAuth } from '../Hooks/UseAuth';
import styles from '../../CSS/ProfileCSS/OrdersTab.module.css';
import { Link } from "react-router-dom";

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [productImages, setProductImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, userId } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const allOrders = await apiRequest(`/api/orders/${userId}/orders`, {
                    authenticated: isAuthenticated
                }); 
                
                if (!Array.isArray(allOrders)) {
                    throw new Error('Некорректный формат данных заказов');
                }

                // Сортируем заказы по дате создания (новые сначала)
                const sortedOrders = [...allOrders].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                // Нумеруем заказы от 1 до N
                const paidOrders = sortedOrders
                    .filter(order => order?.status === 'Paid')
                    .map((order, index) => ({
                        ...order,
                        displayNumber: index + 1, // Нумерация от 1
                        orderItem: Array.isArray(order.orderItem) ? order.orderItem : []
                    }));
                    
                setOrders(paidOrders);
                const productIds = paidOrders
                    .flatMap(order => order.orderItem.map(item => item.product?.id))
                    .filter(id => id !== undefined);

                if (productIds.length > 0) {
                    const imagesResponse = await apiRequest('/api/productimages');
                    
                    const imagesByProduct = {};
                    imagesResponse.forEach(image => {
                        if (productIds.includes(image.productId)) {
                            if (!imagesByProduct[image.productId]) {
                                imagesByProduct[image.productId] = [];
                            }
                            imagesByProduct[image.productId].push(image);
                        }
                    });
                    setProductImages(imagesByProduct);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setError('Не удалось загрузить данные заказов');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && userId) {
            fetchData();
        }
    }, [isAuthenticated, userId]);

    const getProductImage = (productId) => {
        if (!productImages[productId] || productImages[productId].length === 0) {
            return 'https://via.placeholder.com/100';
        }
        
        const mainImage = productImages[productId].find(img => img.isMain) || 
                          productImages[productId][0];
        
        return mainImage.imageUrl;
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка заказов...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                {error}
                <button 
                    onClick={() => window.location.reload()} 
                    className={styles.retryButton}
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className={styles.ordersContent}>
                <div className={styles.noOrders}>
                    <p>У вас нет оплаченных заказов</p>
                    <a href="/catalog" className={styles.shopLink}>Перейти в каталог</a>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.ordersContent}>
            <div className={styles.ordersHeader}>
                <h2 className={styles.ordersTitle}>Оплаченные заказы</h2>
            </div>

            <div className={styles.ordersList}>
                {orders.map(order => {
                    const itemsCount = order.orderItem?.length || 0;
                    
                    return (
                        <div key={order.id} className={styles.orderItem}>
                            <div className={styles.orderHeader}>
                                <div>
                                    <p className={styles.orderNumber}>Заказ №{order.displayNumber}</p>
                                    <p className={styles.orderDate}>
                                        {formatDate(order.createdAt)} • {itemsCount} товар(а)
                                    </p>
                                </div>
                                <span className={`${styles.statusBadge} ${styles.paid}`}>
                                    {order.status === 'Paid' ? 'Оплачен' : order.status}
                                </span>
                            </div>
                            {itemsCount > 0 && (
                                <div className={styles.orderProducts}>
                                    {order.orderItem.slice(0, 3).map((item, index) => (
                                        <Link
                                            to={`/product/${item.product?.id}`}
                                            key={index}
                                            className={styles.productImage}
                                        >
                                            <img
                                                src={getProductImage(item.product?.id)}
                                                alt={item.product?.name || 'Товар'}
                                                title={item.product?.name}
                                            />
                                        </Link>
                                    ))}
                                    {itemsCount > 3 && (
                                        <div className={styles.moreProducts}>+{itemsCount - 3}</div>
                                    )}
                                </div>
                            )}

                            <div className={styles.orderFooter}>
                                <div className={styles.priceInfo}>
                                    <p className={styles.orderTotal}>
                                        {order.totalAmount?.toLocaleString('ru-RU') || '0'} ₽
                                    </p>
                                    {order.amountWOSale && order.amountWOSale !== order.totalAmount && (
                                        <p className={styles.originalPrice}>
                                            {order.amountWOSale.toLocaleString('ru-RU')} ₽
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdersTab;