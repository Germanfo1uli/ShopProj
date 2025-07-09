import React, { useState, useEffect } from 'react';
import { FaTimes, FaCreditCard, FaApplePay, FaGooglePay, FaCheckCircle} from 'react-icons/fa';
import styles from '../../CSS/PaymentModal.module.css';
import MirIconSvg from '../../CSS/image/miricon.svg';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from '../Api/ApiRequest';
import { useAuth } from '../Hooks/UseAuth';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({
    isOpen,
    onClose,
    totalAmount,
    orderId,
    refreshCart
}) => {
    const { userId, isAuthenticated } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isLoadingCards, setIsLoadingCards] = useState(false);

    const navigate = useNavigate();
    
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
                    userId: userId,
                    orderId: orderId,
                    paymentMethodId: selectedCard.id,
                },
                authenticated: true
            });

            if (result) {
                if (result.requiresAction && result.paymentIntentClientSecret) {
                    const stripe = await loadStripe('pk_test_51RiD22QEDYKwRuF49r5tJQ3oVIJyl5yN10Ghmk8FGXXwMpToDO0SEwfoCCcd8tSd3VfP5bDFMMBTffnfhq37SWOP00tZz2jKpP');
                    const { error } = await stripe.confirmCardPayment(
                        result.paymentIntentClientSecret
                    );
                    
                    if (error) {
                        throw error;
                    }
                }
                
                setIsSuccess(true);
                
                if (refreshCart) {
                    await refreshCart();
                }
                
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
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleAddCardClick = () => {
        onClose();
        navigate('/profile');
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
                                    <div className={styles.noCardsContainer}>
                                        <p className={styles.noCardsMessage}>
                                            У вас нет сохраненных карт. Хотите добавить карту?
                                        </p>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => handleAddCardClick()}
                                            disabled={!isAuthenticated}
                                        >
                                            <i className="fas fa-plus"></i> Добавить карту
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


