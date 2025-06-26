using ShopBack.Data;
using ShopBack.Models;
using Microsoft.EntityFrameworkCore;

namespace ShopBack.Repositories
{
    public class UserRepository(ShopDbContext context) : IUsersRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task<Users> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task<Users> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<bool> CheckPasswordAsync(int userId, string password)
        {
            var user = await _context.Users.FindAsync(userId);
            return user != null;
        }

        public async Task<UserRoles> GetUserRolesAsync(int userId)
        {
            return await _context.UserRoles
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == userId);
        }

        public async Task AddRefreshTokenAsync(RefreshTokens token)
        {
            await _context.RefreshTokens.AddAsync(token);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshTokens> GetRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == token);
        }
    }
}
