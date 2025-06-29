using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class CategoriesService(ICategoriesRepository repository) : Service<Categories>(repository)
    {
        private readonly ICategoriesRepository _categoriesRepository = repository;

        public async Task<IEnumerable<Categories>> GetParentCategoriesAsync()
        {
            return await _categoriesRepository.GetParentCategoriesAsync();
        }

        public async Task<IEnumerable<Categories>> GetChildCategoriesAsync(int parentId)
        {
            return await _categoriesRepository.GetChildCategoriesAsync(parentId);
        }
    }
}

