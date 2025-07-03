using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;

namespace ShopBack.Controllers
{
    [Route("api/[controller]")] //api/productspecifications
    [ApiController]
    public class ProductSpecificationsController(IService<ProductSpecifications> service) : ControllerBase
    {
        private readonly IService<ProductSpecifications> _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductSpecifications>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductSpecifications>>> GetByProduct(int productId)
        {
            var allSpecs = await _service.GetAllAsync();
            return Ok(allSpecs.Where(s => s.ProductId == productId));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductSpecifications>> Create([FromBody] SpecificationCreateDto dto)
        {
            var spec = new ProductSpecifications
            {
                ProductId = dto.ProductId,
                Key = dto.Key,
                Value = dto.Value
            };

            await _service.AddAsync(spec);
            return CreatedAtAction(
                actionName: nameof(GetById),
                routeValues: new { id = spec.Id },
                value: spec
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductSpecifications>> GetById(int id)
        {
            var spec = await _service.GetByIdAsync(id);
            return Ok(spec);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] SpecificationUpdateDto dto)
        {
            var spec = await _service.GetByIdAsync(id);

            spec.Key = dto.Key ?? spec.Key;
            spec.Value = dto.Value ?? spec.Value;

            await _service.UpdateAsync(spec);
            return Ok(spec);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }

    public class SpecificationCreateDto
    {
        public int ProductId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class SpecificationUpdateDto
    {
        public string? Key { get; set; }
        public string? Value { get; set; }
    }
}