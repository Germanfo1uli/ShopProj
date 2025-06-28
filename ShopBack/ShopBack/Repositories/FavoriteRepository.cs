using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class FavoriteRepository(ShopDbContext context) : IFavoriteRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task AddAsync(UserFavorites userFavorite)
        {
            await _context.UserFavorites.AddAsync(userFavorite);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int userId, int productId)
        {
            var favorite = await _context.UserFavorites.FindAsync(userId, productId);

            if (favorite == null)
            {
                throw new KeyNotFoundException($"Сущность не найдена");
            }

            _context.UserFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<UserFavorites>> GetAllByUserIdAsync(int userId)
        {
            return await _context.UserFavorites
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }
    }
}
