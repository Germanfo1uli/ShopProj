import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from '../Api/ApiRequest';
import { useAuth } from '../Hooks/UseAuth';
import styles from '../../CSS/ProfileCSS/Payments.module.css';

const stripePromise = loadStripe('pk_test_51RiD22QEDYKwRuF49r5tJQ3oVIJyl5yN10Ghmk8FGXXwMpToDO0SEwfoCCcd8tSd3VfP5bDFMMBTffnfhq37SWOP00tZz2jKpP');

const AddCardForm = ({ onSuccess, onCancel, userId  }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: values.cardName
        }
      });

      if (stripeError) throw stripeError;

      const response = await apiRequest('/api/paymethods', {
        method: 'POST',
        body: {
          userId: userId,
          cardLastFourDigits: paymentMethod.card.last4,
          cardBrand: paymentMethod.card.brand,
          expiryMonth: paymentMethod.card.exp_month,
          expiryYear: paymentMethod.card.exp_year,
          paymentProviderToken: paymentMethod.id,
          isDefault: values.isDefault
        },
        authenticated: true
      });

      onSuccess({
        id: response.id,
        lastFour: paymentMethod.card.last4,
        cardName: values.cardName,
        expiryDate: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`,
        isDefault: values.isDefault,
        brand: paymentMethod.card.brand
      });
    } catch (err) {
      setError(err.message);
      console.error('Error adding card:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addCardForm}>
      <Formik
        initialValues={{
          cardName: '',
          isDefault: false,
          userId: userId
        }}
        validationSchema={Yup.object({
          cardName: Yup.string()
            .required('Обязательное поле')
            .matches(/^[A-Za-zА-Яа-я\s]+$/, 'Только буквы и пробелы')
        })}
        
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <h3 className={styles.formTitle}>Добавить новую карту</h3>

            <div className={styles.formGroup}>
              <label>Данные карты</label>
              <div className={styles.cardElementWrapper}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': { color: '#aab7c4' }
                      },
                      invalid: { color: '#9e2146' }
                    }
                  }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <Field type="checkbox" name="isDefault" className={styles.checkboxInput} />
                Сделать картой по умолчанию
              </label>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!stripe || isSubmitting || loading}
                onClick={handleSubmit}
              >
                {loading ? 'Сохранение...' : 'Сохранить карту'}

              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onCancel}
                disabled={loading}
              >
                Отмена
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Payments = () => {
    const [cards, setCards] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const { userId, isAuthenticated } = useAuth();

    useEffect(() => {
      const fetchCards = async () => {
        try {
          const response = await apiRequest(`/api/paymethods/user/${userId}`, {
            authenticated: isAuthenticated
          });
          setCards(response || []);
        } 
        catch (error) {
          console.error('Error fetching cards:', error);
          setCards([]);
        }
      };
      
      if (userId && isAuthenticated) {
        fetchCards();
      } else {
        setCards([]);
      }
    }, [userId, isAuthenticated, showAddForm]);

    const handleAddSuccess = async (newCard) => {
      try {
        const response = await apiRequest(`/api/paymethods/user/${userId}`, {
          authenticated: isAuthenticated
        });
        
        setCards(response);
        setShowAddForm(false);
        
        if (newCard.isDefault) {
          setCards(prevCards => 
            prevCards.map(card => ({
              ...card,
              isDefault: card.id === newCard.id
            }))
          );
        }
      } 
      catch (error) {
        console.error('Error refreshing cards:', error);
        if (newCard.isDefault) {
          setCards(prevCards =>
            prevCards.map(card => ({ ...card, isDefault: false }))
          );
        }
        setCards(prevCards => [...prevCards, newCard]);
        setShowAddForm(false);
      }
  };

    const removeCard = async (id) => {
      try {
        await apiRequest(`/api/paymethods/${id}`, {
          method: 'DELETE',
          authenticated: isAuthenticated
        });
        setCards(prevCards => prevCards.filter(card => card.id !== id));
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    };

    const setDefaultCard = async (id) => {
      try {
        await apiRequest(`/api/paymethods/${id}/default`, {
          method: 'PUT',
          authenticated: isAuthenticated
        });
        
        setCards(prevCards =>
          prevCards.map(card => ({
            ...card,
            isDefault: card.id === id
          }))
        );
      } 
      catch (error) {
        console.error('Error setting default card:', error);
      }
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>Платежные методы</h1>
                <button
                    className={styles.editButton}
                    onClick={() => setShowAddForm(true)}
                    disabled={!isAuthenticated}
                >
                    <i className="fas fa-plus"></i> Добавить карту
                </button>
            </div>

            {showAddForm && (
              <Elements stripe={stripePromise}>
                <AddCardForm 
                    onSuccess={handleAddSuccess}
                    onCancel={() => setShowAddForm(false)}
                    userId={userId} 
                />
              </Elements>
            )}

            {!isAuthenticated ? (
              <div className={styles.emptyState}>
                <p>Войдите в систему для управления платежными методами</p>
              </div>
            ) : cards.length === 0 && !showAddForm ? (
                <div className={styles.emptyState}>
                    <i className="fas fa-credit-card"></i>
                    <p>У вас нет сохраненных платежных методов</p>
                </div>
            ) : (
                <div className={styles.cardsList}>
                    {cards.map(card => (
                        <div key={card.id} className={`${styles.cardItem} ${card.isDefault ? styles.defaultCard : ''}`}>
                            <div className={styles.cardIcon}>
                              {card.cardBrand === 'visa' && <i className="fab fa-cc-visa"></i>}
                              {card.cardBrand === 'mastercard' && <i className="fab fa-cc-mastercard"></i>}
                              {!['visa', 'mastercard'].includes(card.cardBrand) && <i className="far fa-credit-card"></i>}
                            </div>
                            <div className={styles.cardInfo}>
                                <div className={styles.cardNumber}>
                                    •••• •••• •••• {card.cardLastFourDigits}
                                    {card.isDefault && <span className={styles.defaultBadge}>По умолчанию</span>}
                                </div>
                                <div className={styles.cardDetails}>
                                    <span>{card.cardName || 'Карта'}</span>
                                    <span>Срок действия: {card.expiryMonth}/{card.expiryYear}</span>
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