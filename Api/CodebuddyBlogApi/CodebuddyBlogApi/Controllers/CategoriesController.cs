using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CodebuddyBlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<CategoryDto>>> GetAllCategories()
        {
            var categories = await _categoryRepository.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found" });

            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CategoryRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = await _categoryRepository.CreateCategoryAsync(dto);
            var createdCategory = await _categoryRepository.GetCategoryByIdAsync(id);

            return CreatedAtAction(nameof(GetCategoryById), new { id }, createdCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryRequestDto dto)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid category ID" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _categoryRepository.UpdateCategoryAsync(id, dto);

            if (!result)
                return NotFound(new { message = "Category not found or failed to update" });

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid category ID" });

            var result = await _categoryRepository.DeleteCategoryAsync(id);
            if (!result)
                return NotFound(new { message = "Category not found or failed to delete" });

            return NoContent();
        }
    }
}
