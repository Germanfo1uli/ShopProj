using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using static System.Net.Mime.MediaTypeNames;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/userfavorites
    [ApiController]
    public class UserFavoritesController(FavoriteService favoritesService) : ControllerBase
    {
        private readonly FavoriteService _favoritesService = favoritesService;

        [HttpPost]
        public async Task<ActionResult<UserFavorites>> Create([FromBody] FavoriteData createDto)
        {
            try
            {
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
        public async Task<IActionResult> Delete([FromBody] FavoriteData createDto)
        {
            try
            {
                await _favoritesService.DeleteAsync(createDto.UserId, createDto.ProductId);
                return NoContent();
            }
            catch
            {
                return NotFound($"Добавленное в избранное не найдено");
            }
        }

        [HttpGet("{userId}")]
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
