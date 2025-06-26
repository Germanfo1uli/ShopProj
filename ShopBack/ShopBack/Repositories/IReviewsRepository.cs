using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IReviewsRepository : IRepository<ProductReviews>

    {
        Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved = true); // Получает отзывы для товара (с фильтром модерации - только доступные)

        Task<IEnumerable<ProductReviews>> GetUserReviewsAsync(int userId); // Получает все отзывы пользователя
    }
}
