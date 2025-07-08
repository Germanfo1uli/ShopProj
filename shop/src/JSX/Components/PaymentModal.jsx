import React, { useState, useEffect } from 'react';
import { FaTimes, FaCreditCard, FaApplePay, FaGooglePay, FaCcPaypal, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import styles from '../../CSS/PaymentModal.module.css';
import MirIconSvg from '../../CSS/image/miricon.svg';
import { apiRequest } from '../Api/ApiRequest';
import { useAuth } from '../Hooks/UseAuth';

const PaymentModal = ({
    isOpen,
    onClose,
    totalAmount,
    orderId,
    handleFastPayment,
    refreshCart
}) => {
    const { userId, isAuthenticated } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    useEffect(() => {
        const fetchSavedCards = async () => {
            if (!isOpen || !isAuthenticated || !userId) return;
            
            setIsLoadingCards(true);
            try {
                const response = await apiRequest(`/api/paymethods/user/${userId}`, {
                    authenticated: isAuthenticated
                });
                setSavedCards(response);
                const defaultCard = response.find(card => card.isDefault);
                if (defaultCard) {
                    setSelectedCard(defaultCard);
                }
            } catch (error) {
                console.error('Ошибка при загрузке карт:', error);
            } finally {
                setIsLoadingCards(false);
            }
        };
        
        fetchSavedCards();
    }, [isOpen, isAuthenticated, userId]);

    const MirIcon = () => (
        <span className={styles.mirIcon}>
            <img src={MirIconSvg} alt="Мир" className={styles.mirIconImage} />
        </span>
    );

    const handlePayment = async () => {
        if (!selectedCard) {
            alert('Пожалуйста, выберите карту для оплаты');
            return;
        }
        
        setIsProcessing(true);

        try {
            const result = await apiRequest('/api/payments/process', {
                method: 'POST',
                body: {
                    UserId: userId,
                    OrderId: orderId,
                    PaymentMethodId: selectedCard.id 
                },
                authenticated: isAuthenticated
            });
            console.log(selectedCard.id)
            if (result && result.PaymentId) {
                console.log('Платеж успешен. ID:', result.PaymentId);
                setIsSuccess(true);
                
                if (refreshCart) {
                    await refreshCart();
                }
                
                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                    setSelectedCard(null);
                }, 3000);
            } else {
                throw new Error('Не удалось обработать платеж');
            }
        } 
        catch (error) {
            console.error('Ошибка платежа:', error);
            alert(`Ошибка оплаты: ${error.message}`);
        } 
        finally {
            setIsProcessing(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className={styles.paymentModalOverlay} data-theme="dark">
            <div className={styles.paymentModal}>
                <button className={styles.paymentModalClose} onClick={onClose}>
                    <FaTimes />
                </button>

                {isSuccess ? (
                    <div className={styles.paymentSuccess}>
                        <FaCheckCircle className={styles.successIcon} />
                        <h3>Оплата прошла успешно!</h3>
                        <p>Спасибо за ваш заказ. Номер вашего заказа: #{orderId}</p>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.paymentModalTitle}>Оплата заказа</h2>
                        <div className={styles.paymentAmount}>
                            К оплате: <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
                        </div>

                        <div className={styles.fastPaymentButtons}>
                            <button
                                className={styles.fastPaymentButton}
                                onClick={() => handlePayment('applepay')}
                                disabled={isProcessing}
                            >
                                <FaApplePay className={styles.fastPaymentIcon} />
                                <span>Apple Pay</span>
                            </button>
                            <button
                                className={styles.fastPaymentButton}
                                onClick={() => handlePayment('googlepay')}
                                disabled={isProcessing}
                            >
                                <FaGooglePay className={styles.fastPaymentIcon} />
                                <span>Google Pay</span>
                            </button>
                            <button
                                className={styles.fastPaymentButton}
                                onClick={() => handlePayment('mirpay')}
                                disabled={isProcessing}
                            >
                                <MirIcon />
                                <span>Мир Pay</span>
                            </button>
                        </div>

                        <div className={styles.paymentSeparator}>
                            <span>или</span>
                        </div>

                        <div className={styles.paymentMethods}>
                            <h3>Выберите способ оплаты</h3>

                            <div className={styles.paymentOptions}>
                                <label className={styles.paymentOption}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className={styles.paymentOptionContent}>
                                        <FaCreditCard className={styles.paymentOptionIcon} />
                                        <span>Банковская карта</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className={styles.cardForm}>
                                {isLoadingCards ? (
                                    <div className={styles.loadingMessage}>Загрузка карт...</div>
                                ) : isAuthenticated && savedCards.length > 0 ? (
                                    <div className={styles.savedCardsContainer}>
                                        <h4 className={styles.savedCardsTitle}>Выберите карту</h4>
                                        <div className={styles.savedCardsList}>
                                            {savedCards.map(card => (
                                                <div
                                                    key={card.id}
                                                    className={`${styles.savedCard} ${selectedCard?.id === card.id ? styles.selected : ''}`}
                                                    onClick={() => setSelectedCard(card)}
                                                >
                                                    <div className={styles.cardLogo}>
                                                        {card.cardBrand === 'visa' && <span>VISA</span>}
                                                        {card.cardBrand === 'mastercard' && <span>MC</span>}
                                                        {!['visa', 'mastercard'].includes(card.cardBrand) && <span>CARD</span>}
                                                    </div>
                                                    <div className={styles.cardInfo}>
                                                        <span className={styles.cardNumber}>•••• •••• •••• {card.cardLastFourDigits}</span>
                                                        <span className={styles.cardExp}>Действ. до {card.expiryMonth}/{card.expiryYear}</span>
                                                    </div>
                                                    {card.isDefault && <span className={styles.cardDefault}>По умолчанию</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : isAuthenticated ? (
                                    <div className={styles.noCardsMessage}>
                                        У вас нет сохраненных карт. Хотите добавить карту?
                                        <button 
                                            className={styles.addCardButton}
                                            onClick={() => {
                                                onClose();
                                            }}
                                        >
                                            Добавить карту
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.authMessage}>
                                        <p>Войдите в систему, чтобы использовать сохраненные карты</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            className={styles.payButton}
                            onClick={handlePayment}
                            disabled={isProcessing || !selectedCard}
                        >
                            {isProcessing ? 'Обработка платежа...' : `Оплатить ${totalAmount.toLocaleString('ru-RU')} ₽`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;


