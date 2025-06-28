using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.Windows;
using WpfRestaurant.Services;
using WpfRestaurant.Models;
using WpfRestaurant.Views;
using WpfRestaurant.Data;
using Microsoft.EntityFrameworkCore;

namespace WpfRestaurant.ViewModels
{
    public partial class MainUserViewModel : BaseViewModel
    {
        private readonly User _currentUser;
        private readonly MenuService _menuService;
        private readonly OrderService _orderService;
        private readonly PrintService _printService;

        [ObservableProperty]
        private string welcomeText = string.Empty;

        [ObservableProperty]
        private ObservableCollection<Category> categories = new();

        [ObservableProperty]
        private ObservableCollection<MenuItem> allMenuItems = new();

        [ObservableProperty]
        private ObservableCollection<MenuItem> filteredMenuItems = new();

        [ObservableProperty]
        private ObservableCollection<CartItem> cartItems = new();

        [ObservableProperty]
        private Category? selectedCategory;

        [ObservableProperty]
        private decimal totalAmount;

        [ObservableProperty]
        private bool hasCartItems;

        [ObservableProperty]
        private string cartButtonText = "🛒 Koszyk (0)";

        [ObservableProperty]
        private string searchQuery = string.Empty;

        [ObservableProperty]
        private string searchResultsText = string.Empty;

        private Timer? _searchTimer;

        public MainUserViewModel(User currentUser, MenuService menuService, OrderService orderService, PrintService printService)
        {
            _currentUser = currentUser;
            _menuService = menuService;
            _orderService = orderService;
            _printService = printService;
            
            Title = "Foodify - Menu Restauracji";
            WelcomeText = $"Witaj, {_currentUser.FirstName}!";

            _ = LoadDataAsync();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            try
            {
                IsBusy = true;

                // Załaduj kategorie
                var categoriesData = await _menuService.GetAllCategoriesAsync();
                Categories.Clear();
                
                // Dodaj opcję "Wszystkie"
                Categories.Add(new Category { Id = 0, Name = "Wszystkie" });
                foreach (var category in categoriesData)
                {
                    Categories.Add(category);
                }

                // Załaduj pozycje menu (tylko aktywne)
                var menuItemsData = await _menuService.GetActiveMenuItemsAsync();
                AllMenuItems.Clear();
                foreach (var item in menuItemsData)
                {
                    AllMenuItems.Add(item);
                }

                // Domyślnie pokaż wszystkie pozycje
                FilteredMenuItems.Clear();
                foreach (var item in AllMenuItems)
                {
                    FilteredMenuItems.Add(item);
                }

                // Ustaw domyślnie wybraną kategorię "Wszystkie"
                SelectedCategory = Categories.FirstOrDefault();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd podczas ładowania danych: {ex.Message}", 
                              "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void SelectCategory(Category category)
        {
            SelectedCategory = category;
            FilterMenuItems();
        }

        private void FilterMenuItems()
        {
            FilteredMenuItems.Clear();

            var itemsToFilter = AllMenuItems.AsEnumerable();

            // Filtruj według kategorii
            if (SelectedCategory != null && SelectedCategory.Id != 0)
            {
                itemsToFilter = itemsToFilter.Where(x => x.CategoryId == SelectedCategory.Id);
            }

            // Filtruj według wyszukiwanej frazy
            bool isSearching = !string.IsNullOrWhiteSpace(SearchQuery);
            if (isSearching)
            {
                var searchTerm = SearchQuery.ToLower();
                itemsToFilter = itemsToFilter.Where(x => 
                    x.Name.ToLower().Contains(searchTerm) ||
                    (x.Description?.ToLower().Contains(searchTerm) ?? false) ||
                    x.Category.Name.ToLower().Contains(searchTerm));
            }

            // Dodaj przefiltrowane pozycje do kolekcji
            var filteredList = itemsToFilter.ToList();
            foreach (var item in filteredList)
            {
                FilteredMenuItems.Add(item);
            }

            // Aktualizuj tekst wyników
            UpdateSearchResultsText(filteredList.Count, isSearching);
        }

        private void UpdateSearchResultsText(int resultsCount, bool isSearching)
        {
            if (!isSearching)
            {
                SearchResultsText = $"Wyświetlanych: {resultsCount} dań";
            }
            else
            {
                if (resultsCount == 0)
                {
                    SearchResultsText = "🔍 Brak wyników wyszukiwania";
                }
                else if (resultsCount == 1)
                {
                    SearchResultsText = "🔍 Znaleziono 1 danie";
                }
                else
                {
                    SearchResultsText = $"🔍 Znaleziono {resultsCount} dań";
                }
            }
        }

        [RelayCommand]
        private void AddToCart(MenuItem menuItem)
        {
            var existingItem = CartItems.FirstOrDefault(x => x.MenuItem.Id == menuItem.Id);
            
            if (existingItem != null)
            {
                existingItem.Quantity++;
                existingItem.TotalPrice = existingItem.Quantity * existingItem.MenuItem.Price;
            }
            else
            {
                CartItems.Add(new CartItem
                {
                    MenuItem = menuItem,
                    Quantity = 1,
                    TotalPrice = menuItem.Price
                });
            }

            UpdateCartTotals();
        }

        [RelayCommand]
        private void IncreaseQuantity(CartItem cartItem)
        {
            cartItem.Quantity++;
            cartItem.TotalPrice = cartItem.Quantity * cartItem.MenuItem.Price;
            UpdateCartTotals();
        }

        [RelayCommand]
        private void DecreaseQuantity(CartItem cartItem)
        {
            if (cartItem.Quantity > 1)
            {
                cartItem.Quantity--;
                cartItem.TotalPrice = cartItem.Quantity * cartItem.MenuItem.Price;
                UpdateCartTotals();
            }
        }

        [RelayCommand]
        private void RemoveFromCart(CartItem cartItem)
        {
            CartItems.Remove(cartItem);
            UpdateCartTotals();
        }

        [RelayCommand]
        private void ClearCart()
        {
            var result = MessageBox.Show("Czy na pewno chcesz wyczyścić koszyk?", 
                                       "Potwierdzenie", 
                                       MessageBoxButton.YesNo, 
                                       MessageBoxImage.Question);
            
            if (result == MessageBoxResult.Yes)
            {
                CartItems.Clear();
                UpdateCartTotals();
            }
        }

        [RelayCommand]
        private async Task PlaceOrderAsync()
        {
            if (!HasCartItems)
                return;

            try
            {
                IsBusy = true;

                var order = await _orderService.CreateOrderAsync(_currentUser.Id, CartItems.ToList());
                
                var orderSummary = $"Zamówienie #{order.Id} zostało złożone pomyślnie!\n\n" +
                                 $"Data: {order.OrderDate:dd.MM.yyyy HH:mm}\n" +
                                 $"Status: Przyjęte\n" +
                                 $"Kwota: {order.TotalAmount:$#,##0.00}\n\n" +
                                 "Pozycje:\n" +
                                 string.Join("\n", CartItems.Select(x => $"• {x.MenuItem.Name} x{x.Quantity} = {x.TotalPrice:$#,##0.00}"));

                var result = MessageBox.Show($"{orderSummary}\n\nCzy chcesz wydrukować paragon?", 
                                           "Zamówienie złożone", 
                                           MessageBoxButton.YesNo, 
                                           MessageBoxImage.Information);

                if (result == MessageBoxResult.Yes)
                {
                    _printService.PrintCustomerReceipt(order);
                }

                // Wyczyść koszyk po złożeniu zamówienia
                CartItems.Clear();
                UpdateCartTotals();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd podczas składania zamówienia: {ex.Message}", 
                              "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void ShowCart()
        {
            MessageBox.Show($"Koszyk zawiera {CartItems.Count} pozycji na kwotę {TotalAmount:$#,##0.00}", 
                          "Koszyk", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        [RelayCommand]
        private void ShowOrders()
        {
            try
            {
                var orderHistoryViewModel = new OrderHistoryViewModel(_currentUser, _orderService, _printService);
                var orderHistoryWindow = new OrderHistoryWindow(orderHistoryViewModel);
                orderHistoryWindow.Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd podczas otwierania historii zamówień: {ex.Message}", 
                              "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        [RelayCommand]
        private void Logout()
        {
            var result = MessageBox.Show("Czy na pewno chcesz się wylogować?", 
                                       "Potwierdzenie", 
                                       MessageBoxButton.YesNo, 
                                       MessageBoxImage.Question);
            
            if (result == MessageBoxResult.Yes)
            {
                var loginWindow = new LoginWindow();
                loginWindow.Show();
                
                Application.Current.Windows.OfType<MainWindow>().FirstOrDefault()?.Close();
            }
        }

        private void UpdateCartTotals()
        {
            TotalAmount = CartItems.Sum(x => x.TotalPrice);
            HasCartItems = CartItems.Count > 0;
            CartButtonText = $"🛒 Koszyk ({CartItems.Count})";
        }

        partial void OnSearchQueryChanged(string value)
        {
            // Anuluj poprzedni timer
            _searchTimer?.Dispose();

            // Ustaw nowy timer z debounce 500ms
            _searchTimer = new Timer((_) =>
            {
                // Wykonaj filtrowanie na wątku UI
                Application.Current.Dispatcher.Invoke(() =>
                {
                    FilterMenuItems();
                });
            }, null, 500, Timeout.Infinite);
        }

        [RelayCommand]
        private void ClearSearch()
        {
            SearchQuery = string.Empty;
        }

        // Cleanup timer when ViewModel is disposed
        public void Dispose()
        {
            _searchTimer?.Dispose();
        }
    }
} 