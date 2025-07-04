using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.Data;
using System.Security.Claims;


namespace ShopBack.Controllers
{
    [Route("api/[controller]")] // api/productviewhistory
    [ApiController]
    public class ProductViewsHistoryController(IService<ProductViewsHistory> service, AnalyticsService analyticsService) : ControllerBase, IController<ProductViewsHistory, ProductViewCreate, ProductViewCreate>
    {
        private readonly IService<ProductViewsHistory> _service = service;
        private readonly AnalyticsService _analyticsService = analyticsService;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetAll()
        {
            var allViews = await _service.GetAllAsync();
            return Ok(allViews.Cast<ProductViewsHistory>().OrderByDescending(v => v.ViewedAt));
        }

        [HttpPost]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<ProductViewsHistory>> Create([FromBody] ProductViewCreate createDto)
        {
            var view = new ProductViewsHistory
            {
                UserId = createDto.UserId,
                ProductId = createDto.ProductId,
                ViewedAt = DateTime.UtcNow
            };

            await _service.AddAsync(view);
            return CreatedAtAction(
                actionName: nameof(GetById),
                routeValues: new { id = view.Id },
                value: view
            );
        }

        [HttpGet("user/{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetByUser(int userId)
        {
            var allViews = await _analyticsService.GetProductViewHistoryAsync(userId);

            return Ok(allViews);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductViewsHistory>> GetById(int id)
        {
            var view = await _service.GetByIdAsync(id);
            return Ok(view);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            bool isAdmin = User.IsInRole("Admin");

            var view = await _service.GetByIdAsync(id);

            if (view.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            await _service.DeleteAsync(id);
            return NoContent();
        }

        // Пустой метод - не нужен для хранения истории
        [HttpPut("{id}")]
        public Task<ActionResult<ProductViewsHistory>> Update(int id, [FromBody] ProductViewCreate updateDto)
            => throw new NotImplementedException("Метод не поддерживается");
    }

    public class ProductViewCreate
    {
        public int UserId { get; set; }

        public int ProductId { get; set; }
    }
}