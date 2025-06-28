using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.Windows;
using WpfRestaurant.Models;
using WpfRestaurant.Services;
using WpfRestaurant.Enums;
using System.Text;

namespace WpfRestaurant.ViewModels
{
    public partial class OrderHistoryViewModel : BaseViewModel
    {
        private readonly User _currentUser;
        private readonly OrderService _orderService;
        private readonly PrintService _printService;

        [ObservableProperty]
        private ObservableCollection<OrderDisplayModel> orders = new();

        [ObservableProperty]
        private OrderDisplayModel? selectedOrder;

        [ObservableProperty]
        private string userFullName = string.Empty;

        [ObservableProperty]
        private int totalOrders;

        [ObservableProperty]
        private decimal totalSpent;

        [ObservableProperty]
        private bool hasOrders;

        [ObservableProperty]
        private string statusFilter = "Wszystkie";

        [ObservableProperty]
        private ObservableCollection<string> availableStatuses = new();

        public OrderHistoryViewModel(User currentUser, OrderService orderService, PrintService printService)
        {
            _currentUser = currentUser;
            _orderService = orderService;
            _printService = printService;
            
            Title = "Historia zamówień";
            UserFullName = $"{_currentUser.FirstName} {_currentUser.LastName}";

            // Dodaj dostępne statusy do filtrowania
            AvailableStatuses.Add("Wszystkie");
            AvailableStatuses.Add("Przyjęte");
            AvailableStatuses.Add("W przygotowaniu");
            AvailableStatuses.Add("Zrealizowane");

            _ = LoadOrdersAsync();
        }

        [RelayCommand]
        private async Task LoadOrdersAsync()
        {
            try
            {
                IsBusy = true;

                var userOrders = await _orderService.GetUserOrdersAsync(_currentUser.Id);
                
                Orders.Clear();
                foreach (var order in userOrders)
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
                        CustomerName = $"{_currentUser.FirstName} {_currentUser.LastName}",
                        CustomerEmail = _currentUser.Email
                    };

                    Orders.Add(displayOrder);
                }

                // Oblicz statystyki
                TotalOrders = Orders.Count;
                TotalSpent = Orders.Sum(o => o.TotalAmount);
                HasOrders = Orders.Any();

                // Zastosuj filtr
                ApplyStatusFilter();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd podczas ładowania zamówień: {ex.Message}", 
                              "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsBusy = false;
            }
        }

        [RelayCommand]
        private void ApplyStatusFilter()
        {
            // Tutaj możemy dodać logikę filtrowania w przyszłości
            // Na razie pokazujemy wszystkie zamówienia
        }

        [RelayCommand]
        private void RefreshOrders()
        {
            _ = LoadOrdersAsync();
        }

        [RelayCommand]
        private async Task PrintReceiptAsync(OrderDisplayModel orderDisplay)
        {
            try
            {
                IsBusy = true;

                // Pobierz pełne dane zamówienia z bazy
                var fullOrder = await _orderService.GetOrderByIdAsync(orderDisplay.Id);
                if (fullOrder != null)
                {
                    _printService.PrintCustomerReceipt(fullOrder);
                }
                else
                {
                    MessageBox.Show($"Nie udało się znaleźć zamówienia #{orderDisplay.Id}", 
                                  "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd drukowania paragonu: {ex.Message}", 
                              "Błąd", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                IsBusy = false;
            }
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

        partial void OnSelectedOrderChanged(OrderDisplayModel? value)
        {
            if (value != null)
            {
                ShowOrderDetails(value);
            }
        }

        private void ShowOrderDetails(OrderDisplayModel order)
        {
            var detailsBuilder = new StringBuilder();
            
            detailsBuilder.AppendLine($"🍕 SZCZEGÓŁY ZAMÓWIENIA #{order.Id}");
            detailsBuilder.AppendLine($"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            detailsBuilder.AppendLine($"📅 Data zamówienia: {order.OrderDateDisplay}");
            detailsBuilder.AppendLine($"📊 Status: {order.Status}");
            detailsBuilder.AppendLine($"💰 Kwota: {order.TotalAmountDisplay}");
            
            if (order.CompletedDate.HasValue)
            {
                detailsBuilder.AppendLine($"✅ Data realizacji: {order.CompletedDateDisplay}");
            }
            
            detailsBuilder.AppendLine();
            detailsBuilder.AppendLine($"📋 POZYCJE W ZAMÓWIENIU ({order.ItemsCount} szt.):");
            detailsBuilder.AppendLine($"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            if (order.OrderItems.Any())
            {
                foreach (var item in order.OrderItems)
                {
                    var itemName = item.MenuItem?.Name ?? "Nieznana pozycja";
                    var categoryName = item.MenuItem?.Category?.Name ?? "Brak kategorii";
                    var itemTotal = item.UnitPrice * item.Quantity;
                    
                    detailsBuilder.AppendLine($"• {itemName}");
                    detailsBuilder.AppendLine($"  Kategoria: {categoryName}");
                    detailsBuilder.AppendLine($"  Ilość: {item.Quantity} szt. × {item.UnitPrice:C} = {itemTotal:C}");
                    detailsBuilder.AppendLine();
                }
            }
            else
            {
                detailsBuilder.AppendLine("Brak pozycji w zamówieniu.");
            }

            MessageBox.Show(detailsBuilder.ToString(), 
                          $"Szczegóły zamówienia #{order.Id}", 
                          MessageBoxButton.OK, 
                          MessageBoxImage.Information);
        }
    }
} 