import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../CSS/AuthModal.module.css';
import { apiRequest } from '../Api/ApiRequest.js';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [authError, setAuthError] = useState(null);

    const switchAuthMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    const loginSchema = Yup.object().shape({
        login: Yup.string()
            .required('Обязательное поле')
            .test('is-email-or-phone', 'Введите email или телефон', function(value) {
                const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                const isPhone = /^\+?[0-9]{10,15}$/.test(value);
                return isEmail || isPhone;
            }),
        password: Yup.string()
            .required('Обязательное поле')
            .min(6, 'Пароль должен быть не менее 6 символов'),
    });

    const registerSchema = Yup.object().shape({
        fullName: Yup.string()
            .required('Обязательное поле')
            .min(3, 'Минимум 3 символа'),
        email: Yup.string()
            .email('Некорректный email')
            .required('Обязательное поле'),
        // phone: Yup.string()
        //     .matches(/^\+?[0-9]{10,15}$/, 'Некорректный номер телефона')
        //     .required('Обязательное поле'),
        password: Yup.string()
            .required('Обязательное поле')
            .min(6, 'Пароль должен быть не менее 6 символов'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
            .required('Подтвердите пароль'),
    });

    const handleLoginSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await apiRequest('/api/users/login', {
                method: 'POST',
                body: { Email: values.login, Password: values.password }
            });

            const jwtToken = response.jwtToken || response.token || response?.data?.token;
            const refreshToken = response.refreshToken || response?.data?.refreshToken;
            const userId = response.userId || response?.data?.userId;
            
            localStorage.setItem('authToken', jwtToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);

            // Передаем токены в onLoginSuccess
            await onLoginSuccess(jwtToken, refreshToken, userId);
            onClose();
        } catch (error) {
            setAuthError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (values, { setSubmitting }) => {
    setAuthError(null);
    try {
        const nameParts = values.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts[1] || '';
        const middleName = nameParts.slice(2).join(' ') || '';

        const response = await apiRequest('/api/users/register', {
            method: 'POST',
            body: {
                Email: values.email,
                Password: values.password,
                FirstName: firstName,
                LastName: lastName,
                MiddleName: middleName,
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Ответ сервера при регистрации:', response);
        
        const loginResponse = await apiRequest('/api/users/login', {
            method: 'POST',
            body: {
                Email: values.email,
                Password: values.password
            }
        });
        

        localStorage.setItem('authToken', loginResponse.jwtToken);
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
        localStorage.setItem('userId', loginResponse.userId);

        onLoginSuccess(
            loginResponse.jwtToken, 
            loginResponse.refreshToken,
            loginResponse.userId
        );
        onClose();
    } 
    
    catch (error) {
        console.error('Полная ошибка регистрации:', error);
        setAuthError(
            error.status === 400 
                ? 'Пользователь с таким email уже существует' 
                : 'Ошибка сервера. Попробуйте позже.'
        );
    } 
    
    finally {
        setSubmitting(false);
    }
    };


    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2"/>
                    </svg>
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>{isLoginMode ? 'Вход в аккаунт' : 'Регистрация'}</h2>
                    <p className={styles.subtitle}>{isLoginMode ? 'Введите свои данные для входа' : 'Создайте новый аккаунт'}</p>
                </div>

                {isLoginMode ? (
                    <Formik
                        initialValues={{ login: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={handleLoginSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="login" className={styles.label}>Email или телефон</label>
                                    <Field
                                        type="text"
                                        name="login"
                                        id="login"
                                        placeholder="example@mail.com"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="login" component="div" className={styles.error} />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="password" className={styles.label}>Пароль</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`${styles.button} ${isSubmitting ? styles.buttonLoading : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className={styles.spinner}></span>
                                    ) : 'Войти'}
                                </button>

                                <div className={styles.switchText}>
                                    Нет аккаунта?{' '}
                                    <button type="button" onClick={switchAuthMode} className={styles.switchButton}>
                                        Зарегистрироваться
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <Formik
                        initialValues={{
                            fullName: '',
                            email: '',
                            phone: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={registerSchema}
                        onSubmit={handleRegisterSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="fullName" className={styles.label}>ФИО</label>
                                    <Field
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        placeholder="Иванов Иван Иванович"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="fullName" component="div" className={styles.error} />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="example@mail.com"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="email" component="div" className={styles.error} />
                                </div>

                                {/* <div className={styles.inputGroup}>
                                    <label htmlFor="phone" className={styles.label}>Телефон</label>
                                    <Field
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        placeholder="+7 (999) 123-45-67"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="phone" component="div" className={styles.error} />
                                </div> */}

                                <div className={styles.inputGroup}>
                                    <label htmlFor="password" className={styles.label}>Пароль</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error} />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="confirmPassword" className={styles.label}>Подтвердите пароль</label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="••••••"
                                        className={styles.input}
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`${styles.button} ${isSubmitting ? styles.buttonLoading : ''}`}
                                >
                                    {isSubmitting ? (
                                        <span className={styles.spinner}></span>
                                    ) : 'Зарегистрироваться'}
                                </button>

                                <div className={styles.switchText}>
                                    Уже есть аккаунт?{' '}
                                    <button type="button" onClick={switchAuthMode} className={styles.switchButton}>
                                        Войти
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
                <div className={styles.floatingCircle}></div>
            </div>
        </div>
    );
};

export default AuthModal;