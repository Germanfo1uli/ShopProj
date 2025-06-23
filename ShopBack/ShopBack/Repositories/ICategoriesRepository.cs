using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface ICategoriesRepository : IRepository<Categories> //Наследование методов IRepository + расширение 
    {
        Task<IEnumerable<Categories>> GetParentCategoriesAsync();
        Task<IEnumerable<Categories>> GetChildCategoriesAsync(int parentId);
    }
}
