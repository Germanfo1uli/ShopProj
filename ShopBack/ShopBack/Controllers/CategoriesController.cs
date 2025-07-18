﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopBack.Models;
using ShopBack.Services;
using System.ComponentModel.DataAnnotations;

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
            var category = await _categoriesService.GetByIdAsync(id);
            return Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Categories>> Create([FromBody] CategoryCreate createDto)
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

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Categories>> Update(int id, [FromBody] CategoryUpdate updateDto)
        {
            var category = await _categoriesService.GetByIdAsync(id);

            category.Name = updateDto.Name ?? category.Name;
            category.Description = updateDto.Description ?? category.Description;
            category.ParentCategoryId = updateDto.ParentCategoryId ?? category.ParentCategoryId;

            await _categoriesService.UpdateAsync(category);
            return Ok(category);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _categoriesService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categories>>> GetAll()
        {
            var categories = await _categoriesService.GetAllAsync();
            return Ok(categories);
        }

        [HttpGet("parents")]
        public async Task<ActionResult<IEnumerable<Categories>>> GetParentCategories()
        {
            var parentCategories = await _categoriesService.GetParentCategoriesAsync();
            return Ok(parentCategories);
        }
    }

    public class CategoryCreate
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; } = default!;

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