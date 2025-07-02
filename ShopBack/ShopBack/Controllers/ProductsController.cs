using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/products
    [ApiController]
    public class ProductsController(ProductsService productsService) : ControllerBase, IController<Products, ProductCreate, ProductUpdate>
    {
        private readonly ProductsService _productsService = productsService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Products>>> GetAll()
        {
            var products = await _productsService.GetAllAsync();
            var activeProducts = products
                .Where(products => products.IsActive)
                .ToList();
            return Ok(activeProducts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Products>> GetById(int id)
        {
            var product = await _productsService.GetByIdAsync(id);
            return Ok(product);
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
            if (product == null) return NotFound("Товар не найден");

            if (updateDto.Name != null) product.Name = updateDto.Name;
            if (updateDto.Description != null) product.Description = updateDto.Description;
            if (updateDto.Price.HasValue) product.Price = updateDto.Price.Value;
            if (updateDto.QuantityInStock.HasValue) product.QuantityInStock = updateDto.QuantityInStock.Value;
            if (updateDto.CategoryId.HasValue) product.CategoryId = updateDto.CategoryId.Value;
            if (updateDto.IsActive.HasValue) product.IsActive = updateDto.IsActive.Value;

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
    }

    public class ProductCreate
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int QuantityInStock { get; set; }

        public int CategoryId { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class ProductUpdate
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public decimal? Price { get; set; }

        public int? QuantityInStock { get; set; }

        public int? CategoryId { get; set; }

        public bool? IsActive { get; set; }
    }
}