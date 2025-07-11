using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using Stripe;
using System.Security.Claims;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/orderitems
    [ApiController]
    public class OrderItemsController(IService<OrderItems> orderItemsService, OrdersService ordersService, ProductsService productsService) : ControllerBase, IController<OrderItems, OrderItemsCreate, OrderItemsUpdate>
    {
        private readonly IService<OrderItems> _orderItemsService = orderItemsService;
        private readonly OrdersService _ordersService = ordersService;
        private readonly ProductsService _productsService = productsService;

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

            if (await _ordersService.IfOrderItemExist(createDto.ProductId, orderId))
                return BadRequest("Этот товар уже находится в корзине");

            var product = await _productsService.GetByIdAsync(item.ProductId);
            if (product.QuantityInStock < item.Quantity)
                return BadRequest($"Недостаточно товара {product.Name} на складе. Доступно: {product.QuantityInStock}, требуется: {item.Quantity}");

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

            var product = await _productsService.GetByIdAsync(item.ProductId);
            if (product.QuantityInStock < item.Quantity)
                return BadRequest($"Недостаточно товара {product.Name} на складе. Доступно: {product.QuantityInStock}, требуется: {item.Quantity}");

            if (updateDto.Quantity.HasValue)
                item.Quantity = updateDto.Quantity.Value;

            await _orderItemsService.UpdateAsync(item);
            await _ordersService.RecalculateTotalAmountAsync(item.OrderId);
            return Ok(item);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            var orderItem = await _orderItemsService.GetByIdAsync(id);
            var order = await _ordersService.GetByIdAsync(orderItem.OrderId);

            if (order.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            await _orderItemsService.DeleteAsync(id);
            await _ordersService.RecalculateTotalAmountAsync(order.Id);
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