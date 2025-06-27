using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;


namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/orderitems
    [ApiController]
    public class OrderItemsController(Service<OrderItems> orderItemsService) : ControllerBase, IController<OrderItems, OrderItemsCreate, OrderItemsUpdate>
    {
        private readonly Service<OrderItems> _orderItemsService = orderItemsService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItems>>> GetAll()
        {
            try
            {
                var items = await _orderItemsService.GetAllAsync();
                return Ok(items); // 200
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItems>> GetById(int id)
        {
            try
            {
                var item = await _orderItemsService.GetByIdAsync(id);
                if (item == null) return NotFound(); // 404
                return Ok(item); // 200
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpPost]
        public async Task<ActionResult<OrderItems>> Create([FromBody] OrderItemsCreate createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // 400

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
                return CreatedAtAction(nameof(GetById), new { id = item.Id }, item); // 201
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderItems>> Update(int id, [FromBody] OrderItemsUpdate updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // 400

            try
            {
                var item = await _orderItemsService.GetByIdAsync(id);
                if (item == null) return NotFound(); // 404

                if (updateDto.Quantity.HasValue)
                    item.Quantity = updateDto.Quantity.Value;
                if (updateDto.UnitPrice.HasValue)
                    item.UnitPrice = updateDto.UnitPrice.Value;

                await _orderItemsService.UpdateAsync(item);
                return Ok(item); // 200
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var item = await _orderItemsService.GetByIdAsync(id);
                if (item == null) return NotFound(); // 404

                await _orderItemsService.DeleteAsync(item);
                return NoContent(); // 204
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
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
