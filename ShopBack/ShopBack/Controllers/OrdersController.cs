﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

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
            var orders = await _ordersService.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Orders>> GetById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            var order = await _ordersService.GetByIdAsync(id);

            if (order.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            return Ok(order);
        }

        [HttpPost]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<Orders>> Create([FromBody] OrdersCreate createDto)
        {
            var order = new Orders
            {
                UserId = createDto.UserId,
                Status = createDto.Status,
                TotalAmount = createDto.TotalAmount,
                ShippingAddress = createDto.ShippingAddress,
                ContactPhone = createDto.ContactPhone,
                Notes = createDto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _ordersService.AddAsync(order);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = order.Id },
               value: order
           );
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<Orders>> Update(int id, [FromBody] OrdersUpdate updateDto)
        {
            var order = await _ordersService.GetByIdAsync(id);

            order.Status = updateDto.Status ?? order.Status;
            order.ShippingAddress = updateDto.ShippingAddress ?? order.ShippingAddress;
            order.ContactPhone = updateDto.ContactPhone ?? order.ContactPhone;
            order.Notes = updateDto.Notes ?? order.Notes;
            order.TotalAmount = updateDto.TotalAmount ?? order.TotalAmount;

            order.UpdatedAt = DateTime.UtcNow;

            await _ordersService.UpdateAsync(order);
            return Ok(order);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ordersService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{userId}/clearcart")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            await _ordersService.ClearCartAsync(userId);
            return NoContent();
        }

        [HttpGet("{userId}/cart")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<Orders>> GetUserCartOrder(int userId)
        {
            var orders = await _ordersService.GetUserCartOrderAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{userId}/orders")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<IEnumerable<Orders>>> GetUserOrders(int userId)
        {
            var orders = await _ordersService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{orderId}/payment")]
        [Authorize]
        public async Task<ActionResult<Payments>> GetOrderPayment(int orderId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            var order = await _ordersService.GetByIdAsync(orderId);

            if (order.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            var payment = await _ordersService.GetOrderPaymentAsync(orderId);
            return Ok(payment);
        }

        [HttpPut("{orderId}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            var order = await _ordersService.GetByIdAsync(orderId);

            if (order.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            await _ordersService.UpdateOrderStatusAsync(orderId, status);
            return Ok(status);
        }

        [HttpGet("{userId}/stats")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<OrdersStats>> GetOrderStats(int userId)
        {
            (int orderCount, decimal totalSavings) = await _ordersService.GetOrderStatsAsync(userId);
            return Ok(new OrdersStats { OrderCount = orderCount, TotalSavings = totalSavings});
        }
    }

    public class OrdersCreate
    {
        public int UserId { get; set; }
        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = default!;
        public decimal TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class OrdersUpdate
    {
        public int UserId { get; set; }
        public string? Status { get; set; }
        public decimal? TotalAmount { get; set; }
        public string? ShippingAddress { get; set; }
        public string? ContactPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class OrdersStats
    {
        public int OrderCount { get; set; }
        public decimal TotalSavings { get; set; }
    }
}