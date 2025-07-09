using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/payments
    [ApiController]
    public class PaymentsController(PaymentService paymentsService,
                                    OrdersService ordersService) : ControllerBase,
                                    IController<Payments, PaymentsCreate, PaymentsUpdate>
    {
        private readonly PaymentService _paymentsService = paymentsService;
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            var payment = await _paymentsService.GetByIdAsync(id);
            var order = await _ordersService.GetByIdAsync(payment.OrderId);

            if (order.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            return Ok(payment);
        }

        [HttpPost]
        public Task<ActionResult<Payments>> Create([FromBody] PaymentsCreate createDto)
        {
            throw new NotImplementedException("Этот метод не поддерживается, используйте payments/process");
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Payments>> Update(int id, [FromBody] PaymentsUpdate updateDto)
        {
            var payment = await _paymentsService.GetByIdAsync(id);

            payment.Status = updateDto.Status ?? payment.Status;
            payment.TransactionId = updateDto.TransactionId ?? payment.TransactionId;

            await _paymentsService.UpdateAsync(payment);
            return Ok(payment);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _paymentsService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPost("process")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentRequest request)
        {
            var result = await _paymentsService.ProcessPaymentAsync(
                request.OrderId,
                request.PaymentMethodId);

            return result.IsSuccess
                ? Ok( result.PaymentId )
                : BadRequest("Оплата не прошла");
        }
    }

    public class PaymentsCreate
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public int PaymentMethodId { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = default!;
        public string? TransactionId { get; set; }
    }

    public class PaymentsUpdate
    {
        public string? Status { get; set; }
        public string? TransactionId { get; set; }
    }

    public class ProcessPaymentRequest
    {
        public int UserId { get; set; }
        public int OrderId { get; set; } 
        public int PaymentMethodId { get; set; }
    }
}