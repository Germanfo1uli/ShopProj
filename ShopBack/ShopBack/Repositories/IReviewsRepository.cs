using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IReviewsRepository

    {
        Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved = true); // Получает отзывы для товара (с фильтром модерации - только доступные)

        Task<IEnumerable<ProductReviews>> GetUserReviewsAsync(int userId); // Получает все отзывы пользователя

        Task ApproveReviewAsync(int reviewId, int moderatorId, string? comment = null); // Одобряет отзыв (модерация)

        Task RejectReviewAsync(int reviewId, int moderatorId, string? comment = null); // Отклоняет отзыв (модерация)
    }
}
