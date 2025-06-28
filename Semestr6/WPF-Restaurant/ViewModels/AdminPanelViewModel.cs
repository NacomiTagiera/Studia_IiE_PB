using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using WpfRestaurant.Models;
using WpfRestaurant.Services;
using WpfRestaurant.Enums;
using Microsoft.EntityFrameworkCore;
using WpfRestaurant.Data;
using System.Windows;
using WpfRestaurant.Views;

namespace WpfRestaurant.ViewModels
{
    public partial class AdminPanelViewModel : BaseViewModel
    {
        private readonly MenuService _menuService;
        private readonly OrderService _orderService;
        private readonly User _currentUser;
        private readonly PrintService _printService;

        // Menu Management Properties
        [ObservableProperty]
        private ObservableCollection<MenuItem> menuItems = new();

        [ObservableProperty]
        private ObservableCollection<Category> categories = new();

        // Order Management Properties
        [ObservableProperty]
        private ObservableCollection<OrderDisplayModel> allOrders = new();

        [ObservableProperty]
        private OrderDisplayModel? selectedOrder;

        [ObservableProperty]
        private int totalOrdersCount;

        [ObservableProperty]
        private int pendingOrdersCount;

        [ObservableProperty]
        private int inProgressOrdersCount;

        [ObservableProperty]
        private int completedOrdersCount;

        [ObservableProperty]
        private decimal totalRevenue;

        // UI Navigation
        [ObservableProperty]
        private int selectedTabIndex = 0; // 0 = Menu, 1 = Orders

        [ObservableProperty]
        private string adminName = string.Empty;

        // Formularz dodawania/edytowania pozycji menu
        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Nazwa dania jest wymagana")]
        [MaxLength(100, ErrorMessage = "Nazwa może mieć maksymalnie 100 znaków")]
        private string itemName = string.Empty;

        [ObservableProperty]
        [MaxLength(500, ErrorMessage = "Opis może mieć maksymalnie 500 znaków")]
        private string itemDescription = string.Empty;

        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Cena jest wymagana")]
        [Range(0.01, 9999.99, ErrorMessage = "Cena musi być między 0.01 a 9999.99")]
        private decimal itemPrice;

        [ObservableProperty]
        private Category? selectedCategory;

        [ObservableProperty]
        private MenuItem? selectedMenuItem;

        [ObservableProperty]
        private bool isEditing;

        [ObservableProperty]
        private string statusMessage = string.Empty;

        [ObservableProperty]
        private bool isFormValid;

        // Formularz dodawania/edytowania kategorii
        [ObservableProperty]
        [NotifyDataErrorInfo]
        [Required(ErrorMessage = "Nazwa kategorii jest wymagana")]
        [MaxLength(50, ErrorMessage = "Nazwa może mieć maksymalnie 50 znaków")]
        private string categoryName = string.Empty;

        [ObservableProperty]
        [MaxLength(500, ErrorMessage = "Opis może mieć maksymalnie 500 znaków")]
        private string categoryDescription = string.Empty;

        [ObservableProperty]
        private Category? selectedCategoryForEdit;

        [ObservableProperty]
        private bool isEditingCategory;

        [ObservableProperty]
        private bool isCategoryFormValid;

        public AdminPanelViewModel(User currentUser, MenuService menuService, OrderService orderService, PrintService printService)
        {
            _currentUser = currentUser;
            _menuService = menuService;
            _orderService = orderService;
            _printService = printService;
            
            Title = "Panel Administratora - Foodify";
            AdminName = $"{currentUser.FirstName} {currentUser.LastName}";
            
            // Inicjalizuj walidację
            UpdateFormValidation();
            UpdateCategoryFormValidation();
            
            // Załaduj dane
            _ = LoadDataAsync();
        }

        [RelayCommand]
        private async Task LoadDataAsync()
        {
            try
            {
                IsBusy = true;
                StatusMessage = "Ładowanie danych...";

                // Załaduj kategorie
                var categoriesList = await _menuService.GetAllCategoriesAsync();
                Categories.Clear();
                foreach (var category in categoriesList)
                {
                    Categories.Add(category);
                }

                // Załaduj pozycje menu
                var menuItemsList = await _menuService.GetAllMenuItemsAsync();
                MenuItems.Clear();
                foreach (var menuItem in menuItemsList)
                {
                    MenuItems.Add(menuItem);
                }

                // Załaduj zamówienia
                await LoadOrdersAsync();

                StatusMessage = $"Załadowano {MenuItems.Count} pozycji menu w {Categories.Count} kategoriach i {AllOrders.Count} zamówień";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd ładowania danych: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task LoadOrdersAsync()
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync();
                
                AllOrders.Clear();
                foreach (var order in orders)
                {
                    var displayOrder = new OrderDisplayModel
                    {
                        Id = order.Id,
                        OrderDate = order.OrderDate,
                        Status = GetStatusDisplayName(order.Status),
                        StatusEnum = order.Status,
                        TotalAmount = order.TotalAmount,
                        ItemsCount = order.OrderItems.Sum(oi => oi.Quantity),
                        CompletedDate = order.CompletedDate,
                        OrderItems = order.OrderItems.ToList(),
                        CustomerName = $"{order.User.FirstName} {order.User.LastName}",
                        CustomerEmail = order.User.Email
                    };

                    AllOrders.Add(displayOrder);
                }

                // Oblicz statystyki
                UpdateOrderStatistics();
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd ładowania zamówień: {ex.Message}";
            }
        }

        [RelayCommand]
        private async Task PrepareOrderAsync(OrderDisplayModel order)
        {
            try
            {
                IsBusy = true;
                StatusMessage = $"Przygotowywanie zamówienia #{order.Id}...";

                await _orderService.UpdateOrderStatusAsync(order.Id, OrderStatus.W_PRZYGOTOWANIU);
                
                // Aktualizuj dane w kolekcji
                order.Status = GetStatusDisplayName(OrderStatus.W_PRZYGOTOWANIU);
                order.StatusEnum = OrderStatus.W_PRZYGOTOWANIU;

                UpdateOrderStatistics();
                StatusMessage = $"Zamówienie #{order.Id} jest teraz w przygotowaniu";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd zmiany statusu: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task CompleteOrderAsync(OrderDisplayModel order)
        {
            try
            {
                IsBusy = true;
                StatusMessage = $"Realizowanie zamówienia #{order.Id}...";

                await _orderService.UpdateOrderStatusAsync(order.Id, OrderStatus.ZREALIZOWANE);
                
                // Aktualizuj dane w kolekcji
                order.Status = GetStatusDisplayName(OrderStatus.ZREALIZOWANE);
                order.StatusEnum = OrderStatus.ZREALIZOWANE;
                order.CompletedDate = DateTime.UtcNow;

                UpdateOrderStatistics();
                StatusMessage = $"Zamówienie #{order.Id} zostało zrealizowane";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd zmiany statusu: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void ViewOrderDetails(OrderDisplayModel order)
        {
            SelectedOrder = order;
            ShowOrderDetailsPopup(order);
        }

        [RelayCommand]
        private async Task PrintCustomerReceiptAsync(OrderDisplayModel orderDisplay)
        {
            try
            {
                IsBusy = true;
                StatusMessage = $"Przygotowywanie paragonu dla zamówienia #{orderDisplay.Id}...";

                // Pobierz pełne dane zamówienia z bazy
                var fullOrder = await _orderService.GetOrderByIdAsync(orderDisplay.Id);
                if (fullOrder != null)
                {
                    _printService.PrintCustomerReceipt(fullOrder);
                    StatusMessage = $"Paragon dla zamówienia #{orderDisplay.Id} został wysłany do druku";
                }
                else
                {
                    StatusMessage = $"Nie udało się znaleźć zamówienia #{orderDisplay.Id}";
                }
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd drukowania paragonu: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task PrintKitchenOrderAsync(OrderDisplayModel orderDisplay)
        {
            try
            {
                IsBusy = true;
                StatusMessage = $"Przygotowywanie zamówienia dla kuchni #{orderDisplay.Id}...";

                // Pobierz pełne dane zamówienia z bazy
                var fullOrder = await _orderService.GetOrderByIdAsync(orderDisplay.Id);
                if (fullOrder != null)
                {
                    _printService.PrintKitchenOrder(fullOrder);
                    StatusMessage = $"Zamówienie #{orderDisplay.Id} zostało wysłane do druku dla kuchni";
                }
                else
                {
                    StatusMessage = $"Nie udało się znaleźć zamówienia #{orderDisplay.Id}";
                }
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd drukowania zamówienia: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }



        [RelayCommand]
        private async Task AddMenuItemAsync()
        {
            try
            {
                // Walidacja
                ValidateAllProperties();
                if (HasErrors || SelectedCategory == null)
                {
                    StatusMessage = "Proszę wypełnić wszystkie wymagane pola i wybrać kategorię";
                    return;
                }

                IsBusy = true;
                StatusMessage = "Dodawanie nowej pozycji...";

                var newMenuItem = await _menuService.AddMenuItemAsync(
                    ItemName, 
                    string.IsNullOrWhiteSpace(ItemDescription) ? null : ItemDescription, 
                    ItemPrice, 
                    SelectedCategory.Id);

                MenuItems.Add(newMenuItem);
                ClearForm();
                StatusMessage = $"Dodano nową pozycję: {newMenuItem.Name}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd dodawania pozycji: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task EditMenuItemAsync()
        {
            if (SelectedMenuItem == null) return;

            try
            {
                // Walidacja
                ValidateAllProperties();
                if (HasErrors || SelectedCategory == null)
                {
                    StatusMessage = "Proszę wypełnić wszystkie wymagane pola i wybrać kategorię";
                    return;
                }

                IsBusy = true;
                StatusMessage = "Aktualizowanie pozycji...";

                var updatedMenuItem = await _menuService.UpdateMenuItemAsync(
                    SelectedMenuItem.Id,
                    ItemName,
                    string.IsNullOrWhiteSpace(ItemDescription) ? null : ItemDescription,
                    ItemPrice,
                    SelectedCategory.Id,
                    SelectedMenuItem.IsActive);

                // Zaktualizuj w kolekcji
                var index = MenuItems.IndexOf(SelectedMenuItem);
                if (index >= 0)
                {
                    MenuItems[index] = updatedMenuItem;
                }

                ClearForm();
                StatusMessage = $"Zaktualizowano pozycję: {updatedMenuItem.Name}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd aktualizacji pozycji: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task ToggleMenuItemActiveAsync(MenuItem menuItem)
        {
            try
            {
                IsBusy = true;
                StatusMessage = $"{(menuItem.IsActive ? "Dezaktywowanie" : "Aktywowanie")} pozycji...";

                var updatedMenuItem = await _menuService.ToggleMenuItemActiveAsync(menuItem.Id);
                
                // Zaktualizuj w kolekcji
                var index = MenuItems.IndexOf(menuItem);
                if (index >= 0)
                {
                    MenuItems[index] = updatedMenuItem;
                }

                StatusMessage = $"Pozycja {updatedMenuItem.Name} została {(updatedMenuItem.IsActive ? "aktywowana" : "dezaktywowana")}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd zmiany statusu: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task DeleteMenuItemAsync(MenuItem menuItem)
        {
            try
            {
                IsBusy = true;
                StatusMessage = "Usuwanie pozycji...";

                await _menuService.DeleteMenuItemAsync(menuItem.Id);
                MenuItems.Remove(menuItem);

                if (SelectedMenuItem == menuItem)
                {
                    ClearForm();
                }

                StatusMessage = $"Usunięto pozycję: {menuItem.Name}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd usuwania pozycji: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void SelectMenuItemForEdit(MenuItem menuItem)
        {
            SelectedMenuItem = menuItem;
            ItemName = menuItem.Name;
            ItemDescription = menuItem.Description ?? string.Empty;
            ItemPrice = menuItem.Price;
            SelectedCategory = Categories.FirstOrDefault(c => c.Id == menuItem.CategoryId);
            IsEditing = true;
        }

        [RelayCommand]
        private void ClearForm()
        {
            ItemName = string.Empty;
            ItemDescription = string.Empty;
            ItemPrice = 0;
            SelectedCategory = null;
            SelectedMenuItem = null;
            IsEditing = false;
            ClearErrors();
        }

        #region Category Management

        [RelayCommand]
        private async Task AddCategoryAsync()
        {
            try
            {
                IsBusy = true;
                StatusMessage = "Dodawanie kategorii...";

                var newCategory = await _menuService.AddCategoryAsync(CategoryName, CategoryDescription);
                Categories.Add(newCategory);

                ClearCategoryForm();
                StatusMessage = $"Dodano kategorię: {newCategory.Name}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd dodawania kategorii: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task EditCategoryAsync()
        {
            if (SelectedCategoryForEdit == null) return;

            try
            {
                IsBusy = true;
                StatusMessage = "Aktualizowanie kategorii...";

                var updatedCategory = await _menuService.UpdateCategoryAsync(
                    SelectedCategoryForEdit.Id, 
                    CategoryName, 
                    CategoryDescription);

                // Zaktualizuj w kolekcji Categories
                var index = Categories.IndexOf(SelectedCategoryForEdit);
                if (index >= 0)
                {
                    Categories[index] = updatedCategory;
                }

                ClearCategoryForm();
                StatusMessage = $"Zaktualizowano kategorię: {updatedCategory.Name}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd aktualizacji kategorii: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private async Task DeleteCategoryAsync(Category category)
        {
            try
            {
                var result = MessageBox.Show(
                    $"Czy na pewno chcesz usunąć kategorię '{category.Name}'?\n\nUwaga: Kategoria może być usunięta tylko gdy nie ma przypisanych pozycji menu.",
                    "Potwierdzenie usunięcia",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);

                if (result != MessageBoxResult.Yes) return;

                IsBusy = true;
                StatusMessage = "Usuwanie kategorii...";

                await _menuService.DeleteCategoryAsync(category.Id);
                Categories.Remove(category);

                if (SelectedCategoryForEdit == category)
                {
                    ClearCategoryForm();
                }

                StatusMessage = $"Usunięto kategorię: {category.Name}";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Błąd usuwania kategorii: {ex.Message}";
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void SelectCategoryForEdit(Category category)
        {
            SelectedCategoryForEdit = category;
            CategoryName = category.Name;
            CategoryDescription = category.Description ?? string.Empty;
            IsEditingCategory = true;
        }

        [RelayCommand]
        private void ClearCategoryForm()
        {
            CategoryName = string.Empty;
            CategoryDescription = string.Empty;
            SelectedCategoryForEdit = null;
            IsEditingCategory = false;
            ClearErrors();
        }

        #endregion

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
                
                Application.Current.Windows.OfType<AdminPanelWindow>().FirstOrDefault()?.Close();
            }
        }

        partial void OnItemNameChanged(string value)
        {
            ValidateProperty(value, nameof(ItemName));
            UpdateFormValidation();
        }

        partial void OnItemPriceChanged(decimal value)
        {
            ValidateProperty(value, nameof(ItemPrice));
            UpdateFormValidation();
        }

        partial void OnSelectedCategoryChanged(Category? value)
        {
            UpdateFormValidation();
        }

        partial void OnCategoryNameChanged(string value)
        {
            ValidateProperty(value, nameof(CategoryName));
            UpdateCategoryFormValidation();
        }

        partial void OnCategoryDescriptionChanged(string value)
        {
            ValidateProperty(value, nameof(CategoryDescription));
            UpdateCategoryFormValidation();
        }

        private void UpdateFormValidation()
        {
            IsFormValid = !HasErrors && 
                         !string.IsNullOrWhiteSpace(ItemName) && 
                         ItemPrice > 0 && 
                         SelectedCategory != null;
        }

        private void UpdateCategoryFormValidation()
        {
            IsCategoryFormValid = !HasErrors && 
                                 !string.IsNullOrWhiteSpace(CategoryName);
        }

        private void UpdateOrderStatistics()
        {
            TotalOrdersCount = AllOrders.Count;
            PendingOrdersCount = AllOrders.Count(o => o.StatusEnum == OrderStatus.PRZYJĘTE);
            InProgressOrdersCount = AllOrders.Count(o => o.StatusEnum == OrderStatus.W_PRZYGOTOWANIU);
            CompletedOrdersCount = AllOrders.Count(o => o.StatusEnum == OrderStatus.ZREALIZOWANE);
            TotalRevenue = AllOrders.Where(o => o.StatusEnum == OrderStatus.ZREALIZOWANE).Sum(o => o.TotalAmount);
        }

        private string GetStatusDisplayName(OrderStatus status)
        {
            return status switch
            {
                OrderStatus.PRZYJĘTE => "Przyjęte",
                OrderStatus.W_PRZYGOTOWANIU => "W przygotowaniu",
                OrderStatus.ZREALIZOWANE => "Zrealizowane",
                _ => "Nieznany"
            };
        }

        private void ShowOrderDetailsPopup(OrderDisplayModel order)
        {
            var message = $"🍕 ZAMÓWIENIE #{order.Id}\n" +
                         $"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                         $"👤 Klient: {order.CustomerName}\n" +
                         $"📧 Email: {order.CustomerEmail}\n" +
                         $"📅 Data zamówienia: {order.OrderDateDisplay}\n" +
                         $"📊 Status: {order.Status}\n" +
                         $"💰 Kwota: {order.TotalAmountDisplay}\n" +
                         (order.CompletedDate.HasValue ? $"✅ Zrealizowane: {order.CompletedDateDisplay}\n" : "") +
                         $"\n📋 POZYCJE ({order.ItemsCount} szt.):\n" +
                         $"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

            foreach (var item in order.OrderItems)
            {
                var itemName = item.MenuItem?.Name ?? "Nieznana pozycja";
                var categoryName = item.MenuItem?.Category?.Name ?? "Brak kategorii";
                var itemTotal = item.UnitPrice * item.Quantity;
                
                message += $"• {itemName}\n";
                message += $"  Kategoria: {categoryName}\n";
                message += $"  {item.Quantity} szt. × {item.UnitPrice:C} = {itemTotal:C}\n\n";
            }

            MessageBox.Show(message, $"Szczegóły zamówienia #{order.Id}", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }

    /// <summary>
    /// Model do wyświetlania zamówienia w panelu administratora
    /// </summary>
    public partial class OrderDisplayModel : ObservableObject
    {
        [ObservableProperty]
        private int id;

        [ObservableProperty]
        private DateTime orderDate;

        [ObservableProperty]
        private string status = string.Empty;

        [ObservableProperty]
        private OrderStatus statusEnum;

        [ObservableProperty]
        private decimal totalAmount;

        [ObservableProperty]
        private int itemsCount;

        [ObservableProperty]
        private DateTime? completedDate;

        public List<OrderItem> OrderItems { get; set; } = new();
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        public string OrderDateDisplay => OrderDate.ToString("dd.MM.yyyy HH:mm");
        public string TotalAmountDisplay => TotalAmount.ToString("$#,##0.00");
        public string ItemsCountDisplay => $"{ItemsCount} pozycji";
        public string CompletedDateDisplay => CompletedDate?.ToString("dd.MM.yyyy HH:mm") ?? "-";
    }
} 