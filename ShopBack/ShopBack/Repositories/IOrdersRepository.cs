using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IOrdersRepository : IRepository<Orders>
    {
        Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId); // Получает все заказы пользователя

        Task<IEnumerable<OrderItems>> GetOrderItemsAsync(int orderId); // Получает все товары в заказе

        Task<Payments> GetOrderPaymentAsync(int orderId);  // Получает информацию об оплате заказа

        Task UpdateOrderStatusAsync(int orderId, string status); // Изменяет статус заказа ("Processing" → "Completed")


    }
}
