using Microsoft.EntityFrameworkCore;
using StoreWebApp.Models;

namespace StoreWebApp.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public required DbSet<User> Users { get; set; }
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Category> Categories { get; set; }
    public required DbSet<Order> Orders { get; set; }
    public required DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<OrderItem>()
            .HasKey(oi => new { oi.OrderId, oi.ProductId });

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId);

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Electronics" },
            new Category { Id = 2, Name = "Books" },
            new Category { Id = 3, Name = "Clothing" }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = 1,
                Name = "Smartphone",
                Description = "Latest 5G-enabled smartphone.",
                Price = 699.99m,
                ImageUrl = "https://via.placeholder.com/150",
                CategoryId = 1
            },
            new Product
            {
                Id = 2,
                Name = "Laptop",
                Description = "High-performance laptop for professionals.",
                Price = 999.99m,
                ImageUrl = "https://via.placeholder.com/150",
                CategoryId = 1
            },
            new Product
            {
                Id = 3,
                Name = "Novel: 'The Great Gatsby'",
                Description = "A classic piece of American literature.",
                Price = 14.99m,
                ImageUrl = "https://via.placeholder.com/150",
                CategoryId = 2
            },
            new Product
            {
                Id = 4,
                Name = "T-shirt",
                Description = "Cotton T-shirt in various sizes.",
                Price = 19.99m,
                ImageUrl = "https://via.placeholder.com/150",
                CategoryId = 3
            }
        );
    }
}
