using CodebuddyBlogApi.Data;
using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Models;

namespace CodebuddyBlogApi.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly BlogDbContext _dbContext;

        public CategoryRepository(BlogDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _dbContext.Categories.GetListAsync();
            return categories.Select(MapToDto).ToList();
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _dbContext.Categories.GetByIdAsync(id);
            return category == null ? null : MapToDto(category);
        }

        public async Task<int> CreateCategoryAsync(CategoryRequestDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _dbContext.Categories.InsertAsync(category);
            return category.Id;
        }

        public async Task<bool> UpdateCategoryAsync(int id, CategoryRequestDto dto)
        {
            var category = await _dbContext.Categories.GetByIdAsync(id);
            if (category == null) return false;

            category.Name = dto.Name;
            category.UpdatedAt = DateTime.UtcNow;

            return await _dbContext.Categories.UpdateAsync(category);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            await _dbContext.Db.Ado.BeginTranAsync();
            try
            {
                var result = await _dbContext.Categories.DeleteByIdAsync(id);
                // Also clean up relations
                await _dbContext.ArticleCategoryRelations.DeleteAsync(x => x.CategoryId == id);
                
                await _dbContext.Db.Ado.CommitTranAsync();
                return result;
            }
            catch (Exception)
            {
                await _dbContext.Db.Ado.RollbackTranAsync();
                throw;
            }
        }

        private static CategoryDto MapToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }
    }
}
