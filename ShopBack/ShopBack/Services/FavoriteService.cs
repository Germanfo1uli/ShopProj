using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class FavoriteService(IFavoriteRepository favoriteRepository, IProductsRepository productsRepository)
    {
        private readonly IFavoriteRepository _favoriteRepository = favoriteRepository;
        private readonly IProductsRepository _productsRepository = productsRepository;

        public async Task AddAsync(UserFavorites userFavorites)
        {
            await _favoriteRepository.AddAsync(userFavorites);
        }

        public async Task DeleteAsync(int userId, int productId)
        {
            await _favoriteRepository.DeleteAsync(userId, productId);
        }

        public async Task<UserFavorites> GetByIdsAsync(int userId, int productId)
        {
            return await _favoriteRepository.GetByIdsAsync(userId, productId);
        }

        public async Task<IEnumerable<Products>> GetAllByUserIdAsync(int userId)
        {
            var favorites = await _favoriteRepository.GetAllByUserIdAsync(userId);
            ICollection<Products> products = [];
            foreach (var favorite in favorites)
            {
                products.Add(await _productsRepository.GetByIdAsync(favorite.ProductId));
            }
            return products;
        }
    }
}
