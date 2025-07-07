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
    }
}
