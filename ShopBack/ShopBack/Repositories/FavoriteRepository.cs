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
            var favorite = await _context.UserFavorites.FindAsync(userId, productId) ?? throw new KeyNotFoundException($"Сущность не найдена");
            _context.UserFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<UserFavorites> GetByIdsAsync(int userId, int productId)
        {
            return await _context.UserFavorites.FindAsync(userId, productId) ?? throw new KeyNotFoundException($"Сущность не найдена");
        }

        public async Task<IEnumerable<UserFavorites>> GetAllByUserIdAsync(int userId)
        {
            return await _context.UserFavorites
                .Where(uf => uf.UserId == userId)
                .Include(uf => uf.Product)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
