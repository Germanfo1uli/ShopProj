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
            try
            {
                return Ok(await _service.GetAllAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при получении характеристик", Details = ex.Message });
            }
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductSpecifications>>> GetByProduct(int productId)
        {
            try
            {
                var allSpecs = await _service.GetAllAsync();
                return Ok(allSpecs.Where(s => (s as ProductSpecifications)?.ProductId == productId));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении характеристик товара {productId}", Details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProductSpecifications>> Create([FromBody] SpecificationCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var spec = new ProductSpecifications
                {
                    ProductId = dto.ProductId,
                    Key = dto.Key,
                    Value = dto.Value
                };

                await _service.AddAsync(spec);
                return CreatedAtAction(nameof(GetById), new { id = spec.Id }, spec);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при создании характеристики", Details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductSpecifications>> GetById(int id)
        {
            try
            {
                var spec = await _service.GetByIdAsync(id);
                return spec == null ? NotFound() : Ok(spec);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении характеристики {id}", Details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SpecificationUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var spec = await _service.GetByIdAsync(id) as ProductSpecifications;
                if (spec == null)
                    return NotFound();

                spec.Key = dto.Key ?? spec.Key;
                spec.Value = dto.Value ?? spec.Value;

                await _service.UpdateAsync(spec);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при обновлении характеристики {id}", Details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при удалении характеристики {id}", Details = ex.Message });
            }
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