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
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<UserFavorites>> Create([FromBody] FavoriteData createDto)
        {
            var favorite = new UserFavorites
            {
                UserId = createDto.UserId,
                ProductId = createDto.ProductId,
            };
            if (await _favoritesService.IfFavoriteExist(createDto.UserId, createDto.ProductId))
                return BadRequest("Вы уже добавили этот товар в избранное");

            await _favoritesService.AddAsync(favorite);
            return CreatedAtAction(
                actionName: nameof(GetByIds),
                routeValues: new { userId = favorite.UserId, productId = favorite.ProductId },
                value: favorite
            );
        }

        [HttpDelete]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<IActionResult> Delete([FromBody] FavoriteData createDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            if (createDto.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            await _favoritesService.DeleteAsync(createDto.UserId, createDto.ProductId);
            return NoContent();
        }

        [HttpGet]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<UserFavorites>> GetByIds([FromBody] FavoriteData favoriteDto)
        {
            var result = await _favoritesService.GetByIdsAsync(favoriteDto.UserId, favoriteDto.ProductId);
            return Ok(result);
        }

        [HttpGet("{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<IEnumerable<Products>>> GetAllByUserId(int userId)
        {
            var result = await _favoritesService.GetAllByUserIdAsync(userId);
            return Ok(result);
        }
    }

    public class FavoriteData
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}
