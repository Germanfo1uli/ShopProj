using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class ReviewsRepository(ShopDbContext context) : Repository<ProductReviews>(context), IReviewsRepository
    {
        public async Task<IEnumerable<ProductReviews>> GetProductReviewsAsync(int productId, bool onlyApproved)
        {
            var result = await _context.ProductReviews
                .Where(pr => pr.ProductId == productId)
                .Where(pr => pr.Approved == onlyApproved)
                .Include(pr => pr.User)
                .AsNoTracking()
                .ToListAsync();

            result.ForEach(pr => pr.User = new Users
            {
                FirstName = pr.User.FirstName,
                LastName = pr.User.LastName
            });

            return result;
        }

        public async Task<IEnumerable<ProductReviews>> GetUserReviewsAsync(int userId)
        {
            return await _context.ProductReviews
                .Where(pr => pr.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ProductReviews?> FindAsync(int userId, int productId)
        {
            return await _context.ProductReviews
                .FirstOrDefaultAsync(pr => pr.UserId == userId && pr.ProductId == productId);
        }
    }
}
