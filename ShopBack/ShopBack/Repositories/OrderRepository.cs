using Microsoft.EntityFrameworkCore;
using ShopBack.Models;
using ShopBack.Data;

namespace ShopBack.Repositories
{
    public class OrdersRepository(ShopDbContext context) : IOrdersRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task<Orders> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id)
                ?? throw new KeyNotFoundException($"Заказ с ID {id} не найден");
        }

        public async Task<IEnumerable<Orders>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .OrderByDescending(o => o.OrderTime)
                .ToListAsync();
        }

        public async Task AddAsync(Orders order)
        {
            order.OrderTime = null;
            order.CreatedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Orders order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Orders.FindAsync(id);
            _context.Orders.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task CreateCart(int userId)
        {
            var order = new Orders
            {
                UserId = userId,
                Status = "Cart"
            };
            await AddAsync(order);
        }

        public async Task<Orders> GetUserCartOrderAsync(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Cart");
        }

        public async Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId && o.Status != "Cart")
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .ToListAsync();
        }

        public async Task<Payments> GetOrderPaymentAsync(int orderId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.OrderId == orderId);
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        public async Task<(decimal saleSum, decimal sum)> GetOrderSumsAsync(int orderId)
        {
            var saleSum = await _context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .SumAsync(oi => oi.Quantity * oi.Product.Price);

            var originalSum = await _context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .SumAsync(oi => oi.Quantity * (oi.Product.OldPrice ?? oi.Product.Price));

            return (saleSum, originalSum);
        }
    }
}