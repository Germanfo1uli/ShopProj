import React from 'react';
import styles from '../../CSS/LoadingSpinner.module.css';
import { FaExclamationTriangle, FaBoxOpen } from 'react-icons/fa';

const LoadingSpinner = ({ message = "Загружаем данные...", status = "loading" }) => {
    return (
        <div className={styles.loadingOverlay}>
            {status === "loading" && (
                <>
                    <div className={styles.bouncingLoader}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p className={styles.loadingMessage}>{message}</p>
                </>
            )}

            {status === "error" && (
                <div className={styles.errorState}>
                    <FaExclamationTriangle className={styles.errorIcon} />
                    <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
                    <p className={styles.errorMessage}>{message || "Не удалось загрузить данные"}</p>
                    <button
                        className={styles.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {status === "empty" && (
                <div className={styles.emptyState}>
                    <FaBoxOpen className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>Товары не найдены</h3>
                    <p className={styles.emptyMessage}>Попробуйте изменить параметры поиска</p>
                </div>
            )}
        </div>
    );
};

export default LoadingSpinner;