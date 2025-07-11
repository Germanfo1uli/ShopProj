using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class PayMethodsRepository(ShopDbContext context) : Repository<PayMethods>(context), IPayMethodsRepository
    {
        public async Task<IEnumerable<PayMethods>> GetByUserIdAsync(int userId)
        {
            return await _context.PayMethods
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }
    }
}
