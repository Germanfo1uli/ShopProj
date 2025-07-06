using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class CategoriesRepository(ShopDbContext context) : ICategoriesRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task<Categories> GetByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.ChildCategories)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id) ??
                throw new KeyNotFoundException($"Категория с ID {id} не найдена");
        }

        public async Task<IEnumerable<Categories>> GetAllAsync()
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.ChildCategories)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(Categories entity)
        {
            await _context.Categories.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Categories entity)
        {
            _context.Categories.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Categories.FindAsync(id) ?? throw new KeyNotFoundException($"Категория с ID {id} не найдена");
            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Categories>> GetParentCategoriesAsync()
        {
            return await _context.Categories
                .Where(c => c.ParentCategoryId == null)
                .Include(c => c.ChildCategories)
                .OrderBy(c => c.Name)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
