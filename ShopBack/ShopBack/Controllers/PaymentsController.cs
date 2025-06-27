using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/payments
    [ApiController]
    public class PaymentsController(Service<Payments> paymentsService, OrdersService ordersService) : ControllerBase, IController<Payments, PaymentsCreate, PaymentsUpdate>
    {
        private readonly Service<Payments> _paymentsService = paymentsService;
        private readonly OrdersService _ordersService = ordersService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payments>>> GetAll()
        {
            try
            {
                var payments = await _paymentsService.GetAllAsync();
                return Ok(payments);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера при получении списка платежей");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payments>> GetById(int id)
        {
            try
            {
                var payment = await _paymentsService.GetByIdAsync(id);
                if (payment == null) return NotFound("Платеж не найден");
                return Ok(payment);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера при получении платежа");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Payments>> Create([FromBody] PaymentsCreate createDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные платежа");

            try
            {
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
                return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment);
            }
            catch (Exception)
            {
                return StatusCode(500, "Внутренняя ошибка сервера при создании платежа");
            }
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