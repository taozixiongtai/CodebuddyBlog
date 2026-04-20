using CodebuddyBlogApi.DTOs;
using CodebuddyBlogApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CodebuddyBlogApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleRepository _articleRepository;

        public ArticlesController(IArticleRepository articleRepository)
        {
            _articleRepository = articleRepository;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ArticleDto>>> GetArticles([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? categoryId = null, [FromQuery] string? key = null)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _articleRepository.GetArticlesAsync(page, pageSize, categoryId, key);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArticleDto>> GetArticleById(int id)
        {
            var article = await _articleRepository.GetArticleByIdAsync(id);
            if (article == null)
                return NotFound(new { message = "Article not found" });

            return Ok(article);
        }

        [HttpPost]
        public async Task<ActionResult<ArticleDto>> CreateArticle([FromBody] ArticleCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = await _articleRepository.CreateArticleAsync(dto);
            var createdArticle = await _articleRepository.GetArticleByIdAsync(id);
            
            return CreatedAtAction(nameof(GetArticleById), new { id }, createdArticle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, [FromBody] ArticleUpdateDto dto)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid article ID" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _articleRepository.UpdateArticleAsync(id, dto);

            if (!result)
                return NotFound(new { message = "Article not found or failed to update" });

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid article ID" });

            var result = await _articleRepository.DeleteArticleAsync(id);
            if (!result)
                return NotFound(new { message = "Article not found or failed to delete" });

            return NoContent();
        }
    }
}
