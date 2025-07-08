using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/productimages
    [ApiController]
    public class ProductImagesController(IService<ProductImages> productImageService) : ControllerBase, IController<ProductImages, ImagesData, ImagesData>
    {
        private readonly IService<ProductImages> _productImageService = productImageService;

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductImages>> Create([FromBody] ImagesData createDto)
        {
            var productImage = new ProductImages
            {
                ProductId = createDto.ProductId,
                ImageUrl = createDto.ImageUrl,
                IsMain = createDto.IsMain,
            };
            await _productImageService.AddAsync(productImage);
            return CreatedAtAction(
               actionName: nameof(GetById),
               routeValues: new { imageId = productImage.Id },
               value: productImage
           );
        }

        [HttpDelete("{imageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int imageId)
        {
            await _productImageService.DeleteAsync(imageId);
            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductImages>>> GetAll()
        {
            var result = await _productImageService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{imageId}")]
        public async Task<ActionResult<ProductImages>> GetById(int imageId)
        {
            var result = await _productImageService.GetByIdAsync(imageId);
            return Ok(result);
        }

        [HttpPut("{imageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductImages>> Update(int imageId, [FromBody] ImagesData updateDto)
        {
            var image = await _productImageService.GetByIdAsync(imageId);
            image.ImageUrl = updateDto.ImageUrl;
            image.IsMain = updateDto.IsMain;
            await _productImageService.UpdateAsync(image);
            return Ok(image);
        }
    }

    public class ImagesData
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsMain { get; set; } = false;
    }
}
