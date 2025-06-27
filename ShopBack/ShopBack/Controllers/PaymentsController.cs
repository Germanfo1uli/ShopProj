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
                return Ok(payments); // 200
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payments>> GetById(int id)
        {
            try
            {
                var payment = await _paymentsService.GetByIdAsync(id); 
                if (payment == null) return NotFound(); // 404
                return Ok(payment); // 200
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpPost]
        public async Task<ActionResult<Payments>> Create([FromBody] PaymentsCreate createDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // 400

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
                return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment); // 201
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Payments>> Update(int id, [FromBody] PaymentsUpdate updateDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // 400

            try
            {
                var payment = await _paymentsService.GetByIdAsync(id);
                if (payment == null) return NotFound(); // 404

                if (updateDto.Status != null)
                    payment.Status = updateDto.Status;

                if (updateDto.TransactionId != null)
                    payment.TransactionId = updateDto.TransactionId;

                await _paymentsService.UpdateAsync(payment);
                return Ok(payment); // 200
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
                var payment = await _paymentsService.GetByIdAsync(id);
                if (payment == null) return NotFound(); // 404

                await _paymentsService.DeleteAsync(payment);
                return NoContent(); // 204
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error"); // 500
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