using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class PayMethodsRepository : Repository<PayMethods>, IPayMethodsRepository
    {
        public PayMethodsRepository(ShopDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PayMethods>> GetByUserIdAsync(int userId)
        {
            return await _context.PayMethods
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }
    }
}
