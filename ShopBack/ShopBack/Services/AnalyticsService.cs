using Microsoft.EntityFrameworkCore;
using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class AnalyticsService(IAnalyticsRepository analyticsRepository, IRepository<ProductViewsHistory> viewsRepository)
    {
        private readonly IAnalyticsRepository _analyticsRepository = analyticsRepository;
        private readonly IRepository<ProductViewsHistory> _viewsRepository = viewsRepository;
        private readonly TimeSpan _viewCooldown = TimeSpan.FromMinutes(3);

        public async Task CreateOrUpdateAsync(ProductViewsHistory view)
        {
            var lastView = await _analyticsRepository.GetLastViewAsync(view.UserId, view.ProductId);

            // Если есть недавний просмотр (менее 3 минут назад) - обновляем время
            if (lastView != null && DateTime.UtcNow - lastView.ViewedAt < _viewCooldown)
            {
                lastView.ViewedAt = DateTime.UtcNow;
                await _viewsRepository.UpdateAsync(lastView);
                return;
            }

            await _viewsRepository.AddAsync(view);
        }

        public async Task<IEnumerable<ProductViewsHistory>> GetProductViewHistoryAsync(int userId)
        {
            return await _analyticsRepository.GetProductViewHistoryAsync(userId);
        }

        public async Task<(int ViewCount, int FavoriteCount)> GetProductStatsAsync(int productId)
        {
            var viewCount = await _analyticsRepository.GetProductViewCountAsync(productId);
            var favoriteCount = await _analyticsRepository.GetFavoriteCountAsync(productId);
            return (viewCount, favoriteCount);
        }

        public async Task<(double AverageRating, int ReviewCount)> GetReviewStatsAsync(int productId)
        {
            var avgRating = await _analyticsRepository.GetAverageProductRatingAsync(productId);
            var reviewCount = await _analyticsRepository.GetProductReviewCountAsync(productId);
            return (avgRating, reviewCount);
        }
    }
}
