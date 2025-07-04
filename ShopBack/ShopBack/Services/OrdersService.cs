using ShopBack.Data;
using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class OrdersService(IOrdersRepository repository) : Service<Orders>(repository)
    {
        private readonly IOrdersRepository _ordersRepository = repository;
      

        public async Task<Orders> GetUserCartOrderAsync(int userId)
        {
            var cart = await _ordersRepository.GetUserCartOrderAsync(userId);
            if (cart == null)
            {
                await _ordersRepository.CreateCart(userId);
                return await _ordersRepository.GetUserCartOrderAsync(userId);
            }

            return cart;
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