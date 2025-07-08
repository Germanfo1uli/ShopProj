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
                .Include(o => o.Payment)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id)
                ?? throw new KeyNotFoundException($"Заказ с ID {id} не найден");
        }

        public async Task<Orders> GetByIdNoTrackingAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id)
                ?? throw new KeyNotFoundException($"Заказ с ID {id} не найден");
        }

        public async Task<IEnumerable<Orders>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                    .AsNoTracking()
                .Include(o => o.Payment)
                .AsNoTracking()
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
            var entity = await _context.Orders.FindAsync(id)
                ?? throw new KeyNotFoundException($"Заказ с ID {id} не найден");
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
            var order = await _context.Orders
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Cart");
            if (order == null)
            {
                await CreateCart(userId);
                return await GetUserCartOrderAsync(userId);
            }
            return order;
        }

        public async Task<int> GetUserCartOrderIdAsync(int userId)
        {
            var order = await _context.Orders
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.UserId == userId && o.Status == "Cart");
            if (order == null)
            {
                await CreateCart(userId);
                return await GetUserCartOrderIdAsync(userId);
            }
            return order.Id;
        }

        public async Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId && o.Status != "Cart")
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                    .AsNoTracking()
                .Include(o => o.Payment)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Payments> GetOrderPaymentAsync(int orderId)
        {
            return await _context.Payments
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.OrderId == orderId)
                ?? throw new KeyNotFoundException($"Оплата с ID {orderId} не найдена");
        }

        public async Task UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders.FindAsync(orderId)
                ?? throw new KeyNotFoundException($"Заказ с ID {orderId} не найден");
            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }
        public async Task<decimal> GetOrderSumSaleAsync(int orderId)
        {
            return await _context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .AsNoTracking()
                .SumAsync(oi => oi.Quantity * oi.Product.Price);
        }

        public async Task<decimal> GetOrderSumAsync(int orderId)
        {
            return await _context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .AsNoTracking()
                .SumAsync(oi => oi.Quantity * (oi.Product.OldPrice ?? oi.Product.Price));
        }

        public async Task AssignmentOrderPrice(int orderId, decimal saleSum, decimal sum)
        {
            var order = await GetByIdNoTrackingAsync(orderId);

            order.TotalAmount = saleSum;
            order.AmountWOSale = sum;
            order.UpdatedAt = DateTime.UtcNow;

            await UpdateAsync(order);
        }
    }
}