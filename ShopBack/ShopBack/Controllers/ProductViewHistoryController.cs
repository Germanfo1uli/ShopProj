using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.Data;


namespace ShopBack.Controllers
{
    [Route("api/[controller]")] // api/productviewhistory
    [ApiController]
    public class ProductViewsHistoryController(IService<ProductViewsHistory> service) : ControllerBase, IController<ProductViewsHistory, ProductViewCreate, ProductViewCreate>
    {
        private readonly IService<ProductViewsHistory> _service = service;

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

            var allViews = await _service.GetAllAsync();
            var userViews = new List<ProductViewsHistory>();

            foreach (var view in allViews)
            {
                if (view is ProductViewsHistory pvh && pvh.UserId == userId)
                {
                    userViews.Add(pvh);
                }
            }

            return Ok(userViews);
        }

        [HttpGet("product/{productId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetByProduct(int productId)
        {
            var allViews = await _service.GetAllAsync();
            var productViews = new List<ProductViewsHistory>();

            foreach (var view in allViews)
            {
                if (view is ProductViewsHistory pvh && pvh.ProductId == productId)
                {
                    productViews.Add(pvh);
                }
            }

            return Ok(productViews);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductViewsHistory>> GetById(int id)
        {
            var view = await _service.GetByIdAsync(id);
            return Ok(view);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
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