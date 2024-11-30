namespace StoreWebApp.Models;

using System.ComponentModel.DataAnnotations;

public class OrderItem
{
    [Required]
    public int OrderId { get; set; }

    public Order Order { get; set; }

    [Required]
    public int ProductId { get; set; }

    public Product Product { get; set; }

    [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100.")]
    public int Quantity { get; set; } = 1;
}
