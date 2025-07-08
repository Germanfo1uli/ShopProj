using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IOrdersRepository : IRepository<Orders>
    {
        Task<Orders> GetByIdNoTrackingAsync(int id); // Получить по айди без трекинга

        Task CreateCart(int userId); // Создает новую корзину (Нужно для нового пользователя)

        Task<Orders> GetUserCartOrderAsync(int userId); // Получает корзину пользователя

        Task<int> GetUserCartOrderIdAsync(int userId); // Получает айди корзины пользователя

        Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId); // Получает все заказы пользователя

        Task<Payments> GetOrderPaymentAsync(int orderId);  // Получает информацию об оплате заказа

        Task<decimal> GetOrderSumSaleAsync(int orderId); // Получает сумму заказа со скидками

        Task<decimal> GetOrderSumAsync(int orderId); // Получает сумму заказа без скидок

        Task AssignmentOrderPrice(int orderId, decimal sumSale, decimal sum); // Присваивает значения сумм заказу

        Task UpdateOrderStatusAsync(int orderId, string status); // Изменяет статус заказа ("Processing" → "Completed")

        Task <IEnumerable<OrderItems>> GetOrderItemsByOrderIdAsync(int orderId); // Получает все товары в заказе
    }
}
