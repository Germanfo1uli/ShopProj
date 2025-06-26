using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IAnalyticsRepository
    {
        Task<IEnumerable<ProductViewsHistory>> GetProductViewHistoryAsync(int productId, DateTime? fromDate = null, DateTime? toDate = null); // История просмотров товара (с фильтром по дате)
        
        Task<IEnumerable<UserFavorites>> GetUserFavoritesAsync(int userId); // Список избранного пользователя

        Task<int> GetProductViewCountAsync(int productId); // Количество просмотров товара

        Task<int> GetFavoriteCountAsync(int productId); // Количество добавлений в избранное

        Task<double> GetAverageProductRatingAsync(int productId); // Среднее значение рейтинга

        Task<int> GetProductReviewCountAsync(int productId); // Количество 
    }
}
