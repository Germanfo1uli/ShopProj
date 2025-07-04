using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.Security.Claims;
using System.Security;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/reviews
    [ApiController]
    public class ProductReviewsController(ReviewsService reviewsService) : ControllerBase, IController<ProductReviews, ReviewCreate, ReviewUpdate>
    {
        private readonly ReviewsService _reviewsService = reviewsService;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetAll()
        {
            var reviews = await _reviewsService.GetAllAsync();
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "AdminOrModerAccess")]
        public async Task<ActionResult<ProductReviews>> GetById(int id)
        {
            var review = await _reviewsService.GetByIdAsync(id);
            return Ok(review);
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetByProduct(int productId)
        {
            var reviews = await _reviewsService.GetProductReviewsAsync(productId, true);
            return Ok(reviews);
        }

        [HttpGet("user/{userId}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetByUser(int userId)
        {
            var reviews = await _reviewsService.GetUserReviewsAsync(userId);
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProductReviews>> Create([FromBody] ReviewCreate createDto)
        {
            var isAdmin = User.IsInRole("Admin");
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new SecurityException("Неверный формат идентификатора пользователя");
            }

            if (!isAdmin && userId != createDto.UserId)
            {
                return Forbid("Вы можете оставлять отзывы только от своего имени");
            }

            var review = new ProductReviews
            {
                ProductId = createDto.ProductId,
                UserId = createDto.UserId,
                Rating = createDto.Rating,
                Comment = createDto.Comment,
                CreatedAt = DateTime.UtcNow,
                Approved = true 
            };

            await _reviewsService.AddAsync(review);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = review.Id },
               value: review
           );
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<ProductReviews>> Update(int id, [FromBody] ReviewUpdate updateDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new SecurityException("Неверный формат идентификатора пользователя");
            }

            if (userId != updateDto.UserId)
            {
                return Forbid("Вы можете изменять только свои отзывы");
            }

            var review = await _reviewsService.GetByIdAsync(id);

            review.Rating = updateDto.Rating != null ? updateDto.Rating.Value : review.Rating;
            review.Comment = updateDto.Comment;

            await _reviewsService.UpdateAsync(review);
            return Ok(review);
        }

        [HttpDelete("{id}")]
        
        public async Task<IActionResult> Delete(int id)
        {
            var isAdmin = User.IsInRole("Admin");
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new SecurityException("Неверный формат идентификатора пользователя");
            }

            if (!isAdmin && userId != id)
            {
                return Forbid("Вы можете удалять только свои отзывы");
            }

            await _reviewsService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/approve")]
        [Authorize(Policy = "AdminOrModerAccess")]
        public async Task<IActionResult> Approve(int id, [FromBody] ModerateReview moderateDto)
        {
            try
            {
                await _reviewsService.ApproveReviewAsync(id, moderateDto.ModeratorId, moderateDto.Comment);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при одобрении отзыва {id}", Details = ex.Message });
            }
        }

        [HttpPatch("{id}/reject")]
        [Authorize(Policy = "AdminOrModerAccess")]
        public async Task<IActionResult> Reject(int id, [FromBody] ModerateReview moderateDto)
        {
            try
            {
                await _reviewsService.RejectReviewAsync(id, moderateDto.ModeratorId, moderateDto.Comment);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при отклонении отзыва {id}", Details = ex.Message });
            }
        }
    }

    public class ReviewCreate
    {
        public int ProductId { get; set; }

        public int UserId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }
    }

    public class ReviewUpdate
    {
        public int UserId { get; set; }

        public int? Rating { get; set; }

        public string? Comment { get; set; }
    }

    public class ModerateReview
    {
        public int ModeratorId { get; set; }

        public string? Comment { get; set; }
    }
}