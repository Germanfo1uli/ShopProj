using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/orderitems
    [ApiController]
    public class OrderItemsController(IService<OrderItems> orderItemsService, OrdersService ordersService) : ControllerBase, IController<OrderItems, OrderItemsCreate, OrderItemsUpdate>
    {
        private readonly IService<OrderItems> _orderItemsService = orderItemsService;
        private readonly OrdersService _ordersService = ordersService;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<OrderItems>>> GetAll()
        {
            var items = await _orderItemsService.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrderItems>> GetById(int id)
        {
            var item = await _orderItemsService.GetByIdAsync(id);
            return Ok(item);
        }

        [HttpPost]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<OrderItems>> Create([FromBody] OrderItemsCreate createDto)
        {
            var orderId = await _ordersService.GetUserCartOrderIdAsync(createDto.UserId);

            var item = new OrderItems
            {
                OrderId = orderId,
                ProductId = createDto.ProductId,
                Quantity = createDto.Quantity,
            };

            await _orderItemsService.AddAsync(item);
            await _ordersService.RecalculateTotalAmountAsync(orderId);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = item.Id },
               value: item
           );
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<OrderItems>> Update(int id, [FromBody] OrderItemsUpdate updateDto)
        {
            var item = await _orderItemsService.GetByIdAsync(id);

            if (updateDto.Quantity.HasValue)
                item.Quantity = updateDto.Quantity.Value;

            await _orderItemsService.UpdateAsync(item);
            await _ordersService.RecalculateTotalAmountAsync(item.OrderId);
            return Ok(item);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _orderItemsService.GetByIdAsync(id);
            await _orderItemsService.DeleteAsync(id);
            await _ordersService.RecalculateTotalAmountAsync(order.OrderId);
            return NoContent();
        }
    }

    public class OrderItemsCreate
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderItemsUpdate
    {
        public int UserId { get; set; }
        public int? Quantity { get; set; }
    }
}