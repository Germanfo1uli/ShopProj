import React, { useState } from 'react';
import styles from '../CSS/ProductPage.module.css';
import { FaStar, FaStarHalfAlt, FaHeart, FaShoppingCart, FaMinus, FaPlus, FaBoxOpen, FaShippingFast, FaCheckCircle, FaInfoCircle, FaCloudUploadAlt } from 'react-icons/fa';
import Footer from "./Components/Footer";
import sb from "../CSS/Breadcrumbs.module.css";

const ProductPage = () => {

    // const { id } = useParams(); ОБЯЗАТЕЛЬНАЯ ШНЯГА НА БУДУЩЕЕ!!!!



    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-15942824161704-eee0b47e2ae6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80');
    const [showImageModal, setShowImageModal] = useState(false);

    const thumbnails = [
        'https://images.unsplash.com/photo-15942824161704-eee0b47e2ae6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1615992174118-9b8e9be025e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1517582288319-8a673a5d70a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
    ];

    const reviews = [
        {
            name: "Анна К.",
            date: "21 мая 2025",
            rating: 5,
            title: "Лучшее масло лаванды!",
            text: "Покупаю уже второй флакон. Аромат просто волшебный - натуральный, нежный, без химических примесей. Добавляю в ванну вечером и засыпаю как младенец. Также заметила, что помогает снять тревожность.",
            avatar: "https://i.pravatar.cc/150?img=1"
        },
        {
            name: "Игорь С.",
            date: "14 апреля 2025",
            rating: 4.5,
            title: "Качественный продукт",
            text: "Использую для ароматизации квартиры и добавления в массажное масло. Аромат держится долго, не вызывает аллергии (у меня чувствительная кожа). Единственное - хотелось бы чуть большего объема флакона, но это совсем не критично."
        }
    ];

    const handleQuantityChange = (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleRatingHover = (value) => {
        setHoverRating(value);
    };

    const handleRatingLeave = () => {
        setHoverRating(0);
    };

    const renderStars = (count, isHalf = false) => {
        const stars = [];
        for (let i = 1; i <= count; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={`${styles.star} ${i <= (hoverRating || rating) ? styles.starActive : ''}`}
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => handleRatingHover(i)}
                    onMouseLeave={handleRatingLeave}
                />
            );
        }
        if (isHalf) {
            stars.push(
                <FaStarHalfAlt
                    key={count + 1}
                    className={`${styles.star} ${styles.starActive}`}
                />
            );
        }
        return stars;
    };

    return (
        <>
        <div className={styles.container}>
            <nav className={sb.breadcrumbs}>
                <a href="/home" className={sb.breadcrumbLink}>Главная</a>
                <span className={sb.breadcrumbSeparator}>/</span>
                <a href="/catalog" className={sb.breadcrumbLink}>Каталог</a>
                <span className={sb.breadcrumbSeparator}>/</span>
                <span className={sb.breadcrumbActive}>Товар(Имя товара)</span>
            </nav>
            <div className={styles.productContainer}>
                <div className={styles.gallery}>
                    <div className={styles.mainImageContainer} onClick={() => setShowImageModal(true)}>
                        <img src={mainImage} alt="Эфирное масло лаванды" className={styles.mainImage} />
                    </div>
                    <div className={styles.thumbnails}>
                        {thumbnails.map((thumb, index) => (
                            <div
                                key={index}
                                className={`${styles.thumbnail} ${mainImage.includes(thumb.split('?')[0]) ? styles.thumbnailActive : ''}`}
                                onClick={() => setMainImage(thumb.replace('w=200', 'w=800'))}
                            >
                                <img src={thumb} alt={`Миниатюра ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.details}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>Эфирное масло лаванды "Luminara"</h1>
                        <button
                            className={styles.favoriteButton}
                            onClick={toggleFavorite}
                            onMouseEnter={() => document.querySelector(`.${styles.favoriteIcon}`).classList.add(styles.heartAnimation)}
                            onMouseLeave={() => document.querySelector(`.${styles.favoriteIcon}`).classList.remove(styles.heartAnimation)}
                        >
                            <FaHeart className={`${styles.favoriteIcon} ${isFavorite ? styles.favoriteActive : ''}`} />
                        </button>
                    </div>

                    <div className={styles.ratingContainer}>
                        <div className={styles.stars}>
                            {renderStars(4)}
                            <FaStarHalfAlt className={`${styles.star} ${styles.starActive}`} />
                        </div>
                        <span className={styles.ratingText}>4.7 (128 отзывов)</span>
                    </div>

                    <div className={styles.features}>
                        <div className={styles.featureItem}>
                            <FaCheckCircle className={styles.featureIcon} />
                            <span>100% натуральное</span>
                        </div>
                        <div className={styles.featureItem}>
                            <FaCheckCircle className={styles.featureIcon} />
                            <span>Без добавок и консервантов</span>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <p>
                            Чистое эфирное масло лаванды премиум-класса, добытое методом паровой дистилляции из цветков лаванды, выращенной на солнечных склонах Прованса. Идеально подходит для ароматерапии, релаксации и ухода за кожей.
                        </p>

                        <div className={styles.specs}>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Бренд:</span>
                                <span className={styles.specValue}>Luminara</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Объем:</span>
                                <span className={styles.specValue}>10 мл</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Страна:</span>
                                <span className={styles.specValue}>Франция</span>
                            </div>
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Срок годности:</span>
                                <span className={styles.specValue}>24 месяца</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.priceContainer}>
                        <div className={styles.priceRow}>
                            <div>
                                <span className={styles.currentPrice}>1 490 ₽</span>
                                <span className={styles.oldPrice}>1 790 ₽</span>
                                <span className={styles.discountBadge}>-17%</span>
                            </div>
                            <div className={styles.stock}>
                                <FaBoxOpen className={styles.stockIcon} />
                                <span>В наличии 25 шт.</span>
                            </div>
                        </div>
                        <div className={styles.shipping}>
                            <FaShippingFast className={styles.shippingIcon} />
                            <span>Бесплатная доставка при заказе от 3000 ₽</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.quantitySelector}>
                            <button onClick={() => handleQuantityChange(-1)}>
                                <FaMinus />
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} >
                                <FaPlus />
                            </button>
                        </div>
                        <button className={styles.addToCart}>
                            <FaShoppingCart className={styles.cartIcon} />
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Описание
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'specs' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('specs')}
                    >
                        Характеристики
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'usage' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('usage')}
                    >
                        Способ применения
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'description' && (
                        <>
                            <h2 className={styles.tabTitle}>Эфирное масло лаванды Luminara</h2>
                            <p className={styles.tabText}>
                                Наше масло лаванды отличается исключительным качеством и чистотой. Оно производится из отборных цветков лаванды, собранных вручную в период максимального цветения, когда содержание полезных веществ достигает своего пика.
                            </p>
                            <p className={styles.tabText}>
                                Масло обладает нежным, цветочным ароматом с древесными нотками, который способствует расслаблению, снятию стресса и улучшению качества сна. Широко используется в ароматерапии, косметологии и домашнем уходе.
                            </p>

                            <h3 className={styles.subtitle}>Основные свойства:</h3>
                            <ul className={styles.featuresList}>
                                <li>Успокаивает нервную систему, помогает при бессоннице</li>
                                <li>Обладает антисептическими и противовоспалительными свойствами</li>
                                <li>Способствует заживлению небольших повреждений кожи</li>
                                <li>Уменьшает раздражение и покраснение кожи</li>
                                <li>Освежает воздух и отпугивает насекомых</li>
                            </ul>

                            <div className={styles.tip}>
                                <FaInfoCircle className={styles.tipIcon} />
                                <p>
                                    <strong>Совет:</strong> Добавьте 3-5 капель масла в диффузор перед сном для создания расслабляющей атмосферы в спальне. Для ухода за кожей смешивайте с базовым маслом (1-2 капли на столовую ложку).
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 'specs' && (
                        <div>
                            <h3 className={styles.subtitle}>Технические характеристики</h3>
                        </div>
                    )}

                    {activeTab === 'usage' && (
                        <div>
                            <h3 className={styles.subtitle}>Способы применения</h3>

                        </div>
                    )}
                </div>
            </div>


            <div className={styles.reviewsSection}>
                <h2 className={styles.sectionTitle}>Отзывы покупателей</h2>

                <div className={styles.overallRating}>
                    <div className={styles.ratingSummary}>
                        <div className={styles.averageRating}>4.7</div>
                        <div className={styles.stars}>
                            {renderStars(4)}
                            <FaStarHalfAlt className={`${styles.star} ${styles.starActive}`} />
                        </div>
                        <div className={styles.ratingCount}>на основе 128 отзывов</div>
                    </div>

                    <div className={styles.ratingBars}>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className={styles.ratingBar}>
                                <span className={styles.ratingLabel}>{star}</span>
                                <FaStar className={`${styles.star} ${styles.starActive} ${styles.smallStar}`} />
                                <div className={styles.barContainer}>
                                    <div
                                        className={styles.barFill}
                                        style={{ width: `${[70, 20, 5, 3, 2][5-star]}%` }}
                                    ></div>
                                </div>
                                <span className={styles.ratingCount}>{[89, 25, 8, 4, 2][5-star]}</span>
                            </div>
                        ))}
                    </div>

                    <button className={styles.reviewButton}>
                        Оставить отзыв
                    </button>
                </div>

                <div className={styles.reviewsList}>
                    {reviews.map((review, index) => (
                        <div key={index} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div>
                                    <div className={styles.reviewAuthor}>{review.name}</div>
                                    <div className={styles.reviewDate}>{review.date}</div>
                                </div>
                                <div className={styles.stars}>
                                    {renderStars(Math.floor(review.rating), review.rating % 1 !== 0)}
                                </div>
                            </div>
                            <h3 className={styles.reviewTitle}>{review.title}</h3>
                            <p className={styles.reviewText}>{review.text}</p>
                            {review.avatar && (
                                <div className={styles.reviewImages}>
                                    <img src={review.avatar} alt="Фото пользователя" className={styles.reviewImage} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.moreReviews}>
                    <button className={styles.moreButton}>
                        Показать еще отзывы
                    </button>
                </div>
            </div>

            <div className={styles.reviewForm}>
                <h2 className={styles.sectionTitle}>Оставить отзыв</h2>
                <p className={styles.formDescription}>Расскажите о вашем опыте использования этого товара</p>

                <form>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ваша оценка</label>
                        <div className={styles.ratingInput}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.starButton} ${star <= (hoverRating || rating) ? styles.starButtonActive : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <FaStar className={styles.starIcon} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>Имя</label>
                            <input type="text" id="name" className={styles.formInput} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>Email (не будет опубликован)</label>
                            <input type="email" id="email" className={styles.formInput} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.formLabel}>Заголовок отзыва</label>
                        <input
                            type="text"
                            id="title"
                            className={styles.formInput2}
                            placeholder="Например: 'Отличное качество'"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="review" className={styles.formLabel}>Ваш отзыв</label>
                        <textarea
                            id="review"
                            rows="5"
                            className={styles.formTextarea}
                            placeholder="Расскажите о ваших впечатлениях"
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Добавить фото (по желанию)</label>
                        <div className={styles.uploadContainer}>
                            <label htmlFor="dropzone-file" className={styles.uploadLabel}>
                                <div className={styles.uploadContent}>
                                    <FaCloudUploadAlt className={styles.uploadIcon} />
                                    <p className={styles.uploadText}>Перетащите фото сюда или нажмите для выбора</p>
                                </div>
                                <input id="dropzone-file" type="file" className={styles.uploadInput} />
                            </label>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Опубликовать отзыв
                    </button>
                </form>
            </div>

            {showImageModal && (
                <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
                    <img src={mainImage} alt="Увеличенное изображение" className={styles.modalImage} />
                </div>
            )}
        </div>
    <Footer/>
        </>
    );
};

export default ProductPage;