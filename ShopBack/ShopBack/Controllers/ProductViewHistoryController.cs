using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;


namespace ShopBack.Controllers
{
    [Route("api/[controller]")] // api/productviewhistory
    [ApiController]
    public class ProductViewsHistoryController(Service<ProductViewsHistory> service) : ControllerBase, IController<ProductViewsHistory, ProductViewCreate, ProductViewUpdate>
    {
        private readonly Service<ProductViewsHistory> _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetAll()
        {
            try
            {
                var allViews = await _service.GetAllAsync();
                return Ok(allViews.Cast<ProductViewsHistory>().OrderByDescending(v => v.ViewedAt));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при получении истории просмотров", Details = ex.Message});
            }
        }

        [HttpGet("filtered")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetAllFiltered(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var allViews = (await _service.GetAllAsync()).Cast<ProductViewsHistory>();

                if (startDate.HasValue) allViews = allViews.Where(v => v.ViewedAt >= startDate);
                if (endDate.HasValue) allViews = allViews.Where(v => v.ViewedAt <= endDate);

                return Ok(allViews.OrderByDescending(v => v.ViewedAt));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при фильтрации истории просмотров", Details = ex.Message});
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductViewsHistory>> Create([FromBody] ProductViewCreate createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Неверные данные просмотра", Errors = ModelState.Values });

            try
            {
                var view = new ProductViewsHistory
                {
                    UserId = createDto.UserId,
                    ProductId = createDto.ProductId,
                    ViewedAt = DateTime.UtcNow
                };

                await _service.AddAsync(view);
                return CreatedAtAction(nameof(GetById), new { id = view.Id }, view);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при сохранении просмотра", Details = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetByUser(int userId)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении истории просмотров пользователя {userId}", Details = ex.Message });
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductViewsHistory>>> GetByProduct(int productId)
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении истории просмотров товара {productId}", Details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductViewsHistory>> GetById(int id)
        {
            try
            {
                var view = await _service.GetByIdAsync(id);
                if (view == null)
                    return NotFound(new { Message = $"Запись просмотра с ID {id} не найдена" });

                return Ok(view);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении записи просмотра {id}", Details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var view = await _service.GetByIdAsync(id);
                if (view == null)
                    return NotFound(new { Message = $"Запись просмотра с ID {id} не найдена" });

                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при удалении записи просмотра {id}", Details = ex.Message });
            }
        }

        // Пустой метод - не нужен для хранения истории
        [HttpPut("{id}")]
        public Task<ActionResult<ProductViewsHistory>> Update(int id, [FromBody] ProductViewUpdate updateDto)
            => throw new NotImplementedException("Метод не поддерживается");
    }

    public class ProductViewCreate
    {
        public int UserId { get; set; }

        public int ProductId { get; set; }
    }

    public class ProductViewUpdate
    {
        // Для истории просмотров обновление не предусмотрено
    }
}