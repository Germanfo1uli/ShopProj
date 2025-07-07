using ShopBack.Models;

namespace ShopBack.Repositories
{
    public interface IPayMethodsRepository : IRepository<PayMethods>
    {
        Task<IEnumerable<PayMethods>> GetByUserIdAsync(int userId);
    }
}
