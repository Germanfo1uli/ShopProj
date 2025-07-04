using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using ShopBack.Models;
using ShopBack.Repositories;

namespace ShopBack.Services
{
    public class ReviewsService(IReviewsRepository reviewsRepository, AnalyticsService analyticsService, ProductsService productsService) : Service<ProductReviews>(reviewsRepository)
    {
        private readonly IReviewsRepository _reviewsRepository = reviewsRepository;
        private readonly AnalyticsService _analyticsService = analyticsService;
        private readonly ProductsService _productsService = productsService;

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
            var review = await GetByIdAsync(reviewId) ?? throw new ArgumentException("Review not found", nameof(reviewId));

            review.Approved = true;
            review.ModeratorId = moderatorId;
            review.Comment = comment;
            review.ModeratedAt = DateTime.UtcNow;

            await UpdateAsync(review);
        }

        public async Task RejectReviewAsync(int reviewId, int moderatorId, string? comment = null)
        {
            var review = await GetByIdAsync(reviewId) ?? throw new ArgumentException("Review not found", nameof(reviewId));

            review.Approved = false;
            review.ModeratorId = moderatorId;
            review.Comment = comment;
            review.ModeratedAt = DateTime.UtcNow;

            await RecalculateRating(review.ProductId);
            await UpdateAsync(review);
        }

        public async Task RecalculateRating(int productId)
        {
            var (averageRating, reviewCount) = await _analyticsService.GetReviewStatsAsync(productId);
            await _productsService.AssignmentRating(productId, (decimal)averageRating, reviewCount);
        }
    }
}
