using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IProductsRepository 
    {
        Task<IEnumerable<Products>> GetByCategoryAsync(int categoryId); // Получает товары по ID категории
        Task<IEnumerable<Products>> SearchAsync(string searchTerm); // Поиск товаров по названию/описанию
        Task<IEnumerable<ProductImages>> GetProductImagesAsync(int productId); // Получает все изображения для конкретного товара
        Task<IEnumerable<ProductSpecifications>> GetProductSpecificationsAsync(int productId); // Получает все характеристики товара
        Task<ProductImages> GetProductMainImageAsync(int productId); // Получает основную картинку товара
    }
}
