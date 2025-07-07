using Microsoft.EntityFrameworkCore.Storage;

namespace ShopBack.Repositories
{
    public interface IUnitOfWork // Интерфейс транзакции
    {
        Task<IDbContextTransaction> BeginTransactionAsync(); // Начало транзакции
        Task CommitAsync(IDbContextTransaction transaction); // Сохранение данных транзакции
        Task RollbackAsync(IDbContextTransaction transaction); // Откат изменений транзакции
    }
}
