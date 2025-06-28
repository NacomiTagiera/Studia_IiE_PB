using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Windows;
using WpfRestaurant.Views;

namespace WpfRestaurant.ViewModels
{
    public partial class MainViewModel : BaseViewModel
    {
        [ObservableProperty]
        private string welcomeMessage;

        [ObservableProperty]
        private string appVersion;

        public MainViewModel()
        {
            Title = "Foodify - Zamawianie jedzenia";
            WelcomeMessage = "Witamy w aplikacji Foodify!\n\nTwoja ulubiona restauracja na wyciągnięcie ręki.\nZamów szybko, smacznie i wygodnie!";
            AppVersion = "Wersja MVP 1.0.0";
        }

        [RelayCommand]
        private void ShowLogin()
        {
            try
            {
                var loginWindow = new LoginWindow();
                loginWindow.ShowDialog();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd podczas otwierania okna logowania: {ex.Message}", 
                              "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        [RelayCommand]
        private void ShowRegister()
        {
            // TODO: Implementacja okna rejestracji
            MessageBox.Show("Okno rejestracji będzie gotowe wkrótce!", "Rejestracja", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        [RelayCommand]
        private void ShowAbout()
        {
            var aboutMessage = "Foodify - Aplikacja do zamawiania jedzenia\n\n" +
                              "Wersja: MVP 1.0.0\n" +
                              "Framework: WPF (.NET 8)\n" +
                              "Baza danych: PostgreSQL\n\n" +
                              "Funkcjonalności MVP:\n" +
                              "• Rejestracja i logowanie użytkowników\n" +
                              "• Przeglądanie menu\n" +
                              "• Składanie zamówień\n" +
                              "• Panel administratora\n" +
                              "• Zarządzanie menu";

            MessageBox.Show(aboutMessage, "O aplikacji Foodify", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        [RelayCommand]
        private void ExitApplication()
        {
            var result = MessageBox.Show(
                "Czy na pewno chcesz zakończyć pracę z aplikacją?", 
                "Wyjście", 
                MessageBoxButton.YesNo, 
                MessageBoxImage.Question);

            if (result == MessageBoxResult.Yes)
            {
                Application.Current.Shutdown();
            }
        }
    }
} 