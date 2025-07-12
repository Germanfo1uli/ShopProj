using ShopBack.Models;

namespace ShopBack.Repositories 
{
    public interface IUsersRepository : IRepository<Users>
    {
        Task<Users?> GetByEmailAsync(string email); // Находит пользователя по email (для аутентификации)

        Task<UserRoles> GetUserRolesAsync(int userId); // Получает роли пользователя (например, ["Admin", "User"])

        Task DeleteUserRoleAsync(int userId, int roleId); // Удаляет роль пользователя
    }
}
