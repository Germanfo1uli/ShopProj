using Microsoft.EntityFrameworkCore.Storage;
using ShopBack.Data;

namespace ShopBack.Repositories
{
    public class UnitOfWork(ShopDbContext context) : IUnitOfWork // Класс транзакции, нужен чтобы проводить
                                                                 // массовые изменения в БД с откатом изменений
    {
        private readonly ShopDbContext _context = context;

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync(IDbContextTransaction transaction)
        {
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }

        public async Task RollbackAsync(IDbContextTransaction transaction)
        {
            await transaction.RollbackAsync();
        }
    }
}
