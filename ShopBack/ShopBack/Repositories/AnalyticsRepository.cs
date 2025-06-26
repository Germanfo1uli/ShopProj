using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class AnalyticsRepository(ShopDbContext context) : IAnalyticsRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task<IEnumerable<ProductViewsHistory>> GetProductViewHistoryAsync(int productId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = _context.ProductViewsHistory
                .Where(p => p.ProductId == productId);

            if (fromDate.HasValue)
            {
                query = query.Where(pvh => pvh.ViewedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(pvh => pvh.ViewedAt <= toDate.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<UserFavorites>> GetUserFavoritesAsync(int userId)
        {
            return await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .ToListAsync();
        }

        public async Task<int> GetProductViewCountAsync(int productId)
        {
            return await _context.ProductViewsHistory
                .Where(pvh => pvh.ProductId == productId)
                .CountAsync();
        }

        public async Task<int> GetFavoriteCountAsync(int productId)
        {
            return await _context.UserFavorites
                .Where(uf => uf.ProductId == productId)
                .CountAsync();
        }
    }
}
