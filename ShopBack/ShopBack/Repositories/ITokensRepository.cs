using ShopBack.Models;
using System.Security.Claims;

namespace ShopBack.Repositories
{
    public interface ITokensRepository : IRepository<RefreshTokens>
    {
        Task<TokenPair> GenerateTokensAsync(Users user, string roleName); // Генерирует 2 токена

        Task<ClaimsPrincipal?> ValidateJwtTokenAsync(string token); // Валидует и извлекает данные из JWT

        Task<RefreshTokens> GetRefreshTokenAsync(string token); // Находит refresh-токен по строке токена

        Task<ICollection<RefreshTokens>> GetRefreshTokensUserAsync(int userId); // Находит все токены одного пользователя

        Task RevokeRefreshTokenAsync(string token); // Отзывает рефреш - токен

        Task RevokeRefreshTokensUserAsync(int userId, string token); // Отозвать все токены, кроме текущего у пользователя

        Task<Users> GetUserByTokenAsync(string token); // Получает id пользователя по токену

        Task<bool> IsRefreshTokenValidAsync(string token); // Валидует рефреш - токен

        string GenerateJwtToken(Users user, string roleName);

        Task<RefreshTokens> GenerateRefreshTokenAsync(int userId);
    }
    public class TokenPair
    {
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpires { get; set; }
    }
}
