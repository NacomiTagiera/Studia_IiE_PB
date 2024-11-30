namespace StoreWebApp.Models;

using System.ComponentModel.DataAnnotations;

public class Product
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 100 characters.")]
    public required string Name { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "Description must be between 5 and 500 characters.")]
    public required string Description { get; set; }

    [Range(0.01, 10000.00, ErrorMessage = "Price must be between $0.01 and $10000.")]
    public decimal Price { get; set; } = 0;

    [Url(ErrorMessage = "Invalid URL.")]
    public string? ImageUrl { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}
