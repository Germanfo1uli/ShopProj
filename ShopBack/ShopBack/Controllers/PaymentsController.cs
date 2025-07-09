using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
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
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

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
        public async Task<ActionResult<Payments>> Create([FromBody] PaymentsCreate createDto)
        {
            return new StatusCodeResult(405);
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
        public string Status { get; set; }
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