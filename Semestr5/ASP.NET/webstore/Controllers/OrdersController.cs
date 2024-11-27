using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreWebApp.Data;
using StoreWebApp.Models;

namespace StoreWebApp.Controllers
{
    public class OrdersController(AppDbContext context) : Controller
    {
        private readonly AppDbContext _context = context;

        public IActionResult Create()
        {
            var products = _context.Products.ToList();
            return View(products);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string firstName, string lastName, string email, string address, int[] productIds) { 
            if(productIds == null || productIds.Length == 0)
            {
                return RedirectToAction("Create");
            }

            var user = new User 
                { 
                    Name = firstName,
                    Surname = lastName,
                    Email = email,
                    Address = address
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var order = new Order
                {
                    OrderDate = DateTime.UtcNow,
                    UserId = user.Id,
                    OrderItems = productIds.Select(productId => new OrderItem { ProductId = productId, Quantity=1 }).ToList()
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

            return RedirectToAction("Success", new { orderId = order.Id });

        }

        public async Task<IActionResult> Success(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        public async Task<IActionResult> OrderHistory(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Orders)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }
    }
}