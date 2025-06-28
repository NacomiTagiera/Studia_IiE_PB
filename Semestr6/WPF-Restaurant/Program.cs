using System.Windows;
using WpfRestaurant.Services;

namespace WpfRestaurant
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            // Sprawdź argumenty uruchamiania
            if (e.Args.Length > 0 && e.Args[0] == "--generate-hash" && e.Args.Length > 1)
            {
                var password = e.Args[1];
                var hash = PasswordService.HashPassword(password);
                Console.WriteLine($"Hasło: {password}");
                Console.WriteLine($"Hash: {hash}");
                
                // Sprawdź także hash z seed data
                var seedHash = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewNKC9WGS6.K6N7O";
                var isValid = PasswordService.VerifyPassword(password, seedHash);
                Console.WriteLine($"Seed hash jest poprawny: {isValid}");
                
                Shutdown();
                return;
            }

            base.OnStartup(e);
        }
    }
} 