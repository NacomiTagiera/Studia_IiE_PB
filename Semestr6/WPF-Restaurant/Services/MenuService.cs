using Microsoft.EntityFrameworkCore;
using WpfRestaurant.Data;
using WpfRestaurant.Models;

namespace WpfRestaurant.Services
{
    public class MenuService
    {
        private readonly RestaurantDbContext _context;

        public MenuService(RestaurantDbContext context)
        {
            _context = context;
        }

        #region Categories

        /// <summary>
        /// Pobiera wszystkie kategorie
        /// </summary>
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Dodaje nową kategorię
        /// </summary>
        public async Task<Category> AddCategoryAsync(string name, string? description = null)
        {
            var category = new Category
            {
                Name = name,
                Description = description,
                CreatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        /// <summary>
        /// Aktualizuje kategorię
        /// </summary>
        public async Task<Category> UpdateCategoryAsync(int categoryId, string name, string? description = null)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
                throw new ArgumentException("Kategoria nie została znaleziona");

            category.Name = name;
            category.Description = description;

            await _context.SaveChangesAsync();
            return category;
        }

        /// <summary>
        /// Usuwa kategorię (tylko jeśli nie ma przypisanych pozycji menu)
        /// </summary>
        public async Task DeleteCategoryAsync(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.MenuItems)
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null)
                throw new ArgumentException("Kategoria nie została znaleziona");

            if (category.MenuItems.Any())
                throw new InvalidOperationException("Nie można usunąć kategorii, która ma przypisane pozycje menu");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        #endregion

        #region Menu Items

        /// <summary>
        /// Pobiera wszystkie pozycje menu z kategoriami
        /// </summary>
        public async Task<List<MenuItem>> GetAllMenuItemsAsync()
        {
            return await _context.MenuItems
                .Include(m => m.Category)
                .OrderBy(m => m.Category.Name)
                .ThenBy(m => m.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Pobiera aktywne pozycje menu
        /// </summary>
        public async Task<List<MenuItem>> GetActiveMenuItemsAsync()
        {
            return await _context.MenuItems
                .Include(m => m.Category)
                .Where(m => m.IsActive)
                .OrderBy(m => m.Category.Name)
                .ThenBy(m => m.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Pobiera pozycje menu według kategorii
        /// </summary>
        public async Task<List<MenuItem>> GetMenuItemsByCategoryAsync(int categoryId)
        {
            return await _context.MenuItems
                .Include(m => m.Category)
                .Where(m => m.CategoryId == categoryId)
                .OrderBy(m => m.Name)
                .ToListAsync();
        }

        /// <summary>
        /// Dodaje nową pozycję menu
        /// </summary>
        public async Task<MenuItem> AddMenuItemAsync(string name, string? description, decimal price, int categoryId)
        {
            // Sprawdź czy kategoria istnieje
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
                throw new ArgumentException("Kategoria nie została znaleziona");

            var menuItem = new MenuItem
            {
                Name = name,
                Description = description,
                Price = price,
                CategoryId = categoryId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            // Załaduj kategorię dla zwróconego obiektu
            await _context.Entry(menuItem)
                .Reference(m => m.Category)
                .LoadAsync();

            return menuItem;
        }

        /// <summary>
        /// Aktualizuje pozycję menu
        /// </summary>
        public async Task<MenuItem> UpdateMenuItemAsync(int menuItemId, string name, string? description, 
            decimal price, int categoryId, bool isActive)
        {
            var menuItem = await _context.MenuItems.FindAsync(menuItemId);
            if (menuItem == null)
                throw new ArgumentException("Pozycja menu nie została znaleziona");

            // Sprawdź czy kategoria istnieje
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
                throw new ArgumentException("Kategoria nie została znaleziona");

            menuItem.Name = name;
            menuItem.Description = description;
            menuItem.Price = price;
            menuItem.CategoryId = categoryId;
            menuItem.IsActive = isActive;

            await _context.SaveChangesAsync();

            // Załaduj kategorię
            await _context.Entry(menuItem)
                .Reference(m => m.Category)
                .LoadAsync();

            return menuItem;
        }

        /// <summary>
        /// Przełącza status aktywności pozycji menu
        /// </summary>
        public async Task<MenuItem> ToggleMenuItemActiveAsync(int menuItemId)
        {
            var menuItem = await _context.MenuItems.FindAsync(menuItemId);
            if (menuItem == null)
                throw new ArgumentException("Pozycja menu nie została znaleziona");

            menuItem.IsActive = !menuItem.IsActive;
            await _context.SaveChangesAsync();

            return menuItem;
        }

        /// <summary>
        /// Usuwa pozycję menu (sprawdza czy nie ma powiązanych zamówień)
        /// </summary>
        public async Task DeleteMenuItemAsync(int menuItemId)
        {
            var menuItem = await _context.MenuItems
                .Include(m => m.OrderItems)
                .FirstOrDefaultAsync(m => m.Id == menuItemId);

            if (menuItem == null)
                throw new ArgumentException("Pozycja menu nie została znaleziona");

            if (menuItem.OrderItems.Any())
                throw new InvalidOperationException("Nie można usunąć pozycji menu, która ma powiązane zamówienia");

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();
        }

        #endregion
    }
} 