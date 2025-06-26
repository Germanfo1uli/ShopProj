using ShopBack.Data;
using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class OrdersService(OrdersRepository repository) : Service<Orders>(repository)
    {
        private readonly OrdersRepository _ordersRepository = repository;
      

        public async Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId)
        {
            return await _ordersRepository.GetUserOrdersAsync(userId);
        }

        public async Task<IEnumerable<OrderItems>> GetOrderItemsAsync(int orderId)
        {
            return await _ordersRepository.GetOrderItemsAsync(orderId);
        }

        public async Task<Payments?> GetOrderPaymentAsync(int orderId)
        {
            return await _ordersRepository.GetOrderPaymentAsync(orderId);
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            await _ordersRepository.UpdateOrderStatusAsync(orderId, status);
        }
    }
}