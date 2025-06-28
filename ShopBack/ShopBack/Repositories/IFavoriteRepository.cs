using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IFavoriteRepository
    {
        Task AddAsync(UserFavorites userFavorite);
        Task DeleteAsync(int userId, int productId);
        Task<IEnumerable<UserFavorites>> GetAllByUserIdAsync(int userId);
    }
}
