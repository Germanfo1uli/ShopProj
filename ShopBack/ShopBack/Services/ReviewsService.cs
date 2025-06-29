using Microsoft.EntityFrameworkCore;
using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class ReviewsService(IReviewsRepository reviewsRepository) : Service<ProductReviews>(reviewsRepository)
    {
        private readonly IReviewsRepository _reviewsRepository = reviewsRepository;

        public async Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved = true)
        {
            return await _reviewsRepository.GetProductReviewsAsync(productId, onlyApproved);
        }

        public async Task<IEnumerable<ProductReviews>> GetUserReviewsAsync(int userId)
        {
            return await _reviewsRepository.GetUserReviewsAsync(userId);
        }

        public async Task ApproveReviewAsync(int reviewId, int moderatorId, string? comment = null)
        {
            var review = await GetByIdAsync(reviewId);
            if (review == null)
            {
                throw new ArgumentException("Review not found", nameof(reviewId));
            }

            review.Approved = true;
            review.ModeratorId = moderatorId;
            review.Comment = comment;
            review.ModeratedAt = DateTime.UtcNow;

            await UpdateAsync(review);
        }

        public async Task RejectReviewAsync(int reviewId, int moderatorId, string? comment = null)
        {
            var review = await GetByIdAsync(reviewId);
            if (review == null)
            {
                throw new ArgumentException("Review not found", nameof(reviewId));
            }

            review.Approved = false;
            review.ModeratorId = moderatorId;
            review.Comment = comment;
            review.ModeratedAt = DateTime.UtcNow;

            await UpdateAsync(review);
        }
    }
}
