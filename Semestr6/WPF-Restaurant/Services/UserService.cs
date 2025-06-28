using Microsoft.EntityFrameworkCore;
using WpfRestaurant.Data;
using WpfRestaurant.Models;
using WpfRestaurant.Enums;

namespace WpfRestaurant.Services
{
    public class UserService
    {
        private readonly RestaurantDbContext _context;

        public UserService(RestaurantDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Logowanie użytkownika
        /// </summary>
        /// <param name="email">Email użytkownika</param>
        /// <param name="password">Hasło w formie tekstowej</param>
        /// <returns>Użytkownik jeśli logowanie się powiodło, null w przeciwnym przypadku</returns>
        public async Task<User?> LoginAsync(string email, string password)
        {
            // Znajdź użytkownika po emailu
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (user == null)
                return null;

            // Sprawdź hasło
            if (!PasswordService.VerifyPassword(password, user.HashedPassword))
                return null;

            return user;
        }

        /// <summary>
        /// Rejestracja nowego użytkownika
        /// </summary>
        public async Task<User> RegisterAsync(string firstName, string lastName, string email, 
            string phoneNumber, string address, string password)
        {
            // Sprawdź czy email już istnieje
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

            if (existingUser != null)
                throw new InvalidOperationException("Użytkownik z tym adresem email już istnieje");

            // Utwórz nowego użytkownika
            var user = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PhoneNumber = phoneNumber,
                Address = address,
                HashedPassword = PasswordService.HashPassword(password),
                Role = UserRole.USER,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        /// <summary>
        /// Pobiera użytkownika po ID
        /// </summary>
        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }
    }
} 