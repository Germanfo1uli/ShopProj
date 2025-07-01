using Microsoft.EntityFrameworkCore;
using ShopBack.Models;
using ShopBack.Data;

namespace ShopBack.Repositories
{
    public class OrdersRepository(ShopDbContext context) : IOrdersRepository
    {
        private readonly ShopDbContext _context = context;

        //override из IRepository
        public async Task<Orders> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Orders>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .OrderByDescending(o => o.OrderTime)
                .ToListAsync();
        }

        public async Task AddAsync(Orders order)
        {
            order.OrderTime ??= DateTime.UtcNow;
            order.CreatedAt ??= DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;
            order.Status ??= "Pending";

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Orders order)
        {
            order.UpdatedAt = DateTime.UtcNow;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Orders.FindAsync(id);
            _context.Orders.Remove(entity);
            await _context.SaveChangesAsync();
        }

        //Новые методы
        public async Task<IEnumerable<Orders>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItem)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .OrderByDescending(o => o.OrderTime)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderItems>> GetOrderItemsAsync(int orderId)
        {
            return await _context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .Include(oi => oi.Product)
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

    }
}