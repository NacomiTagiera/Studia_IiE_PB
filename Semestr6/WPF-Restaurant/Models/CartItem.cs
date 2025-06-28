using CommunityToolkit.Mvvm.ComponentModel;

namespace WpfRestaurant.Models
{
    /// <summary>
    /// Klasa reprezentująca pozycję w koszyku użytkownika
    /// </summary>
    public class CartItem : ObservableObject
    {
        public MenuItem MenuItem { get; set; } = null!;
        
        private int _quantity;
        public int Quantity
        {
            get => _quantity;
            set => SetProperty(ref _quantity, value);
        }

        private decimal _totalPrice;
        public decimal TotalPrice
        {
            get => _totalPrice;
            set => SetProperty(ref _totalPrice, value);
        }
    }
} 