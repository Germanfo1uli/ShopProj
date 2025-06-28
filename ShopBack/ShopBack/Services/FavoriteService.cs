using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class FavoriteService(IFavoriteRepository favoriteRepository)
    {
        private readonly IFavoriteRepository _favoriteRepository = favoriteRepository;

        public async Task AddAsync(UserFavorites userFavorites)
        {
            await _favoriteRepository.AddAsync(userFavorites);
        }

        public async Task DeleteAsync(int userId, int productId)
        {
            await _favoriteRepository.DeleteAsync(userId, productId);
        }

        public async Task<IEnumerable<UserFavorites>> GetAllByUserIdAsync(int userId)
        {
            return await _favoriteRepository.GetAllByUserIdAsync(userId);
        }
    }
}
