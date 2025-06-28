using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/productimages
    [ApiController]
    public class ProductImagesController(Service<ProductImages> productImageService) : ControllerBase, IController<ProductImages, ImagesData, ImagesData>
    {
        private readonly Service<ProductImages> _productImageService = productImageService;

        [HttpPost]
        public async Task<ActionResult<ProductImages>> Create([FromBody] ImagesData createDto)
        {
            try
            {
                var productImage = new ProductImages
                {
                    ProductId = createDto.ProductId,
                    ImageUrl = createDto.ImageUrl,
                    IsMain = createDto.IsMain,
                };
                await _productImageService.AddAsync(productImage);
                return Ok(productImage);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{imageId}")]
        public async Task<IActionResult> Delete(int imageId)
        {
            try
            {
                await _productImageService.DeleteAsync(imageId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound($"Изображение с ID {imageId} не найдена");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductImages>>> GetAll()
        {
            try
            {
                var result = await _productImageService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{imageId}")]
        public async Task<ActionResult<ProductImages>> GetById(int imageId)
        {
            try
            {
                var result = await _productImageService.GetByIdAsync(imageId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{imageId}")]
        public async Task<ActionResult<ProductImages>> Update(int imageId, [FromBody] ImagesData updateDto)
        {
            try
            {
                var image = await _productImageService.GetByIdAsync(imageId);
                image.ImageUrl = updateDto.ImageUrl;
                image.IsMain = updateDto.IsMain;
                await _productImageService.UpdateAsync(image);
                return Ok(image);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class ImagesData
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsMain { get; set; } = false;
    }
}
