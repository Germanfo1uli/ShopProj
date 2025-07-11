using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IAnalyticsRepository
    {
        Task<IEnumerable<ProductViewsHistory>> GetProductViewHistoryAsync(int userId); // История просмотров пользователя

        Task<ProductViewsHistory?> GetLastViewAsync(int userId, int productId); // Получить последний просмотр товара

        Task<IEnumerable<UserFavorites>> GetUserFavoritesAsync(int userId); // Список избранного пользователя

        Task<int> GetProductViewCountAsync(int productId); // Количество просмотров товара

        Task<int> GetFavoriteCountAsync(int productId); // Количество добавлений в избранное

        Task<double> GetAverageProductRatingAsync(int productId); // Среднее значение рейтинга

        Task<int> GetProductReviewCountAsync(int productId); // Количество 
    }
}
