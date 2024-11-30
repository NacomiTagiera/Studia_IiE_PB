namespace StoreWebApp.Models;

using System.ComponentModel.DataAnnotations;

public class Category
{
    public int Id { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 50 characters.")]
    public required string Name { get; set; }

    public ICollection<Product> Products { get; set; }
}
