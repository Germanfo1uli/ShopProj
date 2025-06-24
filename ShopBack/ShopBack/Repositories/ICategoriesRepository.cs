using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface ICategoriesRepository : IRepository<Models.Categories> //Наследование методов IRepository + расширение 
    {
        Task<IEnumerable<Models.Categories>> GetParentCategoriesAsync();
        Task<IEnumerable<Models.Categories>> GetChildCategoriesAsync(int parentId);
    }
}
