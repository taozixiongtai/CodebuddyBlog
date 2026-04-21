using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Models;

namespace CodebuddyBlogApi.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task<int> CreateCategoryAsync(CategoryRequestDto dto);
        Task<bool> UpdateCategoryAsync(int id, CategoryRequestDto dto);
        Task<bool> DeleteCategoryAsync(int id);
    }
}
