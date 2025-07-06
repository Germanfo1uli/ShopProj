import React, { useState } from 'react';
import styles from '../../CSS/ProfileCSS/AdminPanel.module.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('products');

    // Данные пользователей
    const [users, setUsers] = useState([
        { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user' },
        { id: 2, name: 'Петр Петров', email: 'petr@example.com', role: 'admin' }
    ]);
    const [editingUser, setEditingUser] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Отзывы
    const [reviews, setReviews] = useState([
        { id: 1, product: 'Телефон', user: 'Иван Иванов', rating: 5, text: 'Отличный товар!' },
        { id: 2, product: 'Ноутбук', user: 'Петр Петров', rating: 3, text: 'Нормально, но могло быть лучше' }
    ]);


    const handleReplySubmit = (reviewId) => {
        // Логика сохранения ответа
        setReplyingTo(null);
        setReplyText('');
    };

    const handleReviewApprove = (reviewId) => {
        // Логика одобрения/снятия одобрения отзыва
    };
    // Данные товара
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        quantityInStock: '',
        categoryId: '',
        isActive: true,
        rating: ''
    });

    // Изображения товара
    const [productImages, setProductImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(true);

    // Валидация URL изображения
    const validateImageUrl = (url) => {
        const pattern = /^(https?:\/\/).*\.(jpg|jpeg|png|gif|webp)$/i;
        return pattern.test(url);
    };

    // Добавление изображения по ссылке
    const handleAddImageByUrl = () => {
        if (!imageUrl.trim()) return;

        const isValid = validateImageUrl(imageUrl);
        setIsUrlValid(isValid);

        if (!isValid) return;

        const newImage = {
            url: imageUrl,
            isMain: productImages.length === 0
        };

        setProductImages(prev => [...prev, newImage]);

        if (productImages.length === 0) {
            setMainImageIndex(0);
        }

        setImageUrl('');
    };

    // Удаление изображения
    const handleRemoveImage = (index) => {
        const newImages = productImages.filter((_, i) => i !== index);
        setProductImages(newImages);

        if (index === mainImageIndex) {
            if (newImages.length > 0) {
                setMainImageIndex(0);
                newImages[0].isMain = true;
            } else {
                setMainImageIndex(0);
            }
        } else if (index < mainImageIndex) {
            setMainImageIndex(mainImageIndex - 1);
        }
    };

    // Установка основного изображения
    const handleSetMainImage = (index) => {
        const newImages = productImages.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        setProductImages(newImages);
        setMainImageIndex(index);
    };

    // Управление пользователями
    const handleUserEdit = (user) => {
        setEditingUser({ ...user });
    };

    const handleUserSave = () => {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setEditingUser(null);
    };

    const handleUserDelete = (userId) => {
        setUsers(users.filter(u => u.id !== userId));
    };

    // Управление отзывами
    const handleReviewDelete = (reviewId) => {
        setReviews(reviews.filter(r => r.id !== reviewId));
    };

    // Изменение данных товара
    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    // Добавление товара
    const handleAddProduct = () => {
        const productData = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            oldPrice: parseFloat(newProduct.oldPrice),
            quantityInStock: parseInt(newProduct.quantityInStock),
            categoryId: parseInt(newProduct.categoryId),
            rating: parseFloat(newProduct.rating),
            createdAt: new Date().toISOString(),
            images: productImages,
            mainImageIndex
        };

        console.log('Добавляемый товар:', productData);
        alert(`Товар "${newProduct.name}" добавлен!`);

        // Сброс формы
        setNewProduct({
            name: '',
            description: '',
            price: '',
            oldPrice: '',
            quantityInStock: '',
            categoryId: '',
            isActive: true,
            rating: ''
        });
        setProductImages([]);
        setMainImageIndex(0);
        setImageUrl('');
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>Админ панель</h1>
            </div>

            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Товары
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Пользователи
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Отзывы
                    </button>
                </div>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'products' && (
                    <div className={styles.settingsSection}>
                        <h2 className={styles.settingsTitle}>Добавить новый товар</h2>

                        <div className={styles.formGrid}>
                            <div className={styles.formColumn}>
                                <div className={styles.formGroup}>
                                    <label>Название товара*</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newProduct.name}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Описание</label>
                                    <textarea
                                        name="description"
                                        value={newProduct.description}
                                        onChange={handleProductInputChange}
                                        className={styles.formTextarea}
                                        rows={4}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Цена*</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newProduct.price}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Старая цена</label>
                                    <input
                                        type="number"
                                        name="oldPrice"
                                        value={newProduct.oldPrice}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className={styles.formColumn}>
                                <div className={styles.formGroup}>
                                    <label>Количество на складе*</label>
                                    <input
                                        type="number"
                                        name="quantityInStock"
                                        value={newProduct.quantityInStock}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>ID категории*</label>
                                    <input
                                        type="number"
                                        name="categoryId"
                                        value={newProduct.categoryId}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Рейтинг</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={newProduct.rating}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Изображения товара</label>
                                    <div className={styles.imageUploadContainer}>
                                        {/* Форма для добавления по ссылке */}
                                        <div className={styles.addByUrlContainer}>
                                            <input
                                                type="text"
                                                value={imageUrl}
                                                onChange={(e) => {
                                                    setImageUrl(e.target.value);
                                                    setIsUrlValid(true);
                                                }}
                                                placeholder="Введите URL изображения (jpg, png, gif)"
                                                className={`${styles.urlInput} ${!isUrlValid ? styles.invalid : ''}`}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddImageByUrl()}
                                            />
                                            <button
                                                onClick={handleAddImageByUrl}
                                                className={styles.addUrlButton}
                                                disabled={!imageUrl.trim()}
                                            >
                                                Добавить по ссылке
                                            </button>
                                            {!isUrlValid && (
                                                <p className={styles.errorText}>Введите корректный URL изображения</p>
                                            )}
                                        </div>

                                        {/* Список добавленных изображений */}
                                        {productImages.length > 0 && (
                                            <div className={styles.imagesGrid}>
                                                {productImages.map((image, index) => (
                                                    <div key={index} className={styles.imagePreviewWrapper}>
                                                        <div
                                                            className={`${styles.imagePreview} ${image.isMain ? styles.mainImage : ''}`}
                                                            onClick={() => handleSetMainImage(index)}
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt={`Превью ${index + 1}`}
                                                                className={styles.previewImage}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/150?text=Image+not+found';
                                                                }}
                                                            />
                                                            {image.isMain && (
                                                                <div className={styles.mainImageBadge}>Основное</div>
                                                            )}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveImage(index);
                                                                }}
                                                                className={styles.removeImageButton}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddProduct}
                            className={styles.saveButton}
                            disabled={!newProduct.name || !newProduct.price || !newProduct.quantityInStock || !newProduct.categoryId}
                        >
                            Добавить товар
                        </button>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className={styles.settingsSection}>
                        <h2 className={styles.settingsTitle}>Управление пользователями</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.usersTable}>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            {editingUser?.id === user.id ? (
                                                <input
                                                    type="text"
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                user.name
                                            )}
                                        </td>
                                        <td>
                                            {editingUser?.id === user.id ? (
                                                <input
                                                    type="email"
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    className={styles.editInput}
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                        <td>
                                            {editingUser?.id === user.id ? (
                                                <select
                                                    value={editingUser.role}
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                    className={styles.editSelect}
                                                >
                                                    <option value="user">Пользователь</option>
                                                    <option value="admin">Администратор</option>
                                                </select>
                                            ) : (
                                                user.role
                                            )}
                                        </td>
                                        <td>
                                            {editingUser?.id === user.id ? (
                                                <>
                                                    <button onClick={handleUserSave} className={styles.smallButton}>Сохранить</button>
                                                    <button onClick={() => setEditingUser(null)} className={styles.smallButtonCancel}>Отмена</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleUserEdit(user)} className={styles.smallButton}>Редактировать</button>
                                                    <button onClick={() => handleUserDelete(user.id)} className={styles.smallButtonDanger}>Удалить</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className={styles.settingsSection}>
                        <h2 className={styles.settingsTitle}>Управление отзывами</h2>
                        <div className={styles.reviewsList}>
                            {reviews.map(review => (
                                <div key={review.id} className={`${styles.reviewItem} ${review.approved ? styles.approved : ''} ${review.reply ? styles.hasReply : ''}`}>
                                    <div className={styles.reviewHeader}>
                                        <span className={styles.reviewProduct}>{review.product}</span>
                                        <span className={styles.reviewUser}>{review.user}</span>
                                        <span className={styles.reviewRating}>Оценка: {review.rating}/5</span>
                                        {review.approved && <span className={styles.approvedBadge}>✓ Одобрен</span>}
                                    </div>
                                    <div className={styles.reviewText}>{review.text}</div>

                                    {review.reply && (
                                        <div className={styles.reviewReply}>
                                            <div className={styles.replyHeader}>Ответ администратора:</div>
                                            <div className={styles.replyText}>{review.reply}</div>
                                        </div>
                                    )}

                                    <div className={styles.reviewActions}>
                                        {!review.reply && (
                                            <button
                                                onClick={() => setReplyingTo(review.id)}
                                                className={styles.smallButtonSecondary}
                                            >
                                                Ответить
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleReviewApprove(review.id)}
                                            className={styles.smallButtonPrimary}
                                        >
                                            {review.approved ? 'Снять одобрение' : 'Одобрить'}
                                        </button>
                                        <button
                                            onClick={() => handleReviewDelete(review.id)}
                                            className={styles.smallButtonDanger}
                                        >
                                            Удалить
                                        </button>
                                    </div>

                                    {replyingTo === review.id && (
                                        <div className={styles.replyForm}>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className={styles.replyTextarea}
                                placeholder="Введите ваш ответ на отзыв"
                            />
                                            <div className={styles.replyFormActions}>
                                                <button
                                                    onClick={() => handleReplySubmit(review.id)}
                                                    className={styles.smallButton}
                                                >
                                                    Отправить ответ
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo(null);
                                                        setReplyText('');
                                                    }}
                                                    className={styles.smallButtonCancel}
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;