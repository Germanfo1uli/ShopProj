using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/reviews
    [ApiController]
    public class ProductReviewsController(ReviewsService reviewsService) : ControllerBase, IController<ProductReviews, ReviewCreate, ReviewUpdate>
    {
        private readonly ReviewsService _reviewsService = reviewsService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetAll()
        {
            try
            {
                var reviews = await _reviewsService.GetAllAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при получении списка отзывов", Details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReviews>> GetById(int id)
        {
            try
            {
                var review = await _reviewsService.GetByIdAsync(id);
                if (review == null)
                    return NotFound(new { Message = $"Отзыв с ID {id} не найден" });

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении отзыва {id}", Details = ex.Message });
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetByProduct(int productId, [FromQuery] bool onlyApproved = true)
        {
            try
            {
                var reviews = await _reviewsService.GetProductReviewsAsync(productId, onlyApproved);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении отзывов для товара {productId}", Details = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ProductReviews>>> GetByUser(int userId)
        {
            try
            {
                var reviews = await _reviewsService.GetUserReviewsAsync(userId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении отзывов пользователя {userId}", Details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductReviews>> Create([FromBody] ReviewCreate createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Неверные данные отзыва", Errors = ModelState.Values });

            try
            {
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
                return CreatedAtAction(nameof(GetById), new { id = review.Id }, review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при создании отзыва", Details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductReviews>> Update(int id, [FromBody] ReviewUpdate updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Неверные данные для обновления", Errors = ModelState.Values });

            try
            {
                var review = await _reviewsService.GetByIdAsync(id);
                if (review == null)
                    return NotFound(new { Message = $"Отзыв с ID {id} не найден" });

                if (updateDto.Rating.HasValue)
                    review.Rating = updateDto.Rating.Value;
                if (updateDto.Comment != null)
                    review.Comment = updateDto.Comment;

                await _reviewsService.UpdateAsync(review);
                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при обновлении отзыва {id}", Details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var review = await _reviewsService.GetByIdAsync(id);
                if (review == null)
                    return NotFound(new { Message = $"Отзыв с ID {id} не найден" });

                await _reviewsService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при удалении отзыва {id}", Details = ex.Message });
            }
        }

        [HttpPatch("{id}/approve")]
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
        public int? Rating { get; set; }

        public string? Comment { get; set; }
    }

    public class ModerateReview
    {
        public int ModeratorId { get; set; }

        public string? Comment { get; set; }
    }
}