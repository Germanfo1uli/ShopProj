using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class AnalyticsService(IAnalyticsRepository analyticsRepository)
    {
        private readonly IAnalyticsRepository _analyticsRepository = analyticsRepository;

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
