using System.Windows;
using WpfRestaurant.ViewModels;
using WpfRestaurant.Models;
using WpfRestaurant.Services;
using WpfRestaurant.Data;
using Microsoft.EntityFrameworkCore;

namespace WpfRestaurant
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow(User currentUser)
        {
            InitializeComponent();
            
            // Inicjalizacja serwisów
            var optionsBuilder = new DbContextOptionsBuilder<RestaurantDbContext>();
            optionsBuilder.UseNpgsql(ConfigurationService.GetConnectionString());
            
            var context = new RestaurantDbContext(optionsBuilder.Options);
            var menuService = new MenuService(context);
            var orderService = new OrderService(context);
            var printService = new PrintService();
            
            // Ustaw ViewModel
            DataContext = new MainUserViewModel(currentUser, menuService, orderService, printService);
        }
    }
}