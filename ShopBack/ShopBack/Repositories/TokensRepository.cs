using ShopBack.Data;
using ShopBack.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

namespace ShopBack.Repositories
{
    public class TokensRepository(ShopDbContext context, IConfiguration configuration) : Repository<RefreshTokens>(context), ITokensRepository
    {
        private readonly IConfiguration _configuration = configuration;

        public async Task<TokenPair> GenerateTokensAsync(Users user, string roleName)
        {
            var jwtToken = GenerateJwtToken(user, roleName);
            var refreshToken = await GenerateRefreshTokenAsync(user.Id);

            return new TokenPair
            {
                JwtToken = jwtToken,
                RefreshToken = refreshToken.Token,
                RefreshTokenExpires = refreshToken.Expires
            };
        }

        public ClaimsPrincipal? ValidateJwtTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var secret = _configuration["Jwt:Secret"];
                if (string.IsNullOrEmpty(secret))
                {
                    throw new InvalidOperationException("JWT Secret is not configured");
                }
                var key = Encoding.ASCII.GetBytes(secret);

                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out _);

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public async Task<RefreshTokens> GetRefreshTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.Token == token)
                ?? throw new KeyNotFoundException($"Токена не существует");
        }

        public async Task<ICollection<RefreshTokens>> GetRefreshTokensUserAsync(int userId)
        {
            return await _context.RefreshTokens
                .Where(rt => rt.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            var refreshToken = await GetRefreshTokenAsync(token);
            if (refreshToken.Revoked != null)
            {
                throw new UnauthorizedAccessException($"Токен отозван");
            }
            refreshToken.Revoked = DateTime.UtcNow;
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task<Users> GetUserByTokenAsync(string token)
        {
            var refreshToken = await GetRefreshTokenAsync(token);
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == refreshToken.UserId)
                ?? throw new KeyNotFoundException($"Пользователя не существует");
        }

        public async Task RevokeRefreshTokensUserAsync(int userId, string token)
        {
            var refreshTokens = await GetRefreshTokensUserAsync(userId);
            foreach (var item in refreshTokens)
            {
                if (item.Token != token && item.Token != null)
                {
                    item.Revoked = DateTime.UtcNow;
                    _context.RefreshTokens.Update(item);
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsRefreshTokenValidAsync(string token)
        {
            var refreshToken = await GetRefreshTokenAsync(token);
            return refreshToken != null &&
                   refreshToken.Revoked == null &&
                   refreshToken.Expires > DateTime.UtcNow;
        }

        public string GenerateJwtToken(Users user, string roleName)
        {
            var secret = _configuration["Jwt:Secret"];
            if (string.IsNullOrEmpty(secret))
            {
                throw new InvalidOperationException("JWT Secret is not configured");
            }
            var key = Encoding.ASCII.GetBytes(secret);

            var jwtToken = new JwtSecurityToken(
                claims: new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, roleName)
                },
                expires: DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Jwt:ExpireMinutes")),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(key),

                    SecurityAlgorithms.HmacSha256)
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtTokenString = tokenHandler.WriteToken(jwtToken);

            return jwtTokenString;
        }

        public async Task<RefreshTokens> GenerateRefreshTokenAsync(int userId)
        {
            var refreshToken = new RefreshTokens
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                UserId = userId,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("Jwt:RefreshTokenExpireDays"))
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken;
        }
    }
}