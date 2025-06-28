using System.Windows;
using WpfRestaurant.ViewModels;

namespace WpfRestaurant.Views
{
    /// <summary>
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        private LoginViewModel? _viewModel;

        public LoginWindow()
        {
            InitializeComponent();
            
            _viewModel = new LoginViewModel();
            DataContext = _viewModel;

            // Subskrypcja eventów ViewModel
            _viewModel.LoginCompleted += OnLoginCompleted;
            _viewModel.NavigateToRegister += OnNavigateToRegister;
            
            // Obsługa PasswordBox (nie obsługuje bindingu standardowego)
            PasswordBox.PasswordChanged += (s, e) =>
            {
                if (_viewModel != null)
                {
                    _viewModel.Password = PasswordBox.Password;
                }
            };
        }

        private void OnLoginCompleted(object? sender, bool success)
        {
            if (success)
            {
                // Logowanie obsługiwane jest już w LoginViewModel
                // (otwiera odpowiedni panel i zamyka okno logowania)
            }
        }

        private void OnNavigateToRegister(object? sender, EventArgs e)
        {
            // Przejście do okna rejestracji
            var registerWindow = new RegisterWindow();
            registerWindow.Show();
            this.Close();
        }

        protected override void OnClosed(EventArgs e)
        {
            // Odsubskrypcja eventów
            if (_viewModel != null)
            {
                _viewModel.LoginCompleted -= OnLoginCompleted;
                _viewModel.NavigateToRegister -= OnNavigateToRegister;
            }
            base.OnClosed(e);
        }
    }
} 