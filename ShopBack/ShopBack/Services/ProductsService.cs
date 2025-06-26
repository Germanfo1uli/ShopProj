using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class ProductsService(ProductsRepository repository) : Service<Products>((IRepository<Products>)repository)
    {
        private readonly ProductsRepository _productsRepository = repository;

        public async Task<IEnumerable<Products>> GetByCategoryAsync(int categoryId)
        {
            return await _productsRepository.GetByCategoryAsync(categoryId);
        }

        public async Task<IEnumerable<Products>> SearchAsync(string searchTerm)
        {
            return await _productsRepository.SearchAsync(searchTerm);
        }

        public async Task<IEnumerable<ProductImages>> GetProductImagesAsync(int productId)
        {
            return await _productsRepository.GetProductImagesAsync(productId);
        }

        public async Task<IEnumerable<ProductSpecifications>> GetProductSpecificationsAsync(int productId)
        {
            return await _productsRepository.GetProductSpecificationsAsync(productId);
        }

        public async Task<ProductImages?> GetProductMainImageAsync(int productId)
        {
            return await _productsRepository.GetProductMainImageAsync(productId);
        }
    }
}
