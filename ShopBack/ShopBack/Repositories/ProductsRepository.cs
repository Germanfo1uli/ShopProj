using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class ProductsRepository : Repository<Products>, IProductsRepository
    {
        public ProductsRepository(ShopDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Products>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Products>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<Products>();

            return await _context.Products
                .Where(p => p.Name.Contains(searchTerm) ||
                           (p.Description != null && p.Description.Contains(searchTerm)))
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductImages>> GetProductImagesAsync(int productId)
        {
            return await _context.ProductImages
                .Where(img => img.ProductId == productId)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductSpecifications>> GetProductSpecificationsAsync(int productId)
        {
            return await _context.ProductSpecifications
                .Where(spec => spec.ProductId == productId)
                .ToListAsync();
        }

        public async Task<ProductImages> GetProductMainImageAsync(int productId)
        {
            return await _context.ProductImages
                .FirstOrDefaultAsync(img => img.ProductId == productId && img.IsMain)
                ?? throw new KeyNotFoundException($"Главное изображение товара с ID {productId} не найдено"); ;

        }

        public async Task<IEnumerable<Products>> GetInactiveProductsAsync()
        {
            return await _context.Products
                .Where(p => !p.IsActive)
                .ToListAsync();
        }

        public async Task<Products> DecoratedGetByIdAsync(int productId)
        {
            return await _context.Products
                .Include(p => p.ProductSpecification)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == productId)
                ?? throw new KeyNotFoundException($"Товар с ID {productId} не найдена");
                
        }
    }
}
