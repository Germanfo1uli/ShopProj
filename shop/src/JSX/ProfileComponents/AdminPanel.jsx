import React, { useState } from 'react';
import styles from '../../CSS/ProfileCSS/AdminPanel.module.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [users, setUsers] = useState([
        { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user' },
        { id: 2, name: 'Петр Петров', email: 'petr@example.com', role: 'admin' }
    ]);
    const [editingUser, setEditingUser] = useState(null);
    const [reviews, setReviews] = useState([
        { id: 1, product: 'Телефон', user: 'Иван Иванов', rating: 5, text: 'Отличный товар!' },
        { id: 2, product: 'Ноутбук', user: 'Петр Петров', rating: 3, text: 'Нормально, но могло быть лучше' }
    ]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        quantityInStock: '',
        categoryId: '',
        isActive: true,
        rating: '',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);

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

    const handleReviewDelete = (reviewId) => {
        setReviews(reviews.filter(r => r.id !== reviewId));
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProduct(prev => ({ ...prev, image: file }));

            // Создаем превью изображения
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = () => {
        // Здесь должна быть логика добавления товара
        const productData = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            oldPrice: parseFloat(newProduct.oldPrice),
            quantityInStock: parseInt(newProduct.quantityInStock),
            categoryId: parseInt(newProduct.categoryId),
            rating: parseFloat(newProduct.rating),
            createdAt: new Date().toISOString()
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
            rating: '',
            image: null
        });
        setPreviewImage(null);
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
                                    <label>Активен</label>
                                    <div className={styles.toggleSwitch}>
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={newProduct.isActive}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, isActive: e.target.checked }))}
                                            id="isActiveToggle"
                                        />
                                        <label htmlFor="isActiveToggle" className={styles.slider}></label>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Изображение товара</label>
                                    <div className={styles.imageUploadContainer}>
                                        {previewImage ? (
                                            <div className={styles.imagePreview}>
                                                <img src={previewImage} alt="Превью" className={styles.previewImage} />
                                                <button
                                                    onClick={() => {
                                                        setNewProduct(prev => ({ ...prev, image: null }));
                                                        setPreviewImage(null);
                                                    }}
                                                    className={styles.removeImageButton}
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        ) : (
                                            <label className={styles.uploadArea}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className={styles.fileInput}
                                                />
                                                <div className={styles.uploadText}>
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                    <span>Перетащите или выберите изображение</span>
                                                </div>
                                            </label>
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
                                <div key={review.id} className={styles.reviewItem}>
                                    <div className={styles.reviewHeader}>
                                        <span className={styles.reviewProduct}>{review.product}</span>
                                        <span className={styles.reviewUser}>{review.user}</span>
                                        <span className={styles.reviewRating}>Оценка: {review.rating}/5</span>
                                    </div>
                                    <div className={styles.reviewText}>{review.text}</div>
                                    <div className={styles.reviewActions}>
                                        <button
                                            onClick={() => handleReviewDelete(review.id)}
                                            className={styles.smallButtonDanger}
                                        >
                                            Удалить отзыв
                                        </button>
                                    </div>
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