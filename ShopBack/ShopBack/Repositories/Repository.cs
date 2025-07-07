using ShopBack.Data;
using Microsoft.EntityFrameworkCore;

namespace ShopBack.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ShopDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ShopDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id) ?? throw new KeyNotFoundException($"Сущность с ID {id} не найдена");
            return entity;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id) ?? throw new KeyNotFoundException($"Сущность с ID {id} не найдена");
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
