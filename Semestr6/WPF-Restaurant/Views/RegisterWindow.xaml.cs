using System.Windows;
using WpfRestaurant.ViewModels;

namespace WpfRestaurant.Views
{
    /// <summary>
    /// Interaction logic for RegisterWindow.xaml
    /// </summary>
    public partial class RegisterWindow : Window
    {
        private RegisterViewModel? _viewModel;

        public RegisterWindow()
        {
            InitializeComponent();
            
            _viewModel = new RegisterViewModel();
            DataContext = _viewModel;

            // Subskrypcja eventów ViewModel
            _viewModel.RegistrationCompleted += OnRegistrationCompleted;
            _viewModel.NavigateToLogin += OnNavigateToLogin;
        }

        private void PasswordBox_PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (_viewModel != null && sender is System.Windows.Controls.PasswordBox passwordBox)
            {
                _viewModel.Password = passwordBox.Password;
            }
        }

        private void ConfirmPasswordBox_PasswordChanged(object sender, RoutedEventArgs e)
        {
            if (_viewModel != null && sender is System.Windows.Controls.PasswordBox passwordBox)
            {
                _viewModel.ConfirmPassword = passwordBox.Password;
            }
        }

        private void OnRegistrationCompleted(object? sender, Models.User user)
        {
            // Automatyczne przeniesienie do głównego widoku użytkownika
            var mainWindow = new MainWindow(user);
            mainWindow.Show();
            this.Close();
        }

        private void OnNavigateToLogin(object? sender, EventArgs e)
        {
            // Powrót do okna logowania
            var loginWindow = new LoginWindow();
            loginWindow.Show();
            this.Close();
        }

        protected override void OnClosed(EventArgs e)
        {
            // Odsubskrypcja eventów
            if (_viewModel != null)
            {
                _viewModel.RegistrationCompleted -= OnRegistrationCompleted;
                _viewModel.NavigateToLogin -= OnNavigateToLogin;
            }
            base.OnClosed(e);
        }
    }
} 