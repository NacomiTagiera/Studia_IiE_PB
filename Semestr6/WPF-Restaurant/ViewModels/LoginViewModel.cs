using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Windows;
using WpfRestaurant.Services;
using WpfRestaurant.Data;
using WpfRestaurant.Models;
using WpfRestaurant.Enums;
using WpfRestaurant.Views;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace WpfRestaurant.ViewModels
{
    public partial class LoginViewModel : BaseViewModel
    {
        private readonly UserService _userService;
        private readonly MenuService _menuService;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Email jest wymagany")]
        [EmailAddress(ErrorMessage = "Nieprawidłowy format email")]
        private string email = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Hasło jest wymagane")]
        [MinLength(8, ErrorMessage = "Hasło musi mieć minimum 8 znaków")]
        private string password = string.Empty;

        [ObservableProperty]
        private string errorMessage = string.Empty;

        [ObservableProperty]
        private bool isLoginEnabled = true;

        public event EventHandler<bool>? LoginCompleted;
        public event EventHandler? NavigateToRegister;

        public LoginViewModel()
        {
            Title = "Logowanie do Foodify";
            
            // Inicjalizacja serwisów z bazą danych - używamy connection string z appsettings.json
            var optionsBuilder = new DbContextOptionsBuilder<RestaurantDbContext>();
            optionsBuilder.UseNpgsql(ConfigurationService.GetConnectionString());
            
            var context = new RestaurantDbContext(optionsBuilder.Options);
            _userService = new UserService(context);
            _menuService = new MenuService(context);
        }

        [RelayCommand]
        private async Task LoginAsync()
        {
            try
            {
                IsBusy = true;
                IsLoginEnabled = false;
                ErrorMessage = string.Empty;

                // Walidacja danych wejściowych
                ValidateAllProperties();

                // Prawdziwe logowanie z bazą danych
                var user = await _userService.LoginAsync(Email, Password);
                
                if (user == null)
                {
                    ErrorMessage = "Nieprawidłowy email lub hasło";
                    return;
                }

                // Sukces logowania - otwórz odpowiedni panel
                OpenUserPanel(user);
                
                LoginCompleted?.Invoke(this, true);
            }
            catch (Npgsql.PostgresException pgEx) when (pgEx.SqlState == "XX000")
            {
                ErrorMessage = "Błąd połączenia z bazą danych. Sprawdź connection string w dashboard Neon.tech lub użyj lokalnej bazy PostgreSQL.";
            }
            catch (Exception ex) when (ex.Message.Contains("endpoint could not be found"))
            {
                ErrorMessage = "Baza danych Neon.tech nie jest dostępna. Sprawdź connection string lub użyj lokalnej bazy PostgreSQL.";
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Błąd logowania: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
                IsLoginEnabled = true;
            }
        }

        [RelayCommand]
        private void ShowRegister()
        {
            NavigateToRegister?.Invoke(this, EventArgs.Empty);
        }

        [RelayCommand]
        private void ClearForm()
        {
            Email = string.Empty;
            Password = string.Empty;
            ErrorMessage = string.Empty;
            ClearErrors();
        }

        private void OpenUserPanel(User user)
        {
            if (user.Role == UserRole.ADMIN)
            {
                // Otwórz panel administratora
                var adminPanel = new AdminPanelWindow();
                
                // Utwórz nowy kontekst bazy danych dla panelu admina
                var dbContext = new RestaurantDbContext(GetDbContextOptions());
                var orderService = new OrderService(dbContext);
                var printService = new PrintService();
                
                var adminViewModel = new AdminPanelViewModel(user, _menuService, orderService, printService);
                adminPanel.DataContext = adminViewModel;
                
                // Zamknij okno logowania i pokaż panel admina
                Application.Current.Dispatcher.Invoke(() =>
                {
                    adminPanel.Show();
                    
                    // Znajdź i zamknij okno logowania
                    var loginWindow = Application.Current.Windows.OfType<LoginWindow>().FirstOrDefault();
                    loginWindow?.Close();
                });
            }
            else
            {
                // Otwórz główny widok użytkownika z menu i koszykiem
                var mainWindow = new MainWindow(user);
                
                Application.Current.Dispatcher.Invoke(() =>
                {
                    mainWindow.Show();
                    
                    // Znajdź i zamknij okno logowania
                    var loginWindow = Application.Current.Windows.OfType<LoginWindow>().FirstOrDefault();
                    loginWindow?.Close();
                });
            }
        }

        private DbContextOptions<RestaurantDbContext> GetDbContextOptions()
        {
            var optionsBuilder = new DbContextOptionsBuilder<RestaurantDbContext>();
            optionsBuilder.UseNpgsql(ConfigurationService.GetConnectionString());
            return optionsBuilder.Options;
        }

        partial void OnEmailChanged(string value)
        {
            // Walidacja w czasie rzeczywistym
            ValidateProperty(value, nameof(Email));
        }

        partial void OnPasswordChanged(string value)
        {
            // Walidacja w czasie rzeczywistym
            ValidateProperty(value, nameof(Password));
        }
    }
} 