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
        [Authorize]
        public async Task<ActionResult<Payments>> Create([FromBody] PaymentsCreate createDto)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            bool isAdmin = User.IsInRole("Admin");

            var order = await _ordersService.GetByIdAsync(createDto.OrderId);

            if (order.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            var payment = new Payments
            {
                OrderId = createDto.OrderId,
                Amount = createDto.Amount,
                PaymentMethodId = createDto.PaymentMethodId,
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
}