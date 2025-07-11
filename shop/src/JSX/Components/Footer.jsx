import React from 'react';
import stylesfooter from "../../CSS/footer.module.css";

const Footer = () => {
    return (
        <footer className={stylesfooter.footer}>
            <div className={stylesfooter.footerTop}>
                <div className={stylesfooter.footerColumn}>
                    <h3 className={stylesfooter.footerTitle}>О компании</h3>
                    <ul className={stylesfooter.footerList}>
                        <li><a href="#">О нас</a></li>
                        <li><a href="#">Реквизиты</a></li>
                        <li><a href="#">Вакансии</a></li>
                        <li><a href="#">Контакты</a></li>
                        <li><a href="#">Партнерам</a></li>
                    </ul>
                </div>

                <div className={stylesfooter.footerColumn}>
                    <h3 className={stylesfooter.footerTitle}>Покупателям</h3>
                    <ul className={stylesfooter.footerList}>
                        <li><a href="#">Как сделать заказ</a></li>
                        <li><a href="#">Доставка</a></li>
                        <li><a href="#">Оплата</a></li>
                        <li><a href="#">Возврат</a></li>
                        <li><a href="#">Помощь</a></li>
                    </ul>
                </div>

                <div className={stylesfooter.footerColumn}>
                    <h3 className={stylesfooter.footerTitle}>Каталог</h3>
                    <ul className={stylesfooter.footerList}>
                        <li><a href="#">Смартфоны</a></li>
                        <li><a href="#">Ноутбуки</a></li>
                        <li><a href="#">Телевизоры</a></li>
                        <li><a href="#">Аксессуары</a></li>
                        <li><a href="#">Бытовая техника</a></li>
                    </ul>
                </div>

                <div className={stylesfooter.footerColumn}>
                    <h3 className={stylesfooter.footerTitle}>Контакты</h3>
                    <ul className={stylesfooter.footerList}>
                        <li className={stylesfooter.contactItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            <span>8 (800) 123-45-67</span>
                        </li>
                        <li className={stylesfooter.contactItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <path d="M22 6l-10 7L2 6"/>
                            </svg>
                            <span>info@example.com</span>
                        </li>
                        <li className={stylesfooter.contactItem}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>г. Москва, ул. Примерная, 123</span>
                        </li>
                    </ul>
                </div>

                <div className={stylesfooter.footerColumn}>
                    <h3 className={stylesfooter.footerTitle}>Мы в соцсетях</h3>
                    <div className={stylesfooter.socialLinks}>
                        <a href="#" aria-label="VKontakte">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2M18.15 16.27H16.69C16.14 16.27 15.97 15.82 15 14.83C14.12 14 13.74 13.88 13.53 13.88C13.24 13.88 13.15 13.96 13.15 14.38V15.69C13.15 16.04 13.04 16.26 12.11 16.26C10.57 16.26 8.86 15.32 7.66 13.59C5.85 11.05 5.36 9.13 5.36 8.75C5.36 8.54 5.43 8.34 5.85 8.34H7.32C7.69 8.34 7.83 8.5 7.97 8.9C8.69 11 9.89 12.8 10.38 12.8C10.57 12.8 10.65 12.71 10.65 12.25V10.1C10.6 9.12 10.07 9.03 10.07 8.68C10.07 8.5 10.21 8.34 10.44 8.34H12.73C13.04 8.34 13.15 8.5 13.15 8.88V11.77C13.15 12.08 13.28 12.19 13.38 12.19C13.56 12.19 13.72 12.08 14.05 11.74C15.1 10.57 15.85 8.76 15.85 8.76C15.95 8.55 16.11 8.35 16.5 8.35H17.93C18.37 8.35 18.47 8.58 18.37 8.89C18.19 9.74 16.41 12.25 16.43 12.25C16.27 12.5 16.21 12.61 16.43 12.9C16.58 13.13 17.09 13.55 17.43 13.94C18.05 14.65 18.53 15.24 18.66 15.65C18.77 16.06 18.57 16.27 18.15 16.27"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="Telegram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
                            </svg>
                        </a>
                        <a href="#" aria-label="YouTube">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.65V8l6.22 3.83-6.22 3.82z"/>
                            </svg>
                        </a>
                    </div>
                    <div className={stylesfooter.appLinks}>
                        <a href="#" className={stylesfooter.appStoreLink}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
                        </a>
                        <a href="#" className={stylesfooter.googlePlayLink}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                        </a>
                    </div>
                </div>
            </div>

            <div className={stylesfooter.footerBottom}>
                <div className={stylesfooter.copyright}>
                    © 2023 TechShop. Все права защищены.
                </div>
                <div className={stylesfooter.legalLinks}>
                    <a href="#">Политика конфиденциальности</a>
                    <a href="#">Условия использования</a>
                    <a href="#">Публичная оферта</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;