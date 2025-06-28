using Microsoft.EntityFrameworkCore;
using WpfRestaurant.Models;
using WpfRestaurant.Enums;

namespace WpfRestaurant.Data
{
    public class RestaurantDbContext : DbContext
    {
        public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasConversion<string>();
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // MenuItem configuration
            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.MenuItems)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict); // Zapobiega usunięciu kategorii z pozycjami
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).HasConversion<string>();
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.MenuItem)
                      .WithMany(m => m.OrderItems)
                      .HasForeignKey(e => e.MenuItemId)
                      .OnDelete(DeleteBehavior.Restrict); // Zapobiega usunięciu pozycji menu z zamówieniami
            });

            // Seed data (opcjonalne - podstawowy admin)
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Statyczna data dla seed data (unikamy DateTime.UtcNow)
            var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // Poprawny hash dla hasła "admin123" wygenerowany przez BCrypt z 12 rundami
            var adminPasswordHash = "$2a$12$s3Q3C9vjCrilLHxncqaFte2PzUFOoXj9Plkx98Stxo/OS2HRIGZnW";

            // Domyślny administrator (hasło: admin123 - zahashowane)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@foodify.com",
                    HashedPassword = adminPasswordHash,
                    FirstName = "Administrator",
                    LastName = "Foodify",
                    PhoneNumber = "+48123456789",
                    Address = "ul. Administratorska 1, 00-001 Warszawa",
                    Role = UserRole.ADMIN,
                    CreatedAt = seedDate
                }
            );

            // Przykładowe kategorie
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Przystawki", Description = "Lekkie przekąski na początek", CreatedAt = seedDate },
                new Category { Id = 2, Name = "Dania główne", Description = "Sycące główne posiłki", CreatedAt = seedDate },
                new Category { Id = 3, Name = "Desery", Description = "Słodkie zakończenie posiłku", CreatedAt = seedDate },
                new Category { Id = 4, Name = "Napoje", Description = "Orzeźwiające napoje", CreatedAt = seedDate }
            );
        }
    }
} 