using System.ComponentModel.DataAnnotations;

namespace CodebuddyBlogApi.DTOs
{
    public class CategoryRequestDto
    {
        [Required(ErrorMessage = "Category name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;
    }
}
