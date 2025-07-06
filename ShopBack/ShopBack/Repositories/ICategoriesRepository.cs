using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface ICategoriesRepository : IRepository<Categories>
    {
        Task<IEnumerable<Categories>> GetParentCategoriesAsync();
    }
}
