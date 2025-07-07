import React, { useState, useEffect } from 'react';
import styles from '../CSS/Cart.module.css';
import Footer from "./Components/Footer";
import sb from "../CSS/Breadcrumbs.module.css";
import { apiRequest } from './Api/ApiRequest';
import { useAuth } from './Hooks/UseAuth';

import { FaShoppingCart, FaTrashAlt, FaTimes, FaMinus, FaPlus, FaCreditCard, FaGift } from 'react-icons/fa';
import { FaApplePay, FaGooglePay, FaCcPaypal } from 'react-icons/fa';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchCart = async () => {
            if (!isAuthenticated || !userId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const cartResponse = await apiRequest(`/api/orders/${userId}/cart`, {
                    authenticated: isAuthenticated
                });
                
                setCart(cartResponse);
                
            } catch (err) {
                console.error('Error fetching cart:', err);
                setError('Не удалось загрузить данные корзины');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [userId, isAuthenticated]);

    const totalItems = cart?.orderItem?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const subtotal = cart?.amountWOSale || cart?.orderItem?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const discount = cart ? (cart.amountWOSale - cart.totalAmount) : 0;
    const total = cart?.totalAmount || 0;

    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await apiRequest(`/api/orderitems/${id}`, {
                method: 'PUT',
                body: { 
                    quantity: newQuantity 
                },
                authenticated: isAuthenticated
            });
            
            setCart(prev => {
                const updatedItems = prev.orderItem.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                );
                
                const newTotal = updatedItems.reduce((sum, item) => 
                    sum + (item.product.price * item.quantity), 0);
                
                const newAmountWOSale = updatedItems.reduce((sum, item) => 
                    sum + (item.product.oldPrice * item.quantity), 0);
                
                return {
                    ...prev,
                    orderItem: updatedItems,
                    totalAmount: newTotal,
                    amountWOSale: newAmountWOSale
                };
            });
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
            
            setCart(prev => {
                const newOrderItems = prev.orderItem.filter(item => item.id !== id);
                return {
                    ...prev,
                    orderItem: newOrderItems,
                    totalAmount: newOrderItems.reduce((sum, item) => 
                        sum + (item.product.price * item.quantity), 0),
                    amountWOSale: newOrderItems.reduce((sum, item) => 
                        sum + (item.product.oldPrice * item.quantity), 0)
                };
            });
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Не удалось удалить товар из корзины');
        }
    };

    const clearCart = async () => {
        if (!cart?.orderItem?.length) return;
        
        try {
            await Promise.all(
                cart.orderItem.map(item => 
                    apiRequest(`/api/orderitems/${item.id}`, {
                        method: 'DELETE',
                        authenticated: isAuthenticated
                    })
                )
            );
            
            setCart(prev => ({ 
                ...prev, 
                orderItem: [],
                totalAmount: 0,
                amountWOSale: 0
            }));
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
                    <div className={styles.productsColumn}>
                        <div className={styles.productsContainer}>
                            <div className={styles.productsHeader}>
                                <h2 className={styles.productsTitle}>{totalItems} товара в корзине</h2>
                                {cart?.orderItem?.length > 0 && (
                                    <button
                                        className={styles.clearCartButton}
                                        onClick={clearCart}
                                    >
                                        <FaTrashAlt className={styles.trashIcon} />
                                        Очистить корзину
                                    </button>
                                )}
                            </div>

                            <div className={styles.productsList}>
                                {cart?.orderItem?.length > 0 ? (
                                    cart.orderItem.map(item => (
                                        <div key={item.id} className={styles.productCard}>
                                            <div className={styles.productContent}>
                                                <div className={styles.productImageContainer}>
                                                    {item.product?.productImage?.length > 0 && (
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}${item.product.productImage[0].url}`}
                                                            alt={item.product.name}
                                                            className={styles.productImage}
                                                        />
                                                    )}
                                                </div>

                                                <div className={styles.productInfo}>
                                                    <div className={styles.productHeader}>
                                                        <div>
                                                            <h3 className={styles.productName}>{item.product?.name || 'Товар'}</h3>
                                                            {item.product?.description && (
                                                                <p className={styles.productDescription}>
                                                                    {item.product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            className={styles.removeButton}
                                                            onClick={() => removeProduct(item.id)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>

                                                    <div className={styles.productControls}>
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

                                                        <div className={styles.priceContainer}>
                                                            {item.product.oldPrice && (
                                                                <span className={styles.oldPrice}>
                            {item.product.oldPrice.toLocaleString('ru-RU')} ₽
                        </span>
                                                            )}
                                                            <p className={styles.price}>
                                                                {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
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

                            {cart?.orderItem?.length > 0 && (
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

                    {cart?.orderItem?.length > 0 && (
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