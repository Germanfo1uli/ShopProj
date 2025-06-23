namespace ShopBack.Repositories
{
    public interface IReadOnlyRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();

    }
}
