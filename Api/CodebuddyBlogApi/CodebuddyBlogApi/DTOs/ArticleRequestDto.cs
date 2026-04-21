using System.ComponentModel.DataAnnotations;

namespace CodebuddyBlogApi.DTOs
{
    public class ArticleRequestDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Content is required")]
        public string Content { get; set; } = string.Empty;

        public List<int> CategoryIds { get; set; } = new();
    }
}
