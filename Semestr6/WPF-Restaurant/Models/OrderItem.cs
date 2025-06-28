using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WpfRestaurant.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        public int MenuItemId { get; set; }
        
        [Required]
        [Range(1, 10)]
        public int Quantity { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal UnitPrice { get; set; }
        
        public virtual Order Order { get; set; } = null!;
        public virtual MenuItem MenuItem { get; set; } = null!;
    }
} 