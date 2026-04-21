using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Models;

namespace CodebuddyBlogApi.Repositories
{
    public interface IArticleRepository
    {
        Task<PagedResult<ArticleDto>> GetArticlesAsync(int page, int pageSize, int? categoryId = null, string? key = null);
        Task<ArticleDto?> GetArticleByIdAsync(int id);
        Task<int> CreateArticleAsync(ArticleRequestDto dto);
        Task<bool> UpdateArticleAsync(int id, ArticleRequestDto dto);
        Task<bool> DeleteArticleAsync(int id);
    }
}
