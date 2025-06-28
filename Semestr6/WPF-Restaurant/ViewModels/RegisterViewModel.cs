using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.ComponentModel.DataAnnotations;
using WpfRestaurant.Services;
using WpfRestaurant.Data;
using WpfRestaurant.Models;
using Microsoft.EntityFrameworkCore;

namespace WpfRestaurant.ViewModels
{
    public partial class RegisterViewModel : BaseViewModel
    {
        private readonly UserService _userService;
        private readonly MenuService _menuService;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Imię jest wymagane")]
        [MaxLength(100, ErrorMessage = "Imię może mieć maksymalnie 100 znaków")]
        private string firstName = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Nazwisko jest wymagane")]
        [MaxLength(100, ErrorMessage = "Nazwisko może mieć maksymalnie 100 znaków")]
        private string lastName = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Email jest wymagany")]
        [EmailAddress(ErrorMessage = "Nieprawidłowy format email")]
        [MaxLength(255, ErrorMessage = "Email może mieć maksymalnie 255 znaków")]
        private string email = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Numer telefonu jest wymagany")]
        [Phone(ErrorMessage = "Nieprawidłowy format numeru telefonu")]
        [MaxLength(20, ErrorMessage = "Numer telefonu może mieć maksymalnie 20 znaków")]
        private string phoneNumber = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Adres jest wymagany")]
        [MaxLength(500, ErrorMessage = "Adres może mieć maksymalnie 500 znaków")]
        private string address = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Hasło jest wymagane")]
        [MinLength(8, ErrorMessage = "Hasło musi mieć minimum 8 znaków")]
        private string password = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Potwierdzenie hasła jest wymagane")]
        private string confirmPassword = string.Empty;

        [ObservableProperty]
        private string errorMessage = string.Empty;

        [ObservableProperty]
        private string successMessage = string.Empty;

        [ObservableProperty]
        private bool isRegisterEnabled = true;

        public event EventHandler<User>? RegistrationCompleted;
        public event EventHandler? NavigateToLogin;

        public RegisterViewModel()
        {
            Title = "Rejestracja w Foodify";
            
            try
            {
                var optionsBuilder = new DbContextOptionsBuilder<RestaurantDbContext>();
                optionsBuilder.UseNpgsql(ConfigurationService.GetConnectionString());
                
                var context = new RestaurantDbContext(optionsBuilder.Options);
                _userService = new UserService(context);
                _menuService = new MenuService(context);
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Błąd inicjalizacji: {ex.Message}";
            }
        }

        [RelayCommand]
        private async Task RegisterAsync()
        {
            try
            {
                IsBusy = true;
                IsRegisterEnabled = false;
                ErrorMessage = string.Empty;
                SuccessMessage = string.Empty;

                // Sprawdź czy serwisy są zainicjalizowane
                if (_userService == null)
                {
                    ErrorMessage = "Błąd: Serwis użytkowników nie jest zainicjalizowany";
                    return;
                }

                ValidateAllProperties();
                // if (HasErrors)
                // {
                //     ErrorMessage = "Proszę poprawić błędy walidacji";
                //     return;
                // }

                if (Password != ConfirmPassword)
                {
                    ErrorMessage = "Hasła nie są zgodne";
                    return;
                }

                var passwordErrors = PasswordService.ValidatePassword(Password);
                if (passwordErrors.Count > 0)
                {
                    ErrorMessage = string.Join("\n", passwordErrors);
                    return;
                }

                if (string.IsNullOrEmpty(FirstName) || string.IsNullOrEmpty(LastName) || 
                    string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password))
                {
                    ErrorMessage = "Wszystkie pola są wymagane";
                    return;
                }

                var newUser = await _userService.RegisterAsync(
                    FirstName, 
                    LastName, 
                    Email, 
                    PhoneNumber, 
                    Address, 
                    Password);

                SuccessMessage = $"Witaj {newUser.FirstName}! Rejestracja przebiegła pomyślnie. Automatyczne logowanie...";
                await Task.Delay(1500); // Pokazanie komunikatu

                RegistrationCompleted?.Invoke(this, newUser);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("już istnieje"))
            {
                ErrorMessage = "Użytkownik z tym adresem email już istnieje. Spróbuj się zalogować.";
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Błąd rejestracji: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
                IsRegisterEnabled = true;
            }
        }

        [RelayCommand]
        private void ShowLogin()
        {
            NavigateToLogin?.Invoke(this, EventArgs.Empty);
        }

        [RelayCommand]
        private void ClearForm()
        {
            FirstName = string.Empty;
            LastName = string.Empty;
            Email = string.Empty;
            PhoneNumber = string.Empty;
            Address = string.Empty;
            Password = string.Empty;
            ConfirmPassword = string.Empty;
            ErrorMessage = string.Empty;
            SuccessMessage = string.Empty;
            ClearErrors();
        }

        partial void OnPasswordChanged(string value)
        {
            ValidateProperty(value, nameof(Password));
            if (!string.IsNullOrEmpty(ConfirmPassword))
            {
                ValidateProperty(ConfirmPassword, nameof(ConfirmPassword));
            }
        }

        partial void OnConfirmPasswordChanged(string value)
        {
            ValidateProperty(value, nameof(ConfirmPassword));
        }

        partial void OnEmailChanged(string value)
        {
            ValidateProperty(value, nameof(Email));
        }

        partial void OnFirstNameChanged(string value)
        {
            ValidateProperty(value, nameof(FirstName));
        }

        partial void OnLastNameChanged(string value)
        {
            ValidateProperty(value, nameof(LastName));
        }

        partial void OnPhoneNumberChanged(string value)
        {
            ValidateProperty(value, nameof(PhoneNumber));
        }

        partial void OnAddressChanged(string value)
        {
            ValidateProperty(value, nameof(Address));
        }
    }
} 