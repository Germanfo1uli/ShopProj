import React, { useState, useEffect } from 'react';
import styles from '../../CSS/ProfileCSS/AdminPanel.module.css';
import { apiRequest } from '../Api/ApiRequest';
import { useAuth } from '../Hooks/UseAuth';

// Компонент для уведомлений
const Notification = ({ message, type, onClose }) => {
    const notificationStyles = {
        success: {
            backgroundColor: 'var(--success-bg)',
            borderColor: 'var(--success-border)',
            color: 'var(--success-text)'
        },
        error: {
            backgroundColor: 'var(--error-bg)',
            borderColor: 'var(--error-border)',
            color: 'var(--error-text)'
        },
        info: {
            backgroundColor: 'var(--info-bg)',
            borderColor: 'var(--info-border)',
            color: 'var(--info-text)'
        }
    };

    return (
        <div
            className={styles.notification}
            style={notificationStyles[type] || notificationStyles.info}
        >
            <div className={styles.notificationContent}>
                {message}
                <button onClick={onClose} className={styles.notificationClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

// Компонент модального окна подтверждения
const ConfirmationModal = ({
                               isOpen,
                               onClose,
                               onConfirm,
                               title,
                               message,
                               confirmText = "Подтвердить",
                               cancelText = "Отмена"
                           }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button onClick={onClose} className={styles.modalCloseButton}>
                        &times;
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <p>{message}</p>
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={onClose} className={styles.modalCancelButton}>
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={styles.modalConfirmButton}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminPanel = () => {
    const { isAuthenticated, role } = useAuth();
    const [activeTab, setActiveTab] = useState('products');
    const [categories, setCategories] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [rolesMap] = useState({
        1: 'Администратор',
        2: 'Модератор',
        3: 'Пользователь'
    });
    const [editingUser, setEditingUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [notification, setNotification] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

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

    const showNotification = (message, type = 'info', duration = 5000) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), duration);
    };

    const showConfirmation = (title, message, onConfirm) => {
        setConfirmationModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmationModal({ ...confirmationModal, isOpen: false });
            }
        });
    };

    const closeConfirmation = () => {
        setConfirmationModal({ ...confirmationModal, isOpen: false });
    };

    const fetchCategories = async () => {
        try {
            const data = await apiRequest('/api/categories');
            setCategories(data || []);
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
            setCategories([]);
            return [];
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await apiRequest('/api/users', {
                method: 'GET',
                authenticated: true
            });
            setUsers(data || []);

        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            showNotification('Ошибка при загрузке пользователей', 'error');
        }
    };

    const fetchUserRoles = async () => {
        try {
            const data = await apiRequest('/api/userroles', {
                method: 'GET',
                authenticated: true
            });
            setUserRoles(data || []);

        } catch (error) {
            console.error('Ошибка при загрузке ролей:', error);
            showNotification('Ошибка при загрузке ролей пользователей', 'error');
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await apiRequest('/api/reviews', {
                method: 'GET',
                authenticated: true
            });
            setReviews(data || []);
        }
        catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
            showNotification('Не удалось загрузить список отзывов', 'error');
        }
    };

    const createProduct = async (productData) => {
        try {
            return await apiRequest('/api/products', {
                method: 'POST',
                body: productData,
                authenticated: true
            });
        } catch (error) {
            console.error('Ошибка при создании товара:', error);
            throw error;
        }
    };

    const addProductImages = async (productId, images) => {
        try {
            const requests = images.map(image =>
                apiRequest('/api/productimages', {
                    method: 'POST',
                    body: {
                        ProductId: productId,
                        ImageUrl: image.url,
                        IsMain: image.isMain
                    },
                    authenticated: true
                })
            );
            return await Promise.all(requests);
        } catch (error) {
            console.error('Ошибка при добавлении изображений:', error);
            throw error;
        }
    };

    const handleReviewApprove = async (reviewId) => {
        const userIdClaim = localStorage.getItem('userId');
        if (!userIdClaim) {
            showNotification('Не удалось идентифицировать модератора', 'error');
            return;
        }

        const moderatorId = parseInt(userIdClaim);
        const reviewToUpdate = reviews.find(r => r.id === reviewId);
        if (!reviewToUpdate) return;

        try {
            const currentApprovedStatus = reviewToUpdate.approved;
            const endpoint = currentApprovedStatus ? 'reject' : 'approve';

            const updatedReviews = reviews.map(r =>
                r.id === reviewId ? {
                    ...r,
                    approved: !currentApprovedStatus,
                    moderatorId: moderatorId,
                    moderatedAt: new Date().toISOString()
                } : r
            );
            setReviews(updatedReviews);

            await apiRequest(`/api/reviews/${reviewId}/${endpoint}`, {
                method: 'PATCH',
                body: {
                    moderatorId: moderatorId,
                    moderatorComment: reviewToUpdate.moderatorComment || null
                },
                authenticated: true
            });

            showNotification(`Отзыв успешно ${currentApprovedStatus ? 'отклонён' : 'одобрен'}`, 'success');

        } catch (error) {
            setReviews(reviews);
            console.error('Ошибка:', error);
            showNotification(`Ошибка изменения статуса отзыва: ${error.message}`, 'error');
        }
    };

    const handleAddImageByUrl = () => {
        const newImage = {
            url: imageUrl,
            isMain: productImages.length === 0
        };
        setProductImages(prev => [...prev, newImage]);
        if (productImages.length === 0) {
            setMainImageIndex(0);
        }
        setImageUrl('');
        showNotification('Изображение успешно добавлено', 'success');
    };

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
        showNotification('Изображение удалено', 'info');
    };

    const handleSetMainImage = (index) => {
        const newImages = productImages.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        setProductImages(newImages);
        setMainImageIndex(index);
        showNotification('Основное изображение изменено', 'success');
    };

    const handleUserEdit = (user) => {
        const userRole = userRoles.find(ur => ur.userId === user.id);
        setEditingUser({
            id: user.id,
            name: user.firstName || user.name || '',
            email: user.email,
            role: userRole ? rolesMap[userRole.roleId] : 'Неизвестная роль',
            roleId: userRole ? userRole.roleId : 3
        });
    };

    const handleUserSave = async () => {
        if (!editingUser) return;

        const userId = editingUser.id;
        const { name, email, roleId } = editingUser;

        try {
            const userResponse = await apiRequest(`/api/users/${userId}`, {
                method: 'PUT',
                body: {
                    FirstName: name,
                    Email: email
                },
                authenticated: true
            });

            const roleResponse = await apiRequest(`/api/userroles/${userId}`, {
                method: 'PUT',
                body: {
                    UserId: userId,
                    RoleId: roleId
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                authenticated: true
            });

            setUsers(users.map(u =>
                u.id === userId ? {
                    ...u,
                    firstName: name,
                    email: email
                } : u
            ));

            setUserRoles(userRoles.map(ur =>
                ur.userId === userId ? { ...ur, roleId } : ur
            ));

            setEditingUser(null);
            showNotification("Данные и роль пользователя успешно обновлены", 'success');

        } catch (error) {
            showNotification(`Ошибка при сохранении: ${error.message}`, 'error');
            console.error("Ошибка:", error);
        }
    };

    const handleUserDelete = async (userId) => {
        const userToDelete = users.find(u => u.id === userId);
        showConfirmation(
            "Удаление пользователя",
            `Вы уверены, что хотите удалить пользователя ${userToDelete?.firstName || userToDelete?.email || 'без имени'}?`,
            async () => {
                try {
                    setUsers(users.filter(u => u.id !== userId));
                    setUserRoles(userRoles.filter(ur => ur.userId !== userId));

                    await apiRequest(`/api/users/${userId}`, {
                        method: 'DELETE',
                        authenticated: true
                    });

                    showNotification("Пользователь успешно удалён", 'success');
                }
                catch (error) {
                    await fetchUsers();
                    await fetchUserRoles();

                    console.error("Ошибка при удалении:", error);
                    showNotification(`Ошибка при удалении: ${error.message}`, 'error');
                }
            }
        );
    };

    const handleReviewDelete = async (reviewId) => {
        const reviewToDelete = reviews.find(r => r.id === reviewId);
        showConfirmation(
            "Удаление отзыва",
            `Вы уверены, что хотите удалить отзыв от пользователя с оценкой ${reviewToDelete?.rating}?`,
            async () => {
                try {
                    const updatedReviews = reviews.filter(r => r.id !== reviewId);
                    setReviews(updatedReviews);

                    await apiRequest(`/api/reviews/${reviewId}`, {
                        method: 'DELETE',
                        authenticated: true
                    });

                    showNotification("Отзыв успешно удалён", 'success');
                }
                catch (error) {
                    setReviews(reviews);
                    console.error('Ошибка при удалении отзыва:', error);
                    showNotification(`Ошибка при удалении отзыва: ${error.message}`, 'error');
                }
            }
        );
    };

    const handleRoleChange = (e) => {
        const selectedRoleId = parseInt(e.target.value);
        setEditingUser({ ...editingUser, roleId: selectedRoleId });
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async () => {
        if (!isAuthenticated) {
            showNotification('Недостаточно прав для выполнения этой операции', 'error');
            return;
        }
        setIsLoading(true);
        try {
            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
                quantityInStock: parseInt(newProduct.quantityInStock),
                categoryId: parseInt(newProduct.categoryId),
                isActive: newProduct.isActive,
                rating: newProduct.rating ? parseFloat(newProduct.rating) : null
            };
            const createdProduct = await createProduct(productData);
            if (productImages.length > 0) {
                const imagesWithMainFlag = productImages.map((img, index) => ({
                    url: img.url,
                    isMain: index === mainImageIndex
                }));
                await addProductImages(createdProduct.id, imagesWithMainFlag);
            }
            showNotification(`Товар "${newProduct.name}" успешно добавлен!`, 'success');
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
        } catch (error) {
            console.error('Ошибка при добавлении товара:', error);
            showNotification(`Ошибка при добавлении товара: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchCategories(),
                    fetchUsers(),
                    fetchReviews(),
                    fetchUserRoles()
                ]);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                showNotification('Ошибка при загрузке данных', 'error');
            }
        };
        loadData();
    }, []);

    return (
        <div className={styles.profileCard}>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmationModal.onConfirm}
                title={confirmationModal.title}
                message={confirmationModal.message}
                confirmText="Удалить"
                cancelText="Отмена"
            />

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
                                    <label>Категория*</label>
                                    <select
                                        name="categoryId"
                                        value={newProduct.categoryId}
                                        onChange={handleProductInputChange}
                                        className={styles.formInput}
                                        required
                                        disabled={isLoading || categories.length === 0}
                                    >
                                        <option value="">Выберите категорию</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Изображения товара</label>
                                    <div className={styles.imageUploadContainer}>
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
                                {users.map(user => {
                                    const userRole = userRoles.find(ur => ur.userId === user.id);
                                    const currentRole = userRole ? rolesMap[userRole.roleId] : 'Неизвестная роль';

                                    return (
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
                                                    user.firstName || 'Без имени'
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
                                                        value={editingUser.roleId}
                                                        onChange={handleRoleChange}
                                                        className={styles.editSelect}
                                                    >
                                                        {Object.entries(rolesMap).map(([id, name]) => (
                                                            <option key={id} value={id}>{name}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    currentRole
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
                                    );
                                })}
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
                                <div key={review.id} className={`${styles.reviewItem} ${review.approved ? styles.approved : ''}`}>
                                    <div className={styles.reviewHeader}>
                                        <span className={styles.reviewHeaderText}>{review.header}</span>
                                        <span className={styles.reviewRating}>Оценка: {review.rating}/5</span>
                                        {review.approved && <span className={styles.approvedBadge}>✓ Одобрен</span>}
                                    </div>
                                    <div className={styles.reviewText}>{review.comment}</div>

                                    <div className={styles.reviewActions}>
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