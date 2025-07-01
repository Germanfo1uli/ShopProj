import React, { useState } from 'react';
import styles from '../CSS/Cart.module.css';
import Footer from "./Components/Footer";
import sb from "../CSS/Breadcrumbs.module.css";

import { FaShoppingCart, FaTrashAlt, FaTimes, FaMinus, FaPlus, FaCreditCard, FaGift } from 'react-icons/fa';
import { FaApplePay, FaGooglePay, FaCcPaypal } from 'react-icons/fa';

const CartPage = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Платье ля гуча',
            description: 'Высота: 30 см',
            price: 1490,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 2,
            name: 'Потная футболка Никиты',
            description: 'Размер: 100x140 см',
            price: 1489,
            originalPrice: 3580,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 3,
            name: 'Темп Нэйм а чё',
            description: 'Цвет: голубой',
            price: 890,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1594462232436-f8b2bba5a3b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        }
    ]);

    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
    const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const discount = 590;
    const total = subtotal - discount;

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: newQuantity } : product
        ));
    };

    const removeProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const clearCart = () => {
        setProducts([]);
    };

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
                                <button
                                    className={styles.clearCartButton}
                                    onClick={clearCart}
                                >
                                    <FaTrashAlt className={styles.trashIcon} />
                                    Очистить корзину
                                </button>
                            </div>

                            {/* Список товаров */}
                            <div className={styles.productsList}>
                                {products.map(product => (
                                    <div key={product.id} className={styles.productCard}>
                                        <div className={styles.productContent}>
                                            {/* Изображение */}
                                            <div className={styles.productImageContainer}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className={styles.productImage}
                                                />
                                            </div>

                                            {/* Информация */}
                                            <div className={styles.productInfo}>
                                                <div className={styles.productHeader}>
                                                    <div>
                                                        <h3 className={styles.productName}>{product.name}</h3>
                                                        <p className={styles.productDescription}>{product.description}</p>
                                                    </div>
                                                    <button
                                                        className={styles.removeButton}
                                                        onClick={() => removeProduct(product.id)}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>

                                                <div className={styles.productControls}>
                                                    {/* Количество */}
                                                    <div className={styles.quantityControl}>
                                                        <button
                                                            className={styles.quantityButton}
                                                            onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                                                        >
                                                            <FaMinus className={styles.quantityIcon} />
                                                        </button>
                                                        <span className={styles.quantityValue}>{product.quantity}</span>
                                                        <button
                                                            className={styles.quantityButton}
                                                            onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                                                        >
                                                            <FaPlus className={styles.quantityIcon} />
                                                        </button>
                                                    </div>

                                                    {/* Цена */}
                                                    <div className={styles.priceContainer}>
                                                        {product.originalPrice && (
                                                            <p className={styles.originalPrice}>{product.originalPrice} ₽</p>
                                                        )}
                                                        <p className={styles.price}>{product.price} ₽</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Купон */}
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
                        </div>
                    </div>

                    {/* Итоги */}
                    <div className={styles.summaryColumn}>
                        <div className={styles.summaryContainer}>
                            <h2 className={styles.summaryTitle}>Итоги заказа</h2>

                            <div className={styles.summaryDetails}>
                                <div className={styles.summaryRow}>
                                    <span>Товары ({totalItems})</span>
                                    <span className={styles.summaryValue}>{subtotal} ₽</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Скидка</span>
                                    <span className={styles.discountValue}>-{discount} ₽</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Доставка</span>
                                    <span className={styles.freeValue}>Бесплатно</span>
                                </div>
                            </div>

                            <div className={styles.totalContainer}>
                                <div className={styles.totalRow}>
                                    <span className={styles.totalLabel}>К оплате</span>
                                    <span className={styles.totalValue}>{total} ₽</span>
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
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default CartPage;