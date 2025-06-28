using Microsoft.EntityFrameworkCore;
using WpfRestaurant.Data;
using WpfRestaurant.Models;
using WpfRestaurant.Enums;

namespace WpfRestaurant.Services
{
    public class OrderService
    {
        private readonly RestaurantDbContext _context;

        public OrderService(RestaurantDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Pobiera historię zamówień dla danego użytkownika
        /// </summary>
        public async Task<List<Order>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                        .ThenInclude(mi => mi.Category)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        /// <summary>
        /// Pobiera zamówienie po ID wraz ze szczegółami
        /// </summary>
        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                        .ThenInclude(mi => mi.Category)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        /// <summary>
        /// Tworzy nowe zamówienie
        /// </summary>
        public async Task<Order> CreateOrderAsync(int userId, List<CartItem> cartItems)
        {
            if (!cartItems.Any())
                throw new ArgumentException("Koszyk nie może być pusty");

            var order = new Order
            {
                UserId = userId,
                Status = OrderStatus.PRZYJĘTE,
                OrderDate = DateTime.UtcNow,
                TotalAmount = cartItems.Sum(ci => ci.TotalPrice)
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Zapisz żeby otrzymać ID zamówienia

            // Dodaj pozycje zamówienia
            foreach (var cartItem in cartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    MenuItemId = cartItem.MenuItem.Id,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.MenuItem.Price
                };

                _context.OrderItems.Add(orderItem);
            }

            await _context.SaveChangesAsync();

            // Załaduj pełne dane zamówienia do zwrócenia
            return await GetOrderByIdAsync(order.Id) ?? order;
        }

        /// <summary>
        /// Aktualizuje status zamówienia (dla administratora)
        /// </summary>
        public async Task<Order> UpdateOrderStatusAsync(int orderId, OrderStatus newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                throw new ArgumentException("Zamówienie nie zostało znalezione");

            order.Status = newStatus;
            
            if (newStatus == OrderStatus.ZREALIZOWANE && order.CompletedDate == null)
            {
                order.CompletedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return order;
        }

        /// <summary>
        /// Pobiera wszystkie zamówienia (dla administratora)
        /// </summary>
        public async Task<List<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        /// <summary>
        /// Pobiera zamówienia według statusu
        /// </summary>
        public async Task<List<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        /// <summary>
        /// Pobiera statystyki zamówień
        /// </summary>
        public async Task<OrderStats> GetOrderStatsAsync()
        {
            var allOrders = await _context.Orders.ToListAsync();
            
            return new OrderStats
            {
                TotalOrders = allOrders.Count,
                PendingOrders = allOrders.Count(o => o.Status == OrderStatus.PRZYJĘTE),
                InProgressOrders = allOrders.Count(o => o.Status == OrderStatus.W_PRZYGOTOWANIU),
                CompletedOrders = allOrders.Count(o => o.Status == OrderStatus.ZREALIZOWANE),
                TotalRevenue = allOrders.Where(o => o.Status == OrderStatus.ZREALIZOWANE)
                                      .Sum(o => o.TotalAmount)
            };
        }
    }

    /// <summary>
    /// Klasa do statystyk zamówień
    /// </summary>
    public class OrderStats
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int InProgressOrders { get; set; }
        public int CompletedOrders { get; set; }
        public decimal TotalRevenue { get; set; }
    }
} 