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
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Categories>> GetAllAsync()
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.ChildCategories)
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

        public async Task DeleteAsync(Categories entity)
        {
            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Categories>> GetParentCategoriesAsync()
        {
            return await _context.Categories
                .Where(c => c.ParentCategoryId == null)
                .Include(c => c.ChildCategories)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<IEnumerable<Categories>> GetChildCategoriesAsync(int parentId)
        {
            return await _context.Categories
                .Where(c => c.ParentCategoryId == parentId)
                .Include(c => c.ParentCategory)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }
    }
}
