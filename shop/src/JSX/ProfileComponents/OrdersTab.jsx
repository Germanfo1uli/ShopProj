import styles from '../../CSS/ProfileCSS/OrdersTab.module.css';

const OrdersTab = () => {
    return (
        <div className={styles.ordersContent}>
            <div className={styles.ordersHeader}>
                <h2 className={styles.ordersTitle}>Последние заказы</h2>
                <a href="#" className={styles.allOrdersLink}>Все заказы →</a>
            </div>

            <div className={styles.ordersList}>
                <div className={styles.orderItem}>
                    <div className={styles.orderHeader}>
                        <div>
                            <p className={styles.orderNumber}>Заказ #32456</p>
                            <p className={styles.orderDate}>15 февраля 2023 • 3 товара</p>
                        </div>
                        <span className={`${styles.statusBadge} ${styles.delivered}`}>Доставлен</span>
                    </div>

                    <div className={styles.orderProducts}>
                        <div className={styles.productImage}>
                            <img
                                src="https://m.media-amazon.com/images/I/71h6PpGaz9L._AC_UL320_.jpg"
                                alt="Product"
                            />
                        </div>
                        <div className={styles.productImage}>
                            <img
                                src="https://m.media-amazon.com/images/I/71Kc2oLYRFL._AC_UL320_.jpg"
                                alt="Product"
                            />
                        </div>
                        <div className={styles.productImage}>
                            <img
                                src="https://m.media-amazon.com/images/I/71xBS8kJ0jL._AC_UL320_.jpg"
                                alt="Product"
                            />
                        </div>
                    </div>

                    <div className={styles.orderFooter}>
                        <p className={styles.orderTotal}>12,490 ₽</p>
                        <div className={styles.orderActions}>
                            <button className={styles.actionButton}>Повторить заказ</button>
                            <button className={styles.actionButton}>Оставить отзыв</button>
                        </div>
                    </div>
                </div>
                <div className={styles.orderItem}>
                    <div className={styles.orderHeader}>
                        <div>
                            <p className={styles.orderNumber}>Заказ #32189</p>
                            <p className={styles.orderDate}>10 февраля 2023 • 2 товара</p>
                        </div>
                        <span className={`${styles.statusBadge} ${styles.inDelivery}`}>В пути</span>
                    </div>

                    <div className={styles.orderProducts}>
                        <div className={styles.productImage}>
                            <img
                                src="https://m.media-amazon.com/images/I/61L1ItFgFHL._AC_UL320_.jpg"
                                alt="Product"
                            />
                        </div>
                        <div className={styles.productImage}>
                            <img
                                src="https://m.media-amazon.com/images/I/71Q8gm97H6L._AC_UL320_.jpg"
                                alt="Product"
                            />
                        </div>
                    </div>

                    <div className={styles.orderFooter}>
                        <p className={styles.orderTotal}>8,750 ₽</p>
                        <div className={styles.orderActions}>
                            <button className={styles.actionButton}>Отследить</button>
                            <button className={styles.actionButton}>Подробнее</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersTab;