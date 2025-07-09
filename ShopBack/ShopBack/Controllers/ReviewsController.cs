using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.Security.Claims;
using System.Security;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Reflection.PortableExecutable;
using System.ComponentModel.DataAnnotations;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/reviews
    [ApiController]
    public class ReviewsController(ReviewsService reviewsService) : ControllerBase, IController<ProductReviews, ReviewCreate, ReviewUpdate>
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
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetByUserId(int userId)
        {
            var reviews = await _reviewsService.GetUserReviewsAsync(userId);
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<ProductReviews>> Create([FromBody] ReviewCreate createDto)
        {
            var review = new ProductReviews
            {
                ProductId = createDto.ProductId,
                UserId = createDto.UserId,
                Rating = createDto.Rating,
                Header = createDto.Header,
                Comment = createDto.Comment,
                CreatedAt = DateTime.UtcNow,
                Approved = true 
            };

            await _reviewsService.AddAsync(review);
            await _reviewsService.RecalculateRating(review.ProductId);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = review.Id },
               value: review
           );
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "SelfOrAdminAccess")]
        public async Task<ActionResult<ProductReviews>> Update(int id, [FromBody] ReviewUpdate updateDto)
        {
            var review = await _reviewsService.GetByIdAsync(id);

            review.Rating = updateDto.Rating != null ? updateDto.Rating.Value : review.Rating;
            review.Header = updateDto.Header ?? review.Header;
            review.Comment = updateDto.Comment;
            

            await _reviewsService.UpdateAsync(review);
            await _reviewsService.RecalculateRating(review.ProductId);
            return Ok(review);
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

            var review = await _reviewsService.GetByIdAsync(id);

            if (review.UserId != currentUserId && !isAdmin)
            {
                return Forbid();
            }

            await _reviewsService.DeleteAsync(id);
            await _reviewsService.RecalculateRating(review.ProductId);
            return NoContent();
        }

        [HttpPatch("{id}/approve")]
        [Authorize(Policy = "AdminOrModerAccess")]
        public async Task<IActionResult> Approve(int id, [FromBody] ModerateReview moderateDto)
        {
            await _reviewsService.ApproveReviewAsync(id, moderateDto.ModeratorId, moderateDto.ModeratorComment);
            return Ok();
        }

        [HttpPatch("{id}/reject")]
        [Authorize(Policy = "AdminOrModerAccess")]
        public async Task<IActionResult> Reject(int id, [FromBody] ModerateReview moderateDto)
        {
            await _reviewsService.RejectReviewAsync(id, moderateDto.ModeratorId, moderateDto.ModeratorComment);
            return Ok();
        }
    }

    public class ReviewCreate
    {
        public int ProductId { get; set; }

        public int UserId { get; set; }

        public int Rating { get; set; }

        [Required(ErrorMessage = "Header is required")]
        public string Header { get; set; } = default!;

        public string? Comment { get; set; }
    }

    public class ReviewUpdate
    {
        public int UserId { get; set; }

        public int? Rating { get; set; }

        public string? Header { get; set; }

        public string? Comment { get; set; }
    }

    public class ModerateReview
    {
        public int ModeratorId { get; set; }

        public string? ModeratorComment { get; set; }
    }
}