using ShopBack.Repositories;
using ShopBack.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Services
{
    public class UserService(IUsersRepository usersRepository,
                             TokenService tokenService,
                             IOrdersRepository ordersRepository,
                             IRepository<UserRoles> userRoleRepository)
                             : Service<Users>(usersRepository)
    {
        private readonly IUsersRepository _usersRepository = usersRepository;
        private readonly TokenService _tokenService = tokenService;
        private readonly IOrdersRepository _ordersRepository = ordersRepository;
        private readonly IRepository<UserRoles> _userRoleRepository = userRoleRepository;

        public async Task<AuthResult> RegisterAsync(string email, string password, string firstName, string middleName, string lastName)
        {
            if (await _usersRepository.GetByEmailAsync(email) != null)
                throw new ArgumentException("Email уже используется");

            var salt = GenerateSalt();
            var passwordHash = HashPassword(password, salt);

            var user = new Users
            {
                Email = email,
                PasswordHash = passwordHash,
                Salt = salt,
                FirstName = firstName,
                MiddleName = middleName,
                LastName = lastName,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _usersRepository.AddAsync(user);
            await _ordersRepository.CreateCart(user.Id);

            var tokens = await _tokenService.GenerateTokensAsync(user);

            return new AuthResult
            {
                UserId = user.Id,
                Email = user.Email,
                JwtToken = tokens.JwtToken,
                RefreshToken = tokens.RefreshToken,
                RefreshTokenExpires = tokens.RefreshTokenExpires
            };
        }

        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            var user = await _usersRepository.GetByEmailAsync(email) ?? throw new UnauthorizedAccessException("Email незарегистрирован");
            if (!VerifyPassword(password, user.PasswordHash, user.Salt))
                throw new UnauthorizedAccessException("Неверный email или пароль");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Аккаунт деактивирован");

            var tokens = await _tokenService.GenerateTokensAsync(user);

            return new AuthResult
            {
                UserId = user.Id,
                Email = user.Email,
                JwtToken = tokens.JwtToken,
                RefreshToken = tokens.RefreshToken,
                RefreshTokenExpires = tokens.RefreshTokenExpires
            };
        }

        public async Task<TokenPair> GetNewTokensAsync(string token)
        {
            var refreshToken = await _tokenService.GetRefreshTokenAsync(token) ?? throw new UnauthorizedAccessException("Вы не авторизованы");

            if (refreshToken.Revoked != null)
                throw new UnauthorizedAccessException("Попытка зайти по отозванному токену");

            var user = await _tokenService.GetUserByTokenAsync(token) ?? throw new KeyNotFoundException("Пользователь не существует");

            var tokens = await _tokenService.GenerateTokensAsync(user);

            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.ReplacedByToken = tokens.RefreshToken;

            await _tokenService.UpdateAsync(refreshToken);

            return tokens;
        }

        public async Task ChangePasswordAsync(int userId, string oldPassword, string newPassword, string token)
        {
            var user = await _usersRepository.GetByIdAsync(userId);
            if (!VerifyPassword(oldPassword, user.PasswordHash, user.Salt))
                throw new UnauthorizedAccessException("Неверный старый пароль");

            var salt = GenerateSalt();
            user.PasswordHash = HashPassword(newPassword, salt);
            user.Salt = salt;

            await _usersRepository.UpdateAsync(user);
            await _tokenService.RevokeRefreshTokensUserAsync(userId, token);
        }

        public async Task SwitchActivateAccountAsync(int userId)
        {
            var user = await _usersRepository.GetByIdAsync(userId) ?? throw new KeyNotFoundException("Пользователь с ID {userId} не найден");
            user.IsActive = !user.IsActive;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task UpdateRoleAsync(int userId, int roleId)
        {
            await _usersRepository.DeleteUserRoleAsync(userId, roleId);
            var userRole = new UserRoles
            {
                UserId = userId,
                RoleId = roleId
            };
            await _userRoleRepository.AddAsync(userRole);
        }

        private static string GenerateSalt()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(16));
        }

        private static string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var saltedPassword = password + salt;
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
            return Convert.ToBase64String(bytes);
        }

        private static bool VerifyPassword(string password, string storedHash, string salt)
        {
            var hashToVerify = HashPassword(password, salt);
            return hashToVerify == storedHash;
        }

        public class AuthResult
        {
            public int UserId { get; set; }
            [Required(ErrorMessage = "Email is required")]
            public string Email { get; set; } = default!;
            [Required(ErrorMessage = "JwtToken is required")]
            public string JwtToken { get; set; } = default!;
            [Required(ErrorMessage = "Refreshtoken is required")]
            public string RefreshToken { get; set; } = default!;
            public DateTime RefreshTokenExpires { get; set; }
        }
    }
}