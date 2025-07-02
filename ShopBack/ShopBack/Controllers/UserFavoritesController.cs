using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBack.Models;
using ShopBack.Services;
using System.Security;
using System.Security.Claims;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/userfavorites
    [ApiController]
    public class UserFavoritesController(FavoriteService favoritesService) : ControllerBase
    {
        private readonly FavoriteService _favoritesService = favoritesService;

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<UserFavorites>> Create([FromBody] FavoriteData createDto)
        {
            try
            {
                var isAdmin = User.IsInRole("Admin");
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    throw new SecurityException("Неверный формат идентификатора пользователя");
                }

                if (!isAdmin && userId != createDto.UserId)
                {
                    return Forbid("Вы можете добавлять товары только в свой избранный список");
                }

                var favorite = new UserFavorites
                {
                    UserId = createDto.UserId,
                    ProductId = createDto.ProductId,
                };

                await _favoritesService.AddAsync(favorite);
                return Ok(favorite);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete([FromBody] FavoriteData createDto)
        {
            try
            {
                var isAdmin = User.IsInRole("Admin");
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    throw new SecurityException("Неверный формат идентификатора пользователя");
                }

                if (!isAdmin && userId != createDto.UserId)
                {
                    return Forbid("Вы можете добавлять товары только в свой избранный список");
                }
                
                await _favoritesService.DeleteAsync(createDto.UserId, createDto.ProductId);
                return NoContent();
            }
            catch
            {
                return NotFound($"Добавленное в избранное не найдено");
            }
        }

        [HttpGet("{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<IEnumerable<UserFavorites>>> GetAllByUserId(int userId)
        {
            try
            {
                var result = await _favoritesService.GetAllByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class FavoriteData
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
