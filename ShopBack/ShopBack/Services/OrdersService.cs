using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class OrdersService(IOrdersRepository repository, 
                               IProductsRepository productsRepository, 
                               IRepository<OrderItems> orderItemsRepository,
                               IUnitOfWork unitOfWork) : Service<Orders>(repository)
    {
        private readonly IOrdersRepository _ordersRepository = repository;
        private readonly IProductsRepository _productsRepository = productsRepository;
        private readonly IRepository<OrderItems> _orderItemsRepository = orderItemsRepository;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
      
        public async Task<Orders> GetUserCartOrderAsync(int userId)
        {
            return await _ordersRepository.GetUserCartOrderAsync(userId); ;
        }

        public async Task<int> GetUserCartOrderIdAsync(int userId)
        {
            return await _ordersRepository.GetUserCartOrderIdAsync(userId);
        }

        public async Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId)
        {
            var cart = await _ordersRepository.GetUserOrdersAsync(userId);
            return cart;
        }

        public async Task<Payments?> GetOrderPaymentAsync(int orderId)
        {
            return await _ordersRepository.GetOrderPaymentAsync(orderId);
        }

        public async Task<Orders> PayOrderAsync(int orderId) // Бронирование заказа в корзине
        {
            var order = await _ordersRepository.GetByIdNoTrackingAsync(orderId);
            if (order.Status == "Paid")
                throw new InvalidOperationException("Заказ уже забронирован");

            var orderItems = await _ordersRepository.GetOrderItemsByOrderIdAsync(orderId);

            foreach (var item in orderItems)
            {
                if (item.Product == null)
                    throw new InvalidOperationException($"Товар с ID {item.ProductId} не найден");

                if (item.Product.QuantityInStock < item.Quantity)
                    throw new InvalidOperationException(
                        $"Недостаточно товара {item.Product.Name} на складе. Доступно: {item.Product.QuantityInStock}, требуется: {item.Quantity}");

                item.Product.QuantityInStock -= item.Quantity;
                await _productsRepository.UpdateAsync(item.Product);
            }

            await UpdateOrderStatusAsync(orderId, "Paid");
            await _ordersRepository.CreateCart(order.UserId);
            order.Status = "Paid";
            return order;
        }

        public async Task ClearCartAsync(int userId)
        {
            var orderId = await GetUserCartOrderIdAsync(userId);
            var order = await GetByIdAsync(orderId);
            foreach ( var item in order.OrderItem)
            {
                await _orderItemsRepository.DeleteAsync(item.Id);
            }    
            await RecalculateTotalAmountAsync(userId);
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            await _ordersRepository.UpdateOrderStatusAsync(orderId, status);
        }

        public async Task RecalculateTotalAmountAsync(int orderId)
        {
            var saleSum = await _ordersRepository.GetOrderSumSaleAsync(orderId);
            var sum = await _ordersRepository.GetOrderSumAsync(orderId);
            await _ordersRepository.AssignmentOrderPrice(orderId, saleSum, sum);
        }
    }
}