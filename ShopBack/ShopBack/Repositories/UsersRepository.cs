using ShopBack.Data;
using ShopBack.Models;
using Microsoft.EntityFrameworkCore;

namespace ShopBack.Repositories
{
    public class UsersRepository(ShopDbContext context) : Repository<Users>(context), IUsersRepository
    {
        public async Task<Users?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserRoles> GetUserRolesAsync(int userId)
        {
            return await _context.UserRoles
                .Include(ur => ur.Role)
                .AsNoTracking()
                .FirstOrDefaultAsync(ur => ur.UserId == userId)
                ?? throw new KeyNotFoundException($"Роль пользователя с ID {userId} не найдена");
        }

        public async Task DeleteUserRoleAsync(int userId, int roleId)
        {
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == userId)
                ?? throw new KeyNotFoundException($"Роль пользователя с ID {userId} не найдена");
            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();
        }
    }
}
