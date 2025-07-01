using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/orderitems
    [ApiController]
    public class OrderItemsController(IService<OrderItems> orderItemsService) : ControllerBase, IController<OrderItems, OrderItemsCreate, OrderItemsUpdate>
    {
        private readonly IService<OrderItems> _orderItemsService = orderItemsService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItems>>> GetAll()
        {
            try
            {
                var items = await _orderItemsService.GetAllAsync();
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении списка позиций заказа");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItems>> GetById(int id)
        {
            try
            {
                var item = await _orderItemsService.GetByIdAsync(id);
                if (item == null) return NotFound("Позиция заказа не найдена");
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении позиции заказа");
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderItems>> Create([FromBody] OrderItemsCreate createDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные позиции заказа");

            try
            {
                var item = new OrderItems
                {
                    OrderId = createDto.OrderId,
                    ProductId = createDto.ProductId,
                    Quantity = createDto.Quantity,
                    UnitPrice = createDto.UnitPrice
                };

                await _orderItemsService.AddAsync(item);
                return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при создании позиции заказа");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderItems>> Update(int id, [FromBody] OrderItemsUpdate updateDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные для обновления позиции заказа");

            try
            {
                var item = await _orderItemsService.GetByIdAsync(id);
                if (item == null) return NotFound("Позиция заказа не найдена");

                if (updateDto.Quantity.HasValue)
                    item.Quantity = updateDto.Quantity.Value;
                if (updateDto.UnitPrice.HasValue)
                    item.UnitPrice = updateDto.UnitPrice.Value;

                await _orderItemsService.UpdateAsync(item);
                return Ok(item);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при обновлении позиции заказа");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var item = await _orderItemsService.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound("Позиция заказа не найдена");
                }

                await _orderItemsService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при удалении позиции заказа");
            }
        }
    }

    public class OrderItemsCreate
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class OrderItemsUpdate
    {
        public int? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
    }
}