using ShopBack.Data;
using ShopBack.Models;
using Microsoft.EntityFrameworkCore;

namespace ShopBack.Repositories
{
    public class UsersRepository : Repository<Users>, IUsersRepository
    {
        public UsersRepository(ShopDbContext context) : base(context)
        {
        }

        public async Task<Users> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserRoles> GetUserRolesAsync(int userId)
        {
            return await _context.UserRoles
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == userId);
        }
    }
}
