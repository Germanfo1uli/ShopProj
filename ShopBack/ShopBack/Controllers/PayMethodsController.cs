using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/paymethods
    [ApiController]
    public class PayMethodsController(PayMethodsService payMethodsService) : ControllerBase, IController<PayMethods, PMCreate, PMUpdate>
    {
        private readonly PayMethodsService _payMethodsService = payMethodsService;

        [HttpPost]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<PayMethods>> Create([FromBody] PMCreate createDto)
        {
            var payMethod = new PayMethods
            {
                UserId = createDto.UserId,
                CardLastFourDigits = createDto.CardLastFourDigits,
                CardBrand = createDto.CardBrand,
                ExpiryMonth = createDto.ExpiryMonth,
                ExpiryYear = createDto.ExpiryYear,
                PaymentProviderToken = createDto.PaymentProviderToken,
                IsDefault = createDto.IsDefault,
                CreatedAt = DateTime.UtcNow,
            };
            await _payMethodsService.AddAsync(payMethod);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = payMethod.Id },
               value: payMethod
           );
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

            var payMethod = await _payMethodsService.GetByIdAsync(id);

            if (payMethod.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            await _payMethodsService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PayMethods>>> GetAll()
        {
            var result = await _payMethodsService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<PayMethods>> GetById(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            bool isAdmin = User.IsInRole("Admin");

            var payMethod = await _payMethodsService.GetByIdAsync(id);

            if (payMethod.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            return Ok(payMethod);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PayMethods>> Update(int id, [FromBody] PMUpdate updateDto)
        {
            var payMethod = await _payMethodsService.GetByIdAsync(id);

            payMethod.IsDefault = updateDto.IsDefault;

            await _payMethodsService.UpdateAsync(payMethod);
            return Ok(payMethod);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PayMethods>>> GetByUser(int userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            if (userId != currentUserId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var methods = await _payMethodsService.GetByUserIdAsync(userId);
            return Ok(methods);
        }

        [HttpPut("{id}/default")]
        [Authorize]
        public async Task<ActionResult> SetDefault(int id)
        {
            var method = await _payMethodsService.GetByIdAsync(id);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim не найдено");
            }

            var currentUserId = int.Parse(userIdClaim);

            if (method.UserId != currentUserId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }

            await _payMethodsService.SetDefaultAsync(id);
            return Ok(method);
        }

    }

    public class PMCreate
    {
        public int UserId { get; set; }
        [Required(ErrorMessage = "CardDigits is required")]
        public string CardLastFourDigits { get; set; } = default!;
        [Required(ErrorMessage = "CardBrand is required")] 
        public string CardBrand { get; set; } = default!;
        public int ExpiryMonth { get; set; }
        public int ExpiryYear { get; set; }
        [Required(ErrorMessage = "PaymentToken is required")]
        public string PaymentProviderToken { get; set; } = default!;
        public bool IsDefault { get; set; } = false;
    }

    public class PMUpdate
    {
        public int UserId { get; set; }
        public bool IsDefault { get; set; } = false;
    }
}
