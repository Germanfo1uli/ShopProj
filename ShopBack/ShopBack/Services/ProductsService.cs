using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class ProductsService(IProductsRepository repository) : Service<Products>(repository)
    {
        private readonly IProductsRepository _productsRepository = repository;

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

        public async Task<IEnumerable<Products>> GetInactiveProductsAsync()
        {
            return await _productsRepository.GetInactiveProductsAsync();
        }

        public async Task RecalculateRating(int productId, decimal rating, int numReviews)
        {
            var product = await GetByIdAsync(productId);
            product.Rating = rating;
            product.ReviewsNumber = numReviews;
            await UpdateAsync(product);
        }
    }
}
