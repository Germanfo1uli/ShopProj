import { useState } from 'react';
// import styles from '../../CSS/Profile.module.css';
import styles from '../../CSS/ProfileCSS/Addresses.module.css';

const Addresses = () => {
    const [showAddressList, setShowAddressList] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const predefinedAddresses = [
        {
            id: 1,
            street: "ул. Ленина, 10",
            city: "Москва",
            description: "Прям в Кремле"
        },
        {
            id: 2,
            street: "пр. Победы, 25",
            city: "Санкт-Петербург",
            description: "В подвале деда Никиты"
        },
        {
            id: 3,
            street: "ул. Гагарина, 42",
            city: "Колыма",
            description: "Уж лучше вы к нам"
        },
        {
            id: 4,
            street: "ул. Садовая, 7",
            city: "Екатеринбург",
            description: "Флагманский магазин"
        },
        {
            id: 5,
            street: "ул. Мира, 15",
            city: "Новосибирск",
            description: "СИБГУТИИ"
        }
    ];

    const handleAddAddress = () => {
        setShowAddressList(!showAddressList);
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressList(false);
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
                <h1 className={styles.cardTitle}>Адреса доставки (Заглушка)</h1>
                <button
                    className={styles.editButton}
                    onClick={handleAddAddress}
                >
                    <i className={`fas ${selectedAddress ? 'fa-edit' : 'fa-plus'}`}></i>
                    {selectedAddress ? "Изменить адрес" : "Добавить адрес"}
                </button>
            </div>

            {!selectedAddress && !showAddressList && (
                <div className={styles.emptyState}>
                    <i className="fas fa-map-marker-alt"></i>
                    <p>У вас нет сохраненных адресов</p>
                </div>
            )}

            {selectedAddress && (
                <div className={styles.addressCard}>
                    <div className={styles.addressHeader}>
                        <i className="fas fa-map-marker-alt"></i>
                        <h3>Выбранный адрес</h3>
                    </div>
                    <div className={styles.addressDetails}>
                        <p className={styles.addressStreet}>{selectedAddress.street}</p>
                        <p className={styles.addressCity}>{selectedAddress.city}</p>
                        <p className={styles.addressDescription}>{selectedAddress.description}</p>
                    </div>
                </div>
            )}

            {showAddressList && (
                <div className={styles.addressListContainer}>
                    <div className={styles.addressList}>
                        <div className={styles.listHeader}>
                            <h3>Выберите адрес доставки</h3>

                        </div>
                        <ul>
                            {predefinedAddresses.map(address => (
                                <li
                                    key={address.id}
                                    className={styles.addressItem}
                                    onClick={() => handleSelectAddress(address)}
                                >
                                    <div className={styles.addressIcon}>
                                        <i className="fas fa-store"></i>
                                    </div>
                                    <div className={styles.addressInfo}>
                                        <p className={styles.addressStreet}>{address.street}</p>
                                        <p className={styles.addressCity}>{address.city}</p>
                                        <p className={styles.addressDescription}>{address.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Addresses;