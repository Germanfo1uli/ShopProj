using ShopBack.Models;

namespace ShopBack.Repositories 
{
    public interface IUsersRepository
    {
        Task<Users> GetByEmailAsync(string email); // Находит пользователя по email (для аутентификации)

        Task<Users> GetByUsernameAsync(string username); // Находит пользователя по username

        Task<bool> CheckPasswordAsync(int userId, string password); // Проверяет, совпадает ли пароль с хешем в БД

        Task<UserRoles> GetUserRolesAsync(int userId); // Получает роли пользователя (например, ["Admin", "User"])

        Task AddRefreshTokenAsync(RefreshTokens token); // Добавляет refresh-токен для "запомнить меня"

        Task<RefreshTokens> GetRefreshTokenAsync(string token); // Находит refresh-токен по строке токена
    }
}
