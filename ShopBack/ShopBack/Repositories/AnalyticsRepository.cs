using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class AnalyticsRepository(ShopDbContext context) : IAnalyticsRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task<IEnumerable<ProductViewsHistory>> GetProductViewHistoryAsync(int userId)
        {
            return await _context.ProductViewsHistory
                .Where(p => p.UserId == userId)
                .Include(pvh => pvh.Product)
                .GroupBy(pvh => new { pvh.UserId, pvh.ProductId })
                .Select(group => group
                    .OrderByDescending(pvh => pvh.ViewedAt)
                    .FirstOrDefault()!)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ProductViewsHistory?> GetLastViewAsync(int userId, int productId)
        {
            return await _context.ProductViewsHistory
                .Where(v => v.UserId == userId && v.ProductId == productId)
                .OrderByDescending(v => v.ViewedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<UserFavorites>> GetUserFavoritesAsync(int userId)
        {
            return await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<int> GetProductViewCountAsync(int productId)
        {
            return await _context.ProductViewsHistory
                .Where(pvh => pvh.ProductId == productId)
                .AsNoTracking()
                .CountAsync();
        }

        public async Task<int> GetFavoriteCountAsync(int productId)
        {
            return await _context.UserFavorites
                .Where(uf => uf.ProductId == productId)
                .AsNoTracking()
                .CountAsync();
        }

        public async Task<double> GetAverageProductRatingAsync(int productId)
        {
            return await _context.ProductReviews
                .Where(r => r.ProductId == productId && r.Rating >= 1 && r.Rating <= 5)
                .AsNoTracking()
                .AverageAsync(r => (double?)r.Rating) ?? 0.0;
        }

        public async Task<int> GetProductReviewCountAsync(int productId)
        {
            return await _context.ProductReviews
                .Where(r => r.ProductId == productId)
                .AsNoTracking()
                .CountAsync();
        }
    }
}
