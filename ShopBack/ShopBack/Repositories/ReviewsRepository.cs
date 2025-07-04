using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class ReviewsRepository : Repository<ProductReviews>, IReviewsRepository
    {
        public ReviewsRepository(ShopDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved)
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
    }
}
