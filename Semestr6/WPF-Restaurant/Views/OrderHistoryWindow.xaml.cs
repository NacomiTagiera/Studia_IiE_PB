using System.Windows;
using WpfRestaurant.ViewModels;

namespace WpfRestaurant.Views
{
    /// <summary>
    /// Interaction logic for OrderHistoryWindow.xaml
    /// </summary>
    public partial class OrderHistoryWindow : Window
    {
        public OrderHistoryWindow()
        {
            InitializeComponent();
        }

        public OrderHistoryWindow(OrderHistoryViewModel viewModel) : this()
        {
            DataContext = viewModel;
        }
    }
} 