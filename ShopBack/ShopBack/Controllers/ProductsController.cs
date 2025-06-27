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
            try
            {
                var products = await _productsService.GetAllAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении списка товаров");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Products>> GetById(int id)
        {
            try
            {
                var product = await _productsService.GetByIdAsync(id);
                if (product == null) return NotFound("Товар не найден");
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении информации о товаре");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Products>> Create([FromBody] ProductCreate createDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные товара");

            try
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
                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при создании товара");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Products>> Update(int id, [FromBody] ProductUpdate updateDto)
        {
            if (!ModelState.IsValid) return BadRequest("Некорректные данные для обновления товара");

            try
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
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при обновлении товара");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var product = await _productsService.GetByIdAsync(id);
                if (product == null) return NotFound("Товар не найден");

                product.IsActive = false;
                await _productsService.DeleteAsync(id);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при удалении товара");
            }
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Products>>> GetByCategory(int categoryId)
        {
            try
            {
                var products = await _productsService.GetByCategoryAsync(categoryId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении товаров по категории");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Products>>> Search([FromQuery] string term)
        {
            try
            {
                var products = await _productsService.SearchAsync(term);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при поиске товаров");
            }
        }

        [HttpGet("{productId}/images")]
        public async Task<ActionResult<IEnumerable<ProductImages>>> GetImages(int productId)
        {
            try
            {
                var images = await _productsService.GetProductImagesAsync(productId);
                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении изображений товара");
            }
        }

        [HttpGet("{productId}/main")]
        public async Task<ActionResult<ProductImages>> GetMainImage(int productId)
        {
            try
            {
                var image = await _productsService.GetProductMainImageAsync(productId);
                if (image == null) return NotFound("Основное изображение товара не найдено");
                return Ok(image);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении основного изображения товара");
            }
        }

        [HttpGet("{productId}/specifications")]
        public async Task<ActionResult<IEnumerable<ProductSpecifications>>> GetSpecifications(int productId)
        {
            try
            {
                var specs = await _productsService.GetProductSpecificationsAsync(productId);
                return Ok(specs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении характеристик товара");
            }
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Products>>> GetActiveProducts()
        {
            try
            {
                var products = await _productsService.GetAllAsync();
                var activeProducts = products.Where(p => p.IsActive);
                return Ok(activeProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ошибка сервера при получении активных товаров");
            }
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