using Microsoft.EntityFrameworkCore;
using ShopBack.Data;
using ShopBack.Models;

namespace ShopBack.Repositories
{
    public class ProductsRepository(ShopDbContext context) : IProductsRepository
    {
        private readonly ShopDbContext _context = context;

        //override для методов IRepository
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

        //Новые методы(расширяемые)
        public async Task<IEnumerable<ProductSpecifications>> GetProductSpecificationsAsync(int productId)
        {
            return await _context.ProductSpecifications
                .Where(spec => spec.ProductId == productId)
                .ToListAsync();
        }

        public async Task<ProductImages> GetProductMainImageAsync(int productId)
        {
            return await _context.ProductImages
                .FirstOrDefaultAsync(img => img.ProductId == productId && img.IsMain);

        }
    }
}
