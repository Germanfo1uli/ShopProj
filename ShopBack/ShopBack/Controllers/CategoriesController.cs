using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;


namespace ShopBack.Controllers
{ 
    [Route("api/[controller]")] //api/categories
    [ApiController]
    public class CategoriesController(CategoriesService categoriesService) : ControllerBase, IController<Categories, CategoryCreate, CategoryUpdate>
    {
        private readonly CategoriesService _categoriesService = categoriesService;

        [HttpGet("{id}")]
        public async Task<ActionResult<Categories>> GetById(int id)
        {
            try
            {
                var category = await _categoriesService.GetByIdAsync(id);
                if (category == null)
                    return NotFound(new { Message = $"Категория с ID {id} не найдена" });

                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении категории {id}", Details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Categories>> Create([FromBody] CategoryCreate createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Неверные данные категории", Errors = ModelState.Values });

            try
            {
                var category = new Categories
                {
                    Name = createDto.Name,
                    Description = createDto.Description,
                    ParentCategoryId = createDto.ParentCategoryId
                };

                await _categoriesService.AddAsync(category);
                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при создании категории", Details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Categories>> Update(int id, [FromBody] CategoryUpdate updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Неверные данные для обновления", Errors = ModelState.Values });

            try
            {
                var category = await _categoriesService.GetByIdAsync(id);
                if (category == null)
                    return NotFound(new { Message = $"Категория с ID {id} не найдена" });

                if (updateDto.Name != null)
                    category.Name = updateDto.Name;
                if (updateDto.Description != null)
                    category.Description = updateDto.Description;
                if (updateDto.ParentCategoryId.HasValue)
                    category.ParentCategoryId = updateDto.ParentCategoryId;

                await _categoriesService.UpdateAsync(category);
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при обновлении категории {id}", Details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _categoriesService.GetByIdAsync(id);
                if (category == null)
                    return NotFound(new { Message = $"Категория с ID {id} не найдена" });

                var childCategories = await _categoriesService.GetChildCategoriesAsync(id);
                if (childCategories.Any())
                    return BadRequest(new { Message = "Невозможно удалить категорию с дочерними элементами" });

                await _categoriesService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при удалении категории {id}", Details = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categories>>> GetAll()
        {
            try
            {
                var categories = await _categoriesService.GetAllAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка сервера при получении списка категорий", Details = ex.Message });
            }
        }

        [HttpGet("parents")]
        public async Task<ActionResult<IEnumerable<Categories>>> GetParentCategories()
        {
            try
            {
                var parentCategories = await _categoriesService.GetParentCategoriesAsync();
                return Ok(parentCategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ошибка при получении родительских категорий", Details = ex.Message });
            }
        }

        [HttpGet("children/{parentId}")]
        public async Task<ActionResult<IEnumerable<Categories>>> GetChildCategories(int parentId)
        {
            try
            {
                var childCategories = await _categoriesService.GetChildCategoriesAsync(parentId);
                return Ok(childCategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Ошибка при получении дочерних категорий для родителя {parentId}", Details = ex.Message });
            }
        }
    }

    public class CategoryCreate
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public int? ParentCategoryId { get; set; }
    }

    public class CategoryUpdate
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public int? ParentCategoryId { get; set; }
    }
}