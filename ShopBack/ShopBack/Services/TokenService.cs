using ShopBack.Repositories;
using ShopBack.Models;
using System.Security.Claims;

namespace ShopBack.Services
{
    public class TokenService(ITokensRepository tokensRepository,
                              IRepository<UserRoles> userRoleRepository,
                              IRepository<Roles> roleRepository) : Service<RefreshTokens>(tokensRepository)
    {
        private readonly ITokensRepository _tokensRepository = tokensRepository;
        private readonly IRepository<UserRoles> _userRoleRepository = userRoleRepository;
        private readonly IRepository<Roles> _roleRepository = roleRepository;

        public async Task<TokenPair> GenerateTokensAsync(Users user)
        {
            var userRoles = await _userRoleRepository.GetAllAsync();
    
            var userRole = userRoles.FirstOrDefault(ur => ur.UserId == user.Id);

            if (userRole == null)
            {
                userRole = new UserRoles
                {
                    UserId = user.Id,
                    RoleId = 3
                };
                await _userRoleRepository.AddAsync(userRole);
            }

            var roleName = await _roleRepository.GetByIdAsync(userRole.RoleId);
            return await _tokensRepository.GenerateTokensAsync(user, roleName.Name);
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
