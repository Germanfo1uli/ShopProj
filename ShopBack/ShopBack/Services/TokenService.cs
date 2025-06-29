using ShopBack.Repositories;
using ShopBack.Models;
using System.Security.Claims;

namespace ShopBack.Services
{
    public class TokenService(ITokensRepository tokensRepository) : Service<RefreshTokens>(tokensRepository)
    {
        private readonly ITokensRepository _tokensRepository = tokensRepository;

        public async Task<TokenPair> GenerateTokensAsync(Users user, string roleName)
        {

            return await _tokensRepository.GenerateTokensAsync(user, roleName);
        }

        public async Task<ClaimsPrincipal?> ValidateJwtTokenAsync(string token)
        {
            return await _tokensRepository.ValidateJwtTokenAsync(token);
        }

        public async Task<bool> IsRefreshTokenValidAsync(string token)
        {
            return await _tokensRepository.IsRefreshTokenValidAsync(token);
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            await _tokensRepository.RevokeRefreshTokenAsync(token);
        }

        public async Task RevokeRefreshTokensUserAsync(int userId, string token)
        {
            await _tokensRepository.RevokeRefreshTokensUserAsync(userId, token);
        }

        public async Task<Users> GetUserByTokenAsync(string token)
        {
            return await _tokensRepository.GetUserByTokenAsync(token);
        }

        public async Task<RefreshTokens?> GetRefreshTokenAsync(string token)
        {
            return await _tokensRepository.GetRefreshTokenAsync(token);
        }
    }
}
