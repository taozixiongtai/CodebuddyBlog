using CodebuddyBlogApi.Data;
using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Models;
using SqlSugar;

namespace CodebuddyBlogApi.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly BlogDbContext _dbContext;

        public ArticleRepository(BlogDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<ArticleDto>> GetArticlesAsync(int page, int pageSize, int? categoryId = null, string? key = null)
        {
            var query = _dbContext.Db.Queryable<Article>()
                .Includes(a => a.Categories);

            // Filter by category
            if (categoryId.HasValue)
            {
                var relations = await _dbContext.ArticleCategoryRelations
                    .GetListAsync(x => x.CategoryId == categoryId.Value);
                var articleIds = relations.Select(x => x.ArticleId).ToList();

                if (!articleIds.Any())
                {
                    return new PagedResult<ArticleDto> { Page = page, PageSize = pageSize };
                }

                query = query.In(a => a.Id, articleIds);
            }

            // Filter by search key (title and content)
            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(a => a.Title.Contains(key) || a.Content.Contains(key));
            }

            RefAsync<int> totalCount = 0;
            var list = await query
                .OrderByDescending(a => a.CreatedAt)
                .ToPageListAsync(page, pageSize, totalCount);

            return new PagedResult<ArticleDto>
            {
                Items = list.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<ArticleDto?> GetArticleByIdAsync(int id)
        {
            var article = await _dbContext.Db.Queryable<Article>()
                .Includes(a => a.Categories)
                .InSingleAsync(id);

            return article == null ? null : MapToDto(article);
        }

        public async Task<int> CreateArticleAsync(ArticleRequestDto dto)
        {
            var article = new Article
            {
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _dbContext.Db.Ado.BeginTranAsync();
            try
            {
                var id = await _dbContext.Articles.InsertReturnIdentityAsync(article);
                
                if (dto.CategoryIds != null && dto.CategoryIds.Any())
                {
                    var relations = dto.CategoryIds.Select(cid => new ArticleCategoryRelation
                    {
                        ArticleId = id,
                        CategoryId = cid
                    }).ToList();
                    await _dbContext.ArticleCategoryRelations.InsertRangeAsync(relations);
                }

                await _dbContext.Db.Ado.CommitTranAsync();
                return id;
            }
            catch (Exception)
            {
                await _dbContext.Db.Ado.RollbackTranAsync();
                throw;
            }
        }

        public async Task<bool> UpdateArticleAsync(int id, ArticleRequestDto dto)
        {
            await _dbContext.Db.Ado.BeginTranAsync();
            try
            {
                var article = await _dbContext.Articles.GetByIdAsync(id);
                if (article == null) return false;

                article.Title = dto.Title;
                article.Content = dto.Content;
                article.UpdatedAt = DateTime.UtcNow;

                await _dbContext.Articles.UpdateAsync(article);

                // Update relations: delete old, insert new
                await _dbContext.ArticleCategoryRelations.DeleteAsync(x => x.ArticleId == id);
                if (dto.CategoryIds != null && dto.CategoryIds.Any())
                {
                    var relations = dto.CategoryIds.Select(cid => new ArticleCategoryRelation
                    {
                        ArticleId = id,
                        CategoryId = cid
                    }).ToList();
                    await _dbContext.ArticleCategoryRelations.InsertRangeAsync(relations);
                }

                await _dbContext.Db.Ado.CommitTranAsync();
                return true;
            }
            catch (Exception)
            {
                await _dbContext.Db.Ado.RollbackTranAsync();
                throw;
            }
        }

        public async Task<bool> DeleteArticleAsync(int id)
        {
            await _dbContext.Db.Ado.BeginTranAsync();
            try
            {
                var result = await _dbContext.Articles.DeleteByIdAsync(id);
                await _dbContext.ArticleCategoryRelations.DeleteAsync(x => x.ArticleId == id);
                
                await _dbContext.Db.Ado.CommitTranAsync();
                return result;
            }
            catch (Exception)
            {
                await _dbContext.Db.Ado.RollbackTranAsync();
                throw;
            }
        }

        private static ArticleDto MapToDto(Article article)
        {
            return new ArticleDto
            {
                Id = article.Id,
                Title = article.Title,
                Content = article.Content,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                Categories = article.Categories?.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }).ToList() ?? new List<CategoryDto>()
            };
        }
    }
}
