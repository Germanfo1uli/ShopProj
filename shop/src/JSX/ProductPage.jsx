import React, { useState, useEffect  } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../CSS/ProductPage.module.css';
import { FaStar, FaStarHalfAlt, FaHeart, FaShoppingCart, FaMinus, FaPlus, FaBoxOpen, FaShippingFast, FaCheckCircle, FaInfoCircle, FaCloudUploadAlt } from 'react-icons/fa';
import Footer from "./Components/Footer";
import sb from "../CSS/Breadcrumbs.module.css";
import { apiRequest } from './Api/ApiRequest';
import { useAuth } from './Hooks/UseAuth';


const ProductPage = () => {
    const { id } = useParams();
    const { userId, isAuthenticated } = useAuth();
    const [productData, setProductData] = useState(null);
    const [reviewsData, setReviewsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [reviewForm, setReviewForm] = useState({
        header: '',
        comment: '',
        rating: 0
    });
    const [specifications, setSpecifications] = useState([]);
    const [specsLoading, setSpecsLoading] = useState(true);
    

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const response = await apiRequest(`/api/products/${id}`);
                setProductData(response);
                
                if (response.product?.productImage && response.product.productImage.length > 0) {
                    setMainImage(`${process.env.REACT_APP_API_URL}${response.product.productImage[0].url}`);
                }
                
                if (userId) {
                    const userFavorites = await apiRequest(`/api/userfavorites/${userId}`, {
                        authenticated: isAuthenticated  
                    });
                    
                    const favoriteIds = userFavorites.map(fav => Number(fav.id)); 
                    setFavorites(favoriteIds);
                    setIsFavorite(favoriteIds.includes(Number(id)));
                }
                await fetchSpecifications(id);

            } 
            catch (err) {
                console.error('Ошибка загрузки данных товара:', err);
                setError('Не удалось загрузить данные товара');
            } 
            finally {
                setIsLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const response = await apiRequest(`/api/reviews/product/${id}`);
                console.log(response)
                const reviews = response || [];
                const totalReviews = reviews.length;
                const averageRating = totalReviews > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
                    : 0;
                
                const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                reviews.forEach(review => {
                    const roundedRating = Math.round(review.rating);
                    if (roundedRating >= 1 && roundedRating <= 5) {
                        ratingCounts[roundedRating]++;
                    }
                });
                
                setReviewsData({
                    reviews,
                    averageRating,
                    ratingCounts,
                    totalReviews
                });
                
            } catch (err) {
                console.error('Ошибка загрузки отзывов:', err);
                setReviewsData({
                    reviews: [],
                    averageRating: 0,
                    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                    totalReviews: 0
                });
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [id, userId, isAuthenticated]);

    const handleQuantityChange = (amount) => {
        const newQuantity = quantity + amount;
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    const toggleFavorite = async () => {
        if (!userId) {
            alert('Войдите в систему, чтобы добавлять товары в избранное');
            return;
        }

        try {
            setIsFavorite(prev => !prev);
            
            const response = await apiRequest('/api/userfavorites', {
                method: isFavorite ? 'DELETE' : 'POST',
                body: {
                    userId: userId,
                    productId: Number(id)
                },
                authenticated: isAuthenticated
            });

            if (response) {
                const updatedFavorites = await apiRequest(`/api/userfavorites/${userId}`, {
                    authenticated: isAuthenticated
                });
                
                const favoriteIds = updatedFavorites.map(item => {
                    if (item.id) return Number(item.id);
                    if (item.productId) return Number(item.productId);
                    return null;
                }).filter(id => id !== null);
                
                setFavorites(favoriteIds);
                setIsFavorite(favoriteIds.includes(Number(id)));
            }
        } catch (error) {
            console.error('Ошибка при обновлении избранного:', error);
            setIsFavorite(prev => !prev);
            alert('Не удалось обновить избранное: ' + error.message);
        }
    };

    const addToCart = async () => {
        if (!userId) {
            alert('Войдите в систему, чтобы добавлять товары в корзину');
            return;
        }

        try {
            const response = await apiRequest('/api/orderitems', {
                method: 'POST',
                body: {
                    userId: userId,
                    productId: Number(id),
                    quantity: quantity
                },
                authenticated: isAuthenticated
            });

            if (response) {
                alert('Товар успешно добавлен в корзину!');
            }
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Не удалось добавить товар в корзину: ' + error.message);
        }
    };

    const fetchSpecifications = async (productId) => {
        try {
            setSpecsLoading(true);
            const response = await apiRequest(`/api/productspecifications/product/${productId}`);
            setSpecifications(response || []);
            console.log(response)
        } catch (err) {
            console.error('Ошибка загрузки спецификаций:', err);
            setSpecifications([]);
        } finally {
            setSpecsLoading(false);
        }
    };

    const handleRatingClick = (value) => {
        setRating(value);
        setReviewForm(prev => ({
            ...prev,
            rating: value
        }));
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            alert('Войдите в систему, чтобы оставить отзыв');
            return;
        }

        if (!reviewForm.rating) {
            alert('Пожалуйста, поставьте оценку товару');
            return;
        }

        try {
            const response = await apiRequest('/api/reviews', {
                method: 'POST',
                body: {
                    productId: Number(id),
                    userId: userId,
                    rating: reviewForm.rating,
                    header: reviewForm.header,
                    comment: reviewForm.comment
                },
                authenticated: isAuthenticated
            });

            if (response) {
                alert('Ваш отзыв успешно отправлен!');
                setReviewForm({
                    header: '',
                    comment: '',
                    rating: 0
                });
                setRating(0);
                const reviewsResponse = await apiRequest(`/api/reviews/product/${id}`);
                const reviews = reviewsResponse || [];
                const totalReviews = reviews.length;
                const averageRating = totalReviews > 0 
                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
                    : 0;
                
                const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                reviews.forEach(review => {
                    const roundedRating = Math.round(review.rating);
                    if (roundedRating >= 1 && roundedRating <= 5) {
                        ratingCounts[roundedRating]++;
                    }
                });
                
                setReviewsData({
                    reviews,
                    averageRating,
                    ratingCounts,
                    totalReviews
                });

                const updatedProduct = await apiRequest(`/api/products/${id}`);
                setProductData(prev => ({
                    ...prev,
                    product: {
                        ...prev.product,
                        rating: updatedProduct.product.rating,
                        reviews: updatedProduct.product.reviews
                    }
                }));
            }
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            alert('Не удалось отправить отзыв: ' + error.message);
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!productData?.product) {
        return <div className={styles.error}>Товар не найден</div>;
    }
    const { product } = productData;
    const reviews = reviewsData?.reviews || [];
    const averageRating = reviewsData?.averageRating || 0;
    const ratingCounts = reviewsData?.ratingCounts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const totalReviews = reviewsData?.totalReviews || 0;

    return (
        <>
        <div className={styles.container}>
                <nav className={sb.breadcrumbs}>
                    <a href="/home" className={sb.breadcrumbLink}>Главная</a>
                    <span className={sb.breadcrumbSeparator}>/</span>
                    <a href="/catalog" className={sb.breadcrumbLink}>Каталог</a>
                    <span className={sb.breadcrumbSeparator}>/</span>
                    <span className={sb.breadcrumbActive}>{product.name}</span>
                </nav>
                <div className={styles.productContainer}>
                    <div className={styles.gallery}>
                        {mainImage && (
                            <div className={styles.mainImageContainer} onClick={() => setShowImageModal(true)}>
                                <img src={mainImage} alt={product.name} className={styles.mainImage} />
                            </div>
                        )}
                        <div className={styles.thumbnails}>
                            {product.images?.map((image, index) => (
                                <div
                                    key={index}
                                    className={`${styles.thumbnail} ${mainImage.includes(image.url) ? styles.thumbnailActive : ''}`}
                                    onClick={() => setMainImage(`${process.env.REACT_APP_API_URL}${image.url}`)}
                                >
                                    <img src={`${process.env.REACT_APP_API_URL}${image.url}`} alt={`Миниатюра ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{product.name}</h1>
                            <button
                                className={styles.favoriteButton}
                                onClick={toggleFavorite}
                                onMouseEnter={() => document.querySelector(`.${styles.favoriteIcon}`)?.classList.add(styles.heartAnimation)}
                                onMouseLeave={() => document.querySelector(`.${styles.favoriteIcon}`)?.classList.remove(styles.heartAnimation)}
                            >
                                <FaHeart className={`${styles.favoriteIcon} ${isFavorite ? styles.favoriteActive : ''}`} />
                            </button>
                        </div>

                        <div className={styles.ratingContainer}>
                            <div className={styles.stars}>
                                {renderStars(Math.floor(product.rating || 0), (product.rating || 0) % 1 !== 0)}
                            </div>
                            <span className={styles.ratingText}>{product.rating?.toFixed(1) || 0} ({product.reviewsNumber || 0} отзывов)</span>
                        </div>

                        <div className={styles.features}>
                            {product.features?.map((feature, index) => (
                                <div key={index} className={styles.featureItem}>
                                    <FaCheckCircle className={styles.featureIcon} />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.specifications}>
                            {specifications.map((spec, index) => (
                                <div key={index} className={styles.specItem}>
                                    <span className={styles.specLabel}>{spec.key}:</span>
                                    <span className={styles.specValue}>{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.priceContainer}>
                            <div className={styles.priceRow}>
                                <div>
                                    <span className={styles.currentPrice}>{product.price} ₽</span>
                                    {product.oldPrice && product.oldPrice > 0 && (
                                        <>
                                            <span className={styles.oldPrice}>{product.oldPrice} ₽</span>
                                            {product.discount && (
                                                <span className={styles.discountBadge}>-{product.discount}%</span>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className={styles.stock}>
                                    <FaBoxOpen className={styles.stockIcon} />
                                    <span>В наличии {product.quantityInStock} шт.</span>
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
                                <button onClick={() => handleQuantityChange(1)}>
                                    <FaPlus />
                                </button>
                            </div>
                            <button 
                                className={styles.addToCart} 
                                onClick={addToCart}
                                disabled={!product.quantityInStock || product.quantityInStock <= 0}
                            >
                                <FaShoppingCart className={styles.cartIcon} />
                                {product.quantityInStock && product.quantityInStock > 0 
                                    ? 'Добавить в корзину' 
                                    : 'Нет в наличии'}
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
                                <h2 className={styles.tabTitle}>{product.name}</h2>
                                <p className={styles.tabText}>{product.description}</p>

                                {product.benefits && (
                                    <>
                                        <h3 className={styles.subtitle}>Основные свойства:</h3>
                                        <ul className={styles.featuresList}>
                                            {product.benefits.map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {product.tip && (
                                    <div className={styles.tip}>
                                        <FaInfoCircle className={styles.tipIcon} />
                                        <p>
                                            <strong>Совет:</strong> {product.tip}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'specs' && (
                            <div>
                                <h3 className={styles.subtitle}>Технические характеристики</h3>
                                <div className={styles.specsTable}>
                                    {product.technicalSpecs?.map((spec, index) => (
                                        <div key={index} className={styles.specRow}>
                                            <div className={styles.specName}>{spec.name}</div>
                                            <div className={styles.specValue}>{spec.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'usage' && (
                            <div>
                                <h3 className={styles.subtitle}>Способы применения</h3>
                                <div className={styles.usageContent}>
                                    {product.usageInstructions?.map((instruction, index) => (
                                        <div key={index} className={styles.usageItem}>
                                            <h4 className={styles.usageTitle}>{instruction.title}</h4>
                                            <p className={styles.usageText}>{instruction.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                <div className={styles.reviewsSection}>
                    <h2 className={styles.sectionTitle}>Отзывы покупателей</h2>

                    <div className={styles.overallRating}>
                        <div className={styles.ratingSummary}>
                            <div className={styles.averageRating}>{averageRating.toFixed(1)}</div>
                            <div className={styles.stars}>
                                {renderStars(Math.floor(averageRating), averageRating % 1 !== 0)}
                            </div>
                            <div className={styles.ratingCount}>на основе {totalReviews} отзывов</div>
                        </div>

                        <div className={styles.ratingBars}>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className={styles.ratingBar}>
                                    <span className={styles.ratingLabel}>{star}</span>
                                    <FaStar className={`${styles.star} ${styles.starActive} ${styles.smallStar}`} />
                                    <div className={styles.barContainer}>
                                        <div
                                            className={styles.barFill}
                                            style={{ 
                                                width: totalReviews > 0 
                                                    ? `${(ratingCounts[star] / totalReviews) * 100}%` 
                                                    : '0%'
                                            }}
                                        ></div>
                                    </div>
                                    <span className={styles.ratingCount}>{ratingCounts[star]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {reviewsLoading ? (
                        <div className={styles.loading}>Загрузка отзывов...</div>
                    ) : reviews.length > 0 ? (
                        <>
                            <div className={styles.reviewsList}>
                                {reviews.map((review) => (
                                    <div key={review.id} className={styles.reviewCard}>
                                        <div className={styles.reviewHeader}>
                                            <div>
                                                <div className={styles.reviewAuthor}>
                                                    {review.user.firstName || `Аноним`} {review.user.lastName.charAt(0) + "." || ` `}
                                                </div>
                                                <div className={styles.reviewDate}>
                                                    {new Date(review.createdAt || review.date).toLocaleDateString('ru-RU', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div className={styles.stars}>
                                                {renderStars(Math.floor(review.rating), review.rating % 1 !== 0)}
                                            </div>
                                        </div>
                                        <h3 className={styles.reviewTitle}>{review.header || 'Без заголовка'}</h3>
                                        <p className={styles.reviewText}>{review.text || review.comment || 'Нет текста отзыва'}</p>
                                        {/* Если есть изображения в отзыве */}
                                        {review.images && review.images.length > 0 && (
                                            <div className={styles.reviewImages}>
                                                {review.images.map((image, imgIndex) => (
                                                    <img 
                                                        key={imgIndex} 
                                                        src={`${process.env.REACT_APP_API_URL}${image.url}`} 
                                                        alt="Фото из отзыва" 
                                                        className={styles.reviewImage} 
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.noReviews}>Пока нет отзывов. Будьте первым!</div>
                    )}
                </div>

            <div className={styles.reviewForm}>
                <h2 className={styles.sectionTitle}>Оставить отзыв</h2>
                <p className={styles.formDescription}>Расскажите о вашем опыте использования этого товара</p>

                <form onSubmit={handleReviewSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ваша оценка</label>
                        <div className={styles.ratingInput}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.starButton} ${star <= (hoverRating || reviewForm.rating) ? styles.starButtonActive : ''}`}
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <FaStar className={styles.starIcon} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="header" className={styles.formLabel}>Заголовок отзыва</label>
                        <input
                            type="text"
                            id="header"
                            name="header"
                            className={styles.formInput2}
                            placeholder="Например: 'Отличное качество'"
                            value={reviewForm.header}
                            onChange={handleReviewChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="comment" className={styles.formLabel}>Ваш отзыв</label>
                        <textarea
                            id="comment"
                            name="comment"
                            rows="5"
                            className={styles.formTextarea}
                            placeholder="Расскажите о ваших впечатлениях"
                            value={reviewForm.comment}
                            onChange={handleReviewChange}
                            required
                        ></textarea>
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