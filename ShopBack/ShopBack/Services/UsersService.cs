using ShopBack.Repositories;
using ShopBack.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Primitives;

namespace ShopBack.Services
{
    public class UserService(IUsersRepository usersRepository, TokenService tokenService) : Service<Users>(usersRepository)
    {
        private readonly IUsersRepository _usersRepository = usersRepository;
        private readonly TokenService _tokenService = tokenService;

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
            var user = await _usersRepository.GetByEmailAsync(email);
            if (user == null)
                throw new UnauthorizedAccessException("Неверный email");
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

        public async Task ChangePasswordAsync(int userId, string oldPassword, string newPassword, bool revoking, string token)
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
            public string Email { get; set; }
            public string JwtToken { get; set; }
            public string RefreshToken { get; set; }
            public DateTime RefreshTokenExpires { get; set; }
        }
    }
}