import React, { useState, useEffect } from 'react';
import styles from '../CSS/Cart.module.css';
import Footer from "./Components/Footer";
import sb from "../CSS/Breadcrumbs.module.css";
import { apiRequest } from './Api/ApiRequest';
import { useAuth } from './Hooks/UseAuth';

import { FaShoppingCart, FaTrashAlt, FaTimes, FaMinus, FaPlus, FaCreditCard, FaGift } from 'react-icons/fa';
import { FaApplePay, FaGooglePay, FaCcPaypal } from 'react-icons/fa';

const CartPage = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, isAuthenticated } = useAuth();

    useEffect(() => {
    const fetchOrderItems = async () => {
        if (!isAuthenticated || !userId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const cartOrder = await apiRequest(`/api/orders/${userId}/cart`, {
                authenticated: isAuthenticated
            });
            
            console.log('Cart order:', cartOrder);

            if (cartOrder && cartOrder.id) {
                const items = await apiRequest(`/api/orders/${cartOrder.id}/orders`, {
                    authenticated: isAuthenticated
                });
                
                console.log('Order items:', items);
                setOrderItems(Array.isArray(items) ? items : []);
            } else {
                setOrderItems([]);
            }
        } catch (err) {
            console.error('Error fetching order items:', err);
            setError('Не удалось загрузить данные корзины');
        } finally {
            setIsLoading(false);
        }
    };

    fetchOrderItems();
}, [userId, isAuthenticated]);
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discount = 590; 
    const total = subtotal - discount;

    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await apiRequest(`/api/orderitems/${id}`, {
                method: 'PUT',
                body: { quantity: newQuantity },
                authenticated: isAuthenticated
            });
            
            setOrderItems(orderItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Не удалось обновить количество');
        }
    };

    const removeProduct = async (id) => {
        try {
            await apiRequest(`/api/orderitems/${id}`, {
                method: 'DELETE',
                authenticated: isAuthenticated
            });
            
            setOrderItems(orderItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Не удалось удалить товар из корзины');
        }
    };

    const clearCart = async () => {
        try {
            await Promise.all(
                orderItems.map(item => 
                    apiRequest(`/api/orderitems/${item.id}`, {
                        method: 'DELETE',
                        authenticated: isAuthenticated
                    })
                )
            );
            
            setOrderItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Не удалось очистить корзину');
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка корзины...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.error}>
                Пожалуйста, войдите в систему, чтобы просмотреть корзину
            </div>
        );
    }

    return (
        <div className={styles.body}>
            <main className={styles.main}>
                {/* Хлебные крошки */}
                <nav className={sb.breadcrumbs}>
                    <a href="/home" className={sb.breadcrumbLink}>Главная</a>
                    <span className={sb.breadcrumbSeparator}>/</span>
                    <span className={sb.breadcrumbActive}>Корзина</span>
                </nav>

                <h1 className={styles.pageTitle}>
                    <FaShoppingCart className={styles.cartTitleIcon} />
                    Ваша корзина
                </h1>

                <div className={styles.contentWrapper}>
                    {/* Список товаров */}
                    <div className={styles.productsColumn}>
                        <div className={styles.productsContainer}>
                            {/* Заголовок */}
                            <div className={styles.productsHeader}>
                                <h2 className={styles.productsTitle}>{totalItems} товара в корзине</h2>
                                {orderItems.length > 0 && (
                                    <button
                                        className={styles.clearCartButton}
                                        onClick={clearCart}
                                    >
                                        <FaTrashAlt className={styles.trashIcon} />
                                        Очистить корзину
                                    </button>
                                )}
                            </div>

                            {/* Список товаров */}
                            <div className={styles.productsList}>
                                {orderItems.length > 0 ? (
                                    orderItems.map(item => (
                                        <div key={item.id} className={styles.productCard}>
                                            <div className={styles.productContent}>
                                                {/* Изображение */}
                                                <div className={styles.productImageContainer}>
                                                    {item.product?.mainImage && (
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}${item.product.mainImage.url}`}
                                                            alt={item.product.name}
                                                            className={styles.productImage}
                                                        />
                                                    )}
                                                </div>

                                                {/* Информация */}
                                                <div className={styles.productInfo}>
                                                    <div className={styles.productHeader}>
                                                        <div>
                                                            <h3 className={styles.productName}>{item.product?.name || 'Товар'}</h3>
                                                            <p className={styles.productDescription}>
                                                                Цена за единицу: {item.unitPrice.toLocaleString('ru-RU')} ₽
                                                            </p>
                                                        </div>
                                                        <button
                                                            className={styles.removeButton}
                                                            onClick={() => removeProduct(item.id)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>

                                                    <div className={styles.productControls}>
                                                        {/* Количество */}
                                                        <div className={styles.quantityControl}>
                                                            <button
                                                                className={styles.quantityButton}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            >
                                                                <FaMinus className={styles.quantityIcon} />
                                                            </button>
                                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                                            <button
                                                                className={styles.quantityButton}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            >
                                                                <FaPlus className={styles.quantityIcon} />
                                                            </button>
                                                        </div>

                                                        {/* Цена */}
                                                        <div className={styles.priceContainer}>
                                                            <p className={styles.price}>
                                                                {(item.unitPrice * item.quantity).toLocaleString('ru-RU')} ₽
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.emptyCart}>
                                        <p>Ваша корзина пуста</p>
                                    </div>
                                )}
                            </div>

                            {/* Купон */}
                            {orderItems.length > 0 && (
                                <div className={styles.couponContainer}>
                                    <h3 className={styles.couponTitle}>Добавить купон</h3>
                                    <div className={styles.couponInputGroup}>
                                        <input
                                            type="text"
                                            placeholder="Код купона"
                                            className={styles.couponInput}
                                        />
                                        <button className={styles.couponButton}>
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Итоги */}
                    {orderItems.length > 0 && (
                        <div className={styles.summaryColumn}>
                            <div className={styles.summaryContainer}>
                                <h2 className={styles.summaryTitle}>Итоги заказа</h2>

                                <div className={styles.summaryDetails}>
                                    <div className={styles.summaryRow}>
                                        <span>Товары ({totalItems})</span>
                                        <span className={styles.summaryValue}>{subtotal.toLocaleString('ru-RU')} ₽</span>
                                    </div>

                                    <div className={styles.summaryRow}>
                                        <span>Скидка</span>
                                        <span className={styles.discountValue}>-{discount.toLocaleString('ru-RU')} ₽</span>
                                    </div>

                                    <div className={styles.summaryRow}>
                                        <span>Доставка</span>
                                        <span className={styles.freeValue}>Бесплатно</span>
                                    </div>
                                </div>

                                <div className={styles.totalContainer}>
                                    <div className={styles.totalRow}>
                                        <span className={styles.totalLabel}>К оплате</span>
                                        <span className={styles.totalValue}>{total.toLocaleString('ru-RU')} ₽</span>
                                    </div>
                                </div>

                                <button className={styles.checkoutButton}>
                                    <FaCreditCard className={styles.checkoutIcon} />
                                    Перейти к оплате
                                </button>

                                <div className={styles.termsContainer}>
                                    <p className={styles.termsText}>
                                        Нажимая на кнопку, вы соглашаетесь с <a href="#" className={styles.termsLink}>Условиями обработки данных</a>
                                    </p>
                                </div>

                                {/* Дополнительные способы оплаты */}
                                <div className={styles.paymentMethods}>
                                    <h3 className={styles.paymentMethodsTitle}>Или продолжите с</h3>
                                    <div className={styles.paymentButtons}>
                                        <button className={styles.paymentButton}>
                                            <FaApplePay className={styles.paymentIcon} />
                                        </button>
                                        <button className={styles.paymentButton}>
                                            <FaGooglePay className={styles.paymentIcon} />
                                        </button>
                                        <button className={styles.paymentButton}>
                                            <FaCcPaypal className={styles.paymentIcon} />
                                        </button>
                                    </div>
                                </div>

                                {/* Дополнительные призывы */}
                                <div className={styles.promoContainer}>
                                    <div className={styles.promoContent}>
                                        <FaGift className={styles.promoIcon} />
                                        <p className={styles.promoText}>
                                            Добавьте еще товаров на 1 220 ₽ для бесплатной подарочной упаковки
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default CartPage;