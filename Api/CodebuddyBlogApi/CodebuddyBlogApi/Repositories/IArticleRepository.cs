using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Models;

namespace CodebuddyBlogApi.Repositories
{
    public interface IArticleRepository
    {
        Task<PagedResult<ArticleDto>> GetArticlesAsync(int page, int pageSize, int? categoryId = null);
        Task<ArticleDto?> GetArticleByIdAsync(int id);
        Task<int> CreateArticleAsync(ArticleCreateDto dto);
        Task<bool> UpdateArticleAsync(int id, ArticleUpdateDto dto);
        Task<bool> DeleteArticleAsync(int id);
    }
}
