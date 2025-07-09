using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IReviewsRepository : IRepository<ProductReviews>

    {
        Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved); // Получает отзывы для товара (с фильтром модерации - только доступные)

        Task<IEnumerable<ProductReviews>> GetUserReviewsAsync(int userId); // Получает все отзывы пользователя

        Task<ProductReviews> FindAsync(int userId, int productId); // Поиск ревью по данным для проверки, существует ли уже такой отзыв 
    }
}
