import React, { useState } from 'react';
import { FaTimes, FaCreditCard, FaApplePay, FaGooglePay, FaCcPaypal, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import styles from '../../CSS/PaymentModal.module.css';
import MirIconSvg from 'C:/Users/user/Desktop/ShopProj/shop/src/CSS/image/miricon.svg';

const PaymentModal = ({
                          isOpen,
                          onClose,
                          totalAmount,
                          orderId,
                          handleFastPayment
                      }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showSavedCards, setShowSavedCards] = useState(false);

    const [savedCards] = useState([
        { id: 1, last4: '4242', brand: 'Visa', exp: '12/25', isDefault: true },
        { id: 2, last4: '5555', brand: 'Mastercard', exp: '06/24', isDefault: false },
    ]);

    const MirIcon = () => (
        <span className={styles.mirIcon}>
        <img
            src={MirIconSvg}
            alt="Мир"
            className={styles.mirIconImage}
        />
    </span>
    );

    const [selectedCard, setSelectedCard] = useState(null);

    const handlePayment = async (method = null) => {
        setIsProcessing(true);
        const paymentType = method || paymentMethod;

        console.log(`Processing ${paymentType} payment...`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
            onClose();
            setIsSuccess(false);
        }, 3000);
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
                                onClick={() => handleFastPayment('applepay')}
                                disabled={isProcessing}
                            >
                                <FaApplePay className={styles.fastPaymentIcon} />
                                <span>Apple Pay</span>
                            </button>
                            <button
                                className={styles.fastPaymentButton}
                                onClick={() => handleFastPayment('googlepay')}
                                disabled={isProcessing}
                            >
                                <FaGooglePay className={styles.fastPaymentIcon} />
                                <span>Google Pay</span>
                            </button>
                            <button
                                className={styles.fastPaymentButton}
                                onClick={() => handleFastPayment('mirpay')}
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
                                {savedCards.length > 0 && (
                                    <div className={styles.savedCardsContainer}>
                                        <button
                                            className={styles.savedCardsToggle}
                                            onClick={() => setShowSavedCards(!showSavedCards)}
                                        >
                                            <span>Сохранённые карты</span>
                                            <FaChevronDown className={`${styles.chevron} ${showSavedCards ? styles.rotated : ''}`} />
                                        </button>

                                        {showSavedCards && (
                                            <div className={styles.savedCardsList}>
                                                {savedCards.map(card => (
                                                    <div
                                                        key={card.id}
                                                        className={`${styles.savedCard} ${selectedCard?.id === card.id ? styles.selected : ''}`}
                                                        onClick={() => setSelectedCard(card)}
                                                    >
                                                        <div className={styles.cardLogo}>{card.brand === 'Visa' ? 'VISA' : 'MC'}</div>
                                                        <div className={styles.cardInfo}>
                                                            <span className={styles.cardNumber}>•••• •••• •••• {card.last4}</span>
                                                            <span className={styles.cardExp}>Действ. до {card.exp}</span>
                                                        </div>
                                                        {card.isDefault && <span className={styles.cardDefault}>По умолчанию</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(!selectedCard || !showSavedCards) && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <label>Номер карты</label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                className={styles.cardInput2}
                                            />
                                        </div>

                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Срок действия</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className={styles.cardInput}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label>CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    className={styles.cardInput}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label>Имя владельца карты</label>
                                            <input
                                                type="text"
                                                placeholder="IVAN IVANOV"
                                                className={styles.cardInput2}
                                            />
                                        </div>

                                        <div className={styles.saveCardOption}>
                                            <input type="checkbox" id="saveCard" />
                                            <label htmlFor="saveCard">Сохранить карту для будущих платежей</label>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            className={styles.payButton}
                            onClick={() => handlePayment()}
                            disabled={isProcessing}
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