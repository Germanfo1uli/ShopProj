using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IOrdersRepository : IRepository<Orders>
    {
        Task CreateCart(int userId); // Создает новую корзину (Нужно для нового пользователя)

        Task<Orders> GetUserCartOrderAsync(int userId); // Получает корзину пользователя

        Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId); // Получает все заказы пользователя

        Task<Payments> GetOrderPaymentAsync(int orderId);  // Получает информацию об оплате заказа

        Task<(decimal saleSum, decimal sum)> GetOrderSumsAsync(int orderId);

        Task UpdateOrderStatusAsync(int orderId, string status); // Изменяет статус заказа ("Processing" → "Completed")
    }
}
