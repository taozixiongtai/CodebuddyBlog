using SqlSugar;

namespace CodebuddyBlogApi.Models
{
    [SugarTable("Article")]
    public class Article
    {
        [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
        public int Id { get; set; }

        [SugarColumn(Length = 200)]
        public string Title { get; set; } = string.Empty;

        [SugarColumn(ColumnDataType = "TEXT")]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        [Navigate(typeof(ArticleCategoryRelation), nameof(ArticleCategoryRelation.ArticleId), nameof(ArticleCategoryRelation.CategoryId))]
        public List<Category> Categories { get; set; } = new();
    }
}
