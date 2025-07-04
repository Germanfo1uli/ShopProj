using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/products
    [ApiController]
    public class ProductsController(ProductsService productsService, AnalyticsService analyticsService) : ControllerBase, IController<Products, ProductCreate, ProductUpdate>
    {
        private readonly ProductsService _productsService = productsService;
        private readonly AnalyticsService _analyticsService = analyticsService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Products>>> GetAll()
        {
            var products = await _productsService.GetAllAsync();
            var activeProducts = products
                .Where(products => products.IsActive)
                .ToList();
            return Ok(activeProducts);
        }

        async Task<ActionResult<Products>> IController<Products, ProductCreate, ProductUpdate>.GetById(int id) // Метод - пустышка
        {
            return BadRequest(new { Error = "памагити я так не умею" });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductWithStatsDto>> GetById(int id)
        {
            var product = await _productsService.GetByIdAsync(id);
            var (viewCount, favoriteCount) = await _analyticsService.GetProductStatsAsync(id);

            var result = new ProductWithStatsDto
            {
                Product = product,
                ViewCount = viewCount,
                FavoriteCount = favoriteCount
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Products>> Create([FromBody] ProductCreate createDto)
        {
            var product = new Products
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Price = createDto.Price,
                OldPrice = createDto.OldPrice,
                QuantityInStock = createDto.QuantityInStock,
                CategoryId = createDto.CategoryId,
                IsActive = createDto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _productsService.AddAsync(product);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { id = product.Id },
               value: product
           );
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Products>> Update(int id, [FromBody] ProductUpdate updateDto)
        {
            var product = await _productsService.GetByIdAsync(id);

            product.Name = updateDto.Name ?? product.Name;
            product.Description = updateDto.Description ?? product.Description;
            product.Price = updateDto.Price ?? product.Price;
            product.OldPrice = updateDto.OldPrice ?? product.OldPrice;
            product.QuantityInStock = updateDto.QuantityInStock ?? product.QuantityInStock;
            product.CategoryId = updateDto.CategoryId ?? product.CategoryId;
            product.IsActive = updateDto.IsActive ?? product.IsActive;

            await _productsService.UpdateAsync(product);
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productsService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Products>>> GetByCategory(int categoryId)
        {
            var products = await _productsService.GetByCategoryAsync(categoryId);
            return Ok(products);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Products>>> Search([FromQuery] string term)
        {
            var products = await _productsService.SearchAsync(term);
            return Ok(products);
        }

        [HttpGet("{productId}/images")]
        public async Task<ActionResult<IEnumerable<ProductImages>>> GetImages(int productId)
        {
            var images = await _productsService.GetProductImagesAsync(productId);
            return Ok(images);
        }

        [HttpGet("{productId}/main")]
        public async Task<ActionResult<ProductImages>> GetMainImage(int productId)
        {
            var image = await _productsService.GetProductMainImageAsync(productId);
            return Ok(image);
        }

        [HttpGet("{productId}/specifications")]
        public async Task<ActionResult<IEnumerable<ProductSpecifications>>> GetSpecifications(int productId)
        {
            var specs = await _productsService.GetProductSpecificationsAsync(productId);
            return Ok(specs);
        }

        [HttpGet("inactive")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Products>>> GetInactiveProducts()
        {
            var inactiveProducts = await _productsService.GetInactiveProductsAsync();
            return Ok(inactiveProducts);
        }

        [HttpGet("{productId}/stats")]
        public async Task<ActionResult> GetProductStats(int productId)
        {
            try
            {
                var result = await _analyticsService.GetProductStatsAsync(productId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class ProductCreate
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal? OldPrice { get; set; }

        public int QuantityInStock { get; set; }

        public int CategoryId { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class ProductUpdate
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public decimal? Price { get; set; }

        public decimal? OldPrice { get; set; }

        public int? QuantityInStock { get; set; }

        public int? CategoryId { get; set; }

        public bool? IsActive { get; set; }
    }

    public class ProductWithStatsDto
    {
        public Products Product { get; set; }
        public int ViewCount { get; set; }
        public int FavoriteCount { get; set; }
    }
}