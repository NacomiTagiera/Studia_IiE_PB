using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WpfRestaurant.Enums;

namespace WpfRestaurant.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.PRZYJĘTE;
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedDate { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }
        
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
} 