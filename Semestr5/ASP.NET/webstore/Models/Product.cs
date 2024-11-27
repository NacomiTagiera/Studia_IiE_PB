namespace StoreWebApp.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; } = 0;
    public string? ImageUrl { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}
