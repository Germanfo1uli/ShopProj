import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../CSS/Profile.module.css';

const Payments = () => {
    const [cards, setCards] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const initialValues = {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        isDefault: false
    };

    const validationSchema = Yup.object({
        cardNumber: Yup.string()
            .required('Обязательное поле')
            .matches(/^[0-9]{16}$/, 'Номер карты должен содержать 16 цифр'),
        cardName: Yup.string()
            .required('Обязательное поле')
            .matches(/^[A-Za-zА-Яа-я\s]+$/, 'Только буквы и пробелы'),
        expiryDate: Yup.string()
            .required('Обязательное поле')
            .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Формат MM/YY'),
        cvv: Yup.string()
            .required('Обязательное поле')
            .matches(/^[0-9]{3,4}$/, 'CVV должен содержать 3 или 4 цифры'),
    });

    const handleSubmit = (values, { resetForm }) => {
        const newCard = {
            id: Date.now(),
            lastFour: values.cardNumber.slice(-4),
            cardName: values.cardName,
            expiryDate: values.expiryDate,
            isDefault: values.isDefault
        };

        if (values.isDefault) {
            setCards(prevCards =>
                prevCards.map(card => ({ ...card, isDefault: false }))
            );
        }

        setCards(prevCards => [...prevCards, newCard]);
        resetForm();
        setShowAddForm(false);
    };

    const removeCard = (id) => {
        setCards(prevCards => prevCards.filter(card => card.id !== id));
    };

    const setDefaultCard = (id) => {
        setCards(prevCards =>
            prevCards.map(card => ({
                ...card,
                isDefault: card.id === id
            }))
        );
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>Платежные методы</h1>
                <button
                    className={styles.editButton}
                    onClick={() => setShowAddForm(true)}
                >
                    <i className="fas fa-plus"></i> Добавить карту
                </button>
            </div>

            {showAddForm && (
                <div className={styles.addCardForm}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <h3 className={styles.formTitle}>Добавить новую карту</h3>

                                <div className={styles.formGroup}>
                                    <label htmlFor="cardNumber">Номер карты</label>
                                    <Field
                                        type="text"
                                        name="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        className={styles.formInput}
                                    />
                                    <ErrorMessage name="cardNumber" component="div" className={styles.errorMessage} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="cardName">Имя на карте</label>
                                    <Field
                                        type="text"
                                        name="cardName"
                                        placeholder="IVAN IVANOV"
                                        className={styles.formInput}
                                    />
                                    <ErrorMessage name="cardName" component="div" className={styles.errorMessage} />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="expiryDate">Срок действия</label>
                                        <Field
                                            type="text"
                                            name="expiryDate"
                                            placeholder="MM/YY"
                                            className={styles.formInput}
                                        />
                                        <ErrorMessage name="expiryDate" component="div" className={styles.errorMessage} />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="cvv">CVV</label>
                                        <Field
                                            type="text"
                                            name="cvv"
                                            placeholder="123"
                                            className={styles.formInput}
                                        />
                                        <ErrorMessage name="cvv" component="div" className={styles.errorMessage} />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.checkboxLabel}>
                                        <Field type="checkbox" name="isDefault" className={styles.checkboxInput} />
                                        Сделать картой по умолчанию
                                    </label>
                                </div>

                                <div className={styles.formActions}>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={isSubmitting}
                                    >
                                        Сохранить карту
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {cards.length === 0 && !showAddForm ? (
                <div className={styles.emptyState}>
                    <i className="fas fa-credit-card"></i>
                    <p>У вас нет сохраненных платежных методов</p>
                </div>
            ) : (
                <div className={styles.cardsList}>
                    {cards.map(card => (
                        <div key={card.id} className={`${styles.cardItem} ${card.isDefault ? styles.defaultCard : ''}`}>
                            <div className={styles.cardIcon}>
                                <i className="far fa-credit-card"></i>
                            </div>
                            <div className={styles.cardInfo}>
                                <div className={styles.cardNumber}>
                                    •••• •••• •••• {card.lastFour}
                                    {card.isDefault && <span className={styles.defaultBadge}>По умолчанию</span>}
                                </div>
                                <div className={styles.cardDetails}>
                                    <span>{card.cardName}</span>
                                    <span>Срок действия: {card.expiryDate}</span>
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                {!card.isDefault && (
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => setDefaultCard(card.id)}
                                    >
                                        Сделать основной
                                    </button>
                                )}
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => removeCard(card.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Payments;