import React, { useState, useEffect, useCallback } from 'react';
import styles from '../CSS/Cart.module.css';
import Footer from "./Components/Footer";
import sb from "../CSS/Breadcrumbs.module.css";
import { apiRequest } from './Api/ApiRequest';
import { useAuth } from './Hooks/UseAuth';
import LoadingSpinner from './Components/LoadingSpinner';
import AuthModal from './Components/AuthModal';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../JSX/Components/PaymentModal';
import { FaShoppingCart, FaTrashAlt, FaTimes, FaMinus, FaPlus, FaCreditCard, FaGift, FaSignInAlt, FaCheckCircle } from 'react-icons/fa';
import { FaApplePay, FaGooglePay, FaCcPaypal } from 'react-icons/fa';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [productImages, setProductImages] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [error, setError] = useState(null);
    const { userId, isAuthenticated, login } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        success: false,
        message: ''
    });

    const togglePaymentModal = useCallback(() => {
        const newState = !isPaymentModalOpen;
        setIsPaymentModalOpen(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    }, [isPaymentModalOpen]);

    const toggleAuthModal = useCallback(() => {
        const newState = !isAuthModalOpen;
        setIsAuthModalOpen(newState);
        document.body.style.overflow = newState ? 'hidden' : 'auto';
    }, [isAuthModalOpen]);

    const showNotification = useCallback((success, message) => {
        setNotification({
            show: true,
            success,
            message
        });

        setTimeout(() => {
            setNotification({
                show: false,
                success: false,
                message: ''
            });
        }, 5000);
    }, []);

    const handleLoginSuccess = useCallback((token, refreshToken, userId) => {
        login(token, refreshToken, userId);
        setIsAuthModalOpen(false);
        navigate('/profile');
    }, [login, navigate]);

    const handleFastPayment = useCallback((method) => {
        setPaymentMethod(method);
        togglePaymentModal();
    }, [togglePaymentModal]);

    const fetchCart = useCallback(async () => {
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

            if (cartResponse?.orderItem?.length > 0) {
                const productIds = cartResponse.orderItem.map(item => item.product.id);
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
        }
        catch (err) {
            console.error('Error fetching cart:', err);
            setError('Не удалось загрузить данные корзины');
        }
        finally {
            setIsLoading(false);
        }
    }, [userId, isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const getProductImage = (productId) => {
        if (productImages[productId] && productImages[productId].length > 0) {
            const mainImage = productImages[productId].find(img => img.isMain) || productImages[productId][0];
            return mainImage.imageUrl;
        }
        return 'https://via.placeholder.com/300';
    };

    const totalItems = cart?.orderItem?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const subtotal = cart?.amountWOSale || cart?.orderItem?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const discount = cart?.amountWOSale ? (cart.amountWOSale - cart.totalAmount) : 0;
    const total = cart?.totalAmount || 0;

    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
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
            showNotification(false, 'Не удалось обновить количество');
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
            showNotification(false, 'Не удалось удалить товар из корзины');
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
            showNotification(true, 'Корзина успешно очищена');
        } catch (error) {
            console.error('Error clearing cart:', error);
            showNotification(false, 'Не удалось очистить корзину');
        }
    };

    if (isLoading) {
        return <LoadingSpinner message="Загружаем корзину..." status="loading" />;
    }

    if (error) {
        return <LoadingSpinner message={error} status="error" />;
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.body}>
                <div className={styles.authRequired}>
                    <div className={styles.authContent}>
                        <div className={styles.authIcon}>
                            <FaShoppingCart />
                        </div>
                        <h2 className={styles.authTitle}>Корзина недоступна</h2>
                        <p className={styles.authMessage}>Пожалуйста, войдите в систему, чтобы просмотреть корзину</p>
                        <button
                            onClick={toggleAuthModal}
                            className={styles.authButton}
                        >
                            <FaSignInAlt className={styles.authButtonIcon} />
                            Войти в систему
                        </button>
                    </div>
                </div>
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={toggleAuthModal}
                    onLoginSuccess={handleLoginSuccess}
                />
                <Footer />
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
                                                    <img
                                                        src={getProductImage(item.product.id)}
                                                        alt={item.product.name}
                                                        className={styles.productImage}
                                                    />
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
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <FaMinus className={styles.quantityIcon} />
                                                            </button>
                                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                                            <button
                                                                className={styles.quantityButton}
                                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.product.quantityInStock}
                                                                title={item.quantity >= item.product.quantityInStock ? 
                                                                    `Максимальное количество: ${item.product.quantityInStock}` : ''}
                                                            >
                                                                <FaPlus className={styles.quantityIcon} />
                                                            </button>
                                                        </div>

                                                        <div className={styles.priceContainer}>
                                                            {item.product.oldPrice && (
                                                                <span className={styles.oldPrice}>
                                                                    {(item.product.oldPrice * item.quantity).toLocaleString('ru-RU')} ₽
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

                                <button
                                    className={styles.checkoutButton}
                                    onClick={togglePaymentModal}
                                >
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
                                        <button
                                            className={styles.paymentButton}
                                            onClick={() => handleFastPayment('applepay')}
                                        >
                                            <FaApplePay className={styles.paymentIcon} />
                                        </button>
                                        <button
                                            className={styles.paymentButton}
                                            onClick={() => handleFastPayment('googlepay')}
                                        >
                                            <FaGooglePay className={styles.paymentIcon} />
                                        </button>
                                        <button
                                            className={styles.paymentButton}
                                            onClick={() => handleFastPayment('paypal')}
                                        >
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

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={togglePaymentModal}
                totalAmount={total}
                orderId={cart?.id || '0000'}
                refreshCart={fetchCart}
                onPaymentComplete={(success, message) => {
                    showNotification(success, message);
                }}
            />

            {notification.show && (
                <div className={`${styles.notification} ${notification.success ? styles.success : styles.error}`}>
                    <div className={styles.notificationContent}>
                        {notification.success ? (
                            <FaCheckCircle className={styles.notificationIcon} />
                        ) : (
                            <FaTimes className={styles.notificationIcon} />
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}

            <Footer/>
        </div>
    );
};

export default CartPage;