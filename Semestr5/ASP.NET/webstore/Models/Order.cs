namespace StoreWebApp.Models;

using System.ComponentModel.DataAnnotations;

public class Order
{
    public int Id { get; set; }

    [Required]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Required]
    public int UserId { get; set; }

    public User User { get; set; }

    [Required]
    public ICollection<OrderItem> OrderItems { get; set; }
}
