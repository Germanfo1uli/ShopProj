using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class ReviewsRepository(ShopDbContext context) : IReviewsRepository
    {
        private readonly ShopDbContext _context = context;

        public async Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved = true)
        {
            return await _context.ProductReviews
                .Where(pr => pr.ProductId == productId)
                .Where(pr => pr.Approved == onlyApproved)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductReviews>> GetUserReviewsAsync(int userId)
        {
            return await _context.ProductReviews
                .Where(pr => pr.UserId == userId)
                .ToListAsync();
        }

        public async Task ApproveReviewAsync(int reviewId, int moderatorId, string? comment = null)
        {
            var review = await _context.ProductReviews.FindAsync(reviewId);
            if (review == null)
            {
                throw new ArgumentException("Review not found", nameof(reviewId));
            }

            review.Approved = true;
            review.ModeratorId = moderatorId;
            review.Comment = comment;
            review.ModeratedAt = DateTime.UtcNow;

            _context.ProductReviews.Update(review);
            await _context.SaveChangesAsync();
        }

        public async Task RejectReviewAsync(int reviewId, int moderatorId, string? comment = null)
        {
            var review = await _context.ProductReviews.FindAsync(reviewId);
            if (review == null)
            {
                throw new ArgumentException("Review not found", nameof(reviewId));
            }

            review.Approved = false;
            review.ModeratorId = moderatorId;
            review.Comment = comment;
            review.ModeratedAt = DateTime.UtcNow;

            _context.ProductReviews.Update(review);
            await _context.SaveChangesAsync();
        }
    }
}
