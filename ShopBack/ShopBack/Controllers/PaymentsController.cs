using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.Security.Claims;
using System.Security;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/payments
    [ApiController]
    public class PaymentsController(IService<Payments> paymentsService, OrdersService ordersService) : ControllerBase, IController<Payments, PaymentsCreate, PaymentsUpdate>
    {
        private readonly IService<Payments> _paymentsService = paymentsService;
        private readonly OrdersService _ordersService = ordersService;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Payments>>> GetAll()
        {
            var payments = await _paymentsService.GetAllAsync();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Payments>> GetById(int id)
        {
            var isAdmin = User.IsInRole("Admin");
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new SecurityException("Неверный формат идентификатора пользователя");
            }

            var payment = await _paymentsService.GetByIdAsync(id);
            var order = await _ordersService.GetByIdAsync(payment.OrderId);

            if (!isAdmin && userId != order.UserId)
            {
                return Forbid("Вы можете просматривать только свои оплаты");
            }
            
            return Ok(payment);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Payments>> Create([FromBody] PaymentsCreate createDto)
        {
            var isAdmin = User.IsInRole("Admin");
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new SecurityException("Неверный формат идентификатора пользователя");
            }

            var payment = new Payments
            {
                OrderId = createDto.OrderId,
                Amount = createDto.Amount,
                PaymentMethod = createDto.PaymentMethod,
                Status = createDto.Status,
                TransactionId = createDto.TransactionId,
                PaymentDate = DateTime.UtcNow
            };

            await _paymentsService.AddAsync(payment);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = payment.Id },
               value: payment
           );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Payments>> Update(int id, [FromBody] PaymentsUpdate updateDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные для обновления платежа");

            try
            {
                var payment = await _paymentsService.GetByIdAsync(id);
                if (payment == null) return NotFound("Платеж не найден");

                if (updateDto.Status != null)
                    payment.Status = updateDto.Status;

                if (updateDto.TransactionId != null)
                    payment.TransactionId = updateDto.TransactionId;

                await _paymentsService.UpdateAsync(payment);
                return Ok(payment);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера при обновлении платежа");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var payment = await _paymentsService.GetByIdAsync(id);
                if (payment == null) return NotFound("Платеж не найден");

                await _paymentsService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера при удалении платежа");
            }
        }
    }

    public class PaymentsCreate
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public string? TransactionId { get; set; }
    }

    public class PaymentsUpdate
    {
        public string? Status { get; set; }
        public string? TransactionId { get; set; }
    }
}