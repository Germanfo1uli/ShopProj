using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] // api/orders
    [ApiController]
    public class OrdersController(OrdersService ordersService) : ControllerBase, IController<Orders, OrdersCreate, OrdersUpdate>
    {
        private readonly OrdersService _ordersService = ordersService;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Orders>>> GetAll()
        {
            try
            {
                var orders = await _ordersService.GetAllAsync();
                return Ok(orders);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении списка заказов");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Orders>> GetById(int id)
        {
            try
            {
                var order = await _ordersService.GetByIdAsync(id);
                if (order == null) return NotFound("Заказ не найден");
                return Ok(order);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении заказа");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Orders>> Create([FromBody] OrdersCreate createDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные заказа");

            try
            {
                var order = new Orders
                {
                    UserId = createDto.UserId,
                    OrderTime = createDto.OrderTime ?? DateTime.UtcNow,
                    Status = createDto.Status,
                    TotalAmount = createDto.TotalAmount,
                    ShippingAddress = createDto.ShippingAddress,
                    ContactPhone = createDto.ContactPhone,
                    Notes = createDto.Notes,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _ordersService.AddAsync(order);
                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при создании заказа");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Orders>> Update(int id, [FromBody] OrdersUpdate updateDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные для обновления заказа");

            try
            {
                var order = await _ordersService.GetByIdAsync(id);
                if (order == null) return NotFound("Заказ не найден");

                if (updateDto.Status != null)
                    order.Status = updateDto.Status;
                if (updateDto.ShippingAddress != null)
                    order.ShippingAddress = updateDto.ShippingAddress;
                if (updateDto.ContactPhone != null)
                    order.ContactPhone = updateDto.ContactPhone;
                if (updateDto.Notes != null)
                    order.Notes = updateDto.Notes;
                if (updateDto.TotalAmount.HasValue)
                    order.TotalAmount = updateDto.TotalAmount.Value;

                order.UpdatedAt = DateTime.UtcNow;

                await _ordersService.UpdateAsync(order);
                return Ok(order);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при обновлении заказа");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var orderExists = await _ordersService.GetByIdAsync(id) != null;
                if (!orderExists) return NotFound("Заказ не найден");

                await _ordersService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при удалении заказа");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Orders>>> GetUserOrders(int userId)
        {
            try
            {
                var orders = await _ordersService.GetUserOrdersAsync(userId);
                return Ok(orders);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении заказов пользователя");
            }
        }

        [HttpGet("{orderId}/items")]
        public async Task<ActionResult<IEnumerable<OrderItems>>> GetOrderItems(int orderId)
        {
            try
            {
                var items = await _ordersService.GetOrderItemsAsync(orderId);
                return Ok(items);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении позиций заказа");
            }
        }

        [HttpGet("{orderId}/payment")]
        public async Task<ActionResult<Payments>> GetOrderPayment(int orderId)
        {
            try
            {
                var payment = await _ordersService.GetOrderPaymentAsync(orderId);
                if (payment == null) return NotFound("Платеж по заказу не найден");
                return Ok(payment);
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при получении платежа по заказу");
            }
        }

        [HttpPatch("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            try
            {
                await _ordersService.UpdateOrderStatusAsync(orderId, status);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Ошибка сервера при обновлении статуса заказа");
            }
        }
    }

    public class OrdersCreate
    {
        public int UserId { get; set; }
        public DateTime? OrderTime { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class OrdersUpdate
    {
        public string? Status { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }
}