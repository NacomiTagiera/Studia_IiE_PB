using System.Printing;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;
using WpfRestaurant.Models;
using WpfRestaurant.Enums;

namespace WpfRestaurant.Services
{
    public class PrintService
    {
        /// <summary>
        /// Drukuje paragon dla klienta
        /// </summary>
        public bool PrintCustomerReceipt(Order order)
        {
            try
            {
                var printDialog = new PrintDialog();
                
                // Pokaż dialog wyboru drukarki
                if (printDialog.ShowDialog() == true)
                {
                    var document = CreateCustomerReceiptDocument(order);
                    var paginator = ((IDocumentPaginatorSource)document).DocumentPaginator;
                    printDialog.PrintDocument(paginator, $"Paragon #{order.Id}");
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd drukowania: {ex.Message}", "Błąd", 
                              MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }

        /// <summary>
        /// Drukuje szczegółowe zamówienie dla kuchni/administratora
        /// </summary>
        public bool PrintKitchenOrder(Order order)
        {
            try
            {
                var printDialog = new PrintDialog();
                
                if (printDialog.ShowDialog() == true)
                {
                    var document = CreateKitchenOrderDocument(order);
                    var paginator = ((IDocumentPaginatorSource)document).DocumentPaginator;
                    printDialog.PrintDocument(paginator, $"Zamówienie #{order.Id} - Kuchnia");
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd drukowania: {ex.Message}", "Błąd", 
                              MessageBoxButton.OK, MessageBoxImage.Error);
                return false;
            }
        }

        /// <summary>
        /// Podgląd wydruku przed drukowaniem
        /// </summary>
        public void PreviewReceipt(Order order, bool isCustomerReceipt = true)
        {
            try
            {
                var document = isCustomerReceipt 
                    ? CreateCustomerReceiptDocument(order) 
                    : CreateKitchenOrderDocument(order);

                var previewWindow = new Window
                {
                    Title = isCustomerReceipt ? $"Podgląd paragonu #{order.Id}" : $"Podgląd zamówienia #{order.Id}",
                    Width = 600,
                    Height = 800,
                    WindowStartupLocation = WindowStartupLocation.CenterScreen
                };

                var documentViewer = new DocumentViewer
                {
                    Document = document
                };

                previewWindow.Content = documentViewer;
                previewWindow.ShowDialog();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Błąd podglądu: {ex.Message}", "Błąd", 
                              MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Tworzy dokument paragonu dla klienta
        /// </summary>
        private FlowDocument CreateCustomerReceiptDocument(Order order)
        {
            var document = new FlowDocument();
            document.PageWidth = 400; // Wąski paragon
            document.PagePadding = new Thickness(20);
            document.FontFamily = new FontFamily("Consolas"); // Monospace font
            document.FontSize = 12;

            // Header
            var header = new Paragraph();
            header.TextAlignment = TextAlignment.Center;
            header.Margin = new Thickness(0, 0, 0, 10);

            header.Inlines.Add(new Run("🍕 FOODIFY 🍕\n") { FontWeight = FontWeights.Bold, FontSize = 16 });
            header.Inlines.Add(new Run("Restauracja\n"));
            header.Inlines.Add(new Run("ul. Główna 123, Warszawa\n"));
            header.Inlines.Add(new Run("Tel: +48 123 456 789\n"));
            header.Inlines.Add(new Run("================================\n"));
            header.Inlines.Add(new Run("PARAGON FISKALNY\n") { FontWeight = FontWeights.Bold });
            header.Inlines.Add(new Run("================================\n"));

            document.Blocks.Add(header);

            // Informacje o zamówieniu
            var orderInfo = new Paragraph();
            orderInfo.Margin = new Thickness(0, 0, 0, 10);
            
            orderInfo.Inlines.Add(new Run($"Nr zamówienia: #{order.Id}\n") { FontWeight = FontWeights.Bold });
            orderInfo.Inlines.Add(new Run($"Data: {order.OrderDate:dd.MM.yyyy HH:mm}\n"));
            orderInfo.Inlines.Add(new Run($"Klient: {order.User.FirstName} {order.User.LastName}\n"));
            orderInfo.Inlines.Add(new Run($"Status: {GetStatusDisplayName(order.Status)}\n"));
            if (order.CompletedDate.HasValue)
            {
                orderInfo.Inlines.Add(new Run($"Zrealizowano: {order.CompletedDate:dd.MM.yyyy HH:mm}\n"));
            }
            orderInfo.Inlines.Add(new Run("--------------------------------\n"));

            document.Blocks.Add(orderInfo);

            // Pozycje zamówienia
            var itemsTable = new Table();
            itemsTable.CellSpacing = 0;
            
            // Kolumny tabeli
            itemsTable.Columns.Add(new TableColumn { Width = new GridLength(3, GridUnitType.Star) }); // Nazwa
            itemsTable.Columns.Add(new TableColumn { Width = new GridLength(1, GridUnitType.Star) }); // Ilość
            itemsTable.Columns.Add(new TableColumn { Width = new GridLength(1.5, GridUnitType.Star) }); // Cena
            itemsTable.Columns.Add(new TableColumn { Width = new GridLength(1.5, GridUnitType.Star) }); // Suma

            var tableRowGroup = new TableRowGroup();

            // Header tabeli
            var headerRow = new TableRow();
            headerRow.Cells.Add(new TableCell(new Paragraph(new Run("Pozycja") { FontWeight = FontWeights.Bold })));
            headerRow.Cells.Add(new TableCell(new Paragraph(new Run("Szt.") { FontWeight = FontWeights.Bold })) { TextAlignment = TextAlignment.Right });
            headerRow.Cells.Add(new TableCell(new Paragraph(new Run("Cena") { FontWeight = FontWeights.Bold })) { TextAlignment = TextAlignment.Right });
            headerRow.Cells.Add(new TableCell(new Paragraph(new Run("Suma") { FontWeight = FontWeights.Bold })) { TextAlignment = TextAlignment.Right });
            tableRowGroup.Rows.Add(headerRow);

            // Linia oddzielająca
            var separatorRow = new TableRow();
            for (int i = 0; i < 4; i++)
            {
                separatorRow.Cells.Add(new TableCell(new Paragraph(new Run("--------"))));
            }
            tableRowGroup.Rows.Add(separatorRow);

            // Pozycje
            foreach (var item in order.OrderItems)
            {
                var row = new TableRow();
                var itemTotal = item.UnitPrice * item.Quantity;

                row.Cells.Add(new TableCell(new Paragraph(new Run(item.MenuItem?.Name ?? "Nieznana pozycja"))));
                row.Cells.Add(new TableCell(new Paragraph(new Run(item.Quantity.ToString())) { TextAlignment = TextAlignment.Right }));
                row.Cells.Add(new TableCell(new Paragraph(new Run(item.UnitPrice.ToString("C"))) { TextAlignment = TextAlignment.Right }));
                row.Cells.Add(new TableCell(new Paragraph(new Run(itemTotal.ToString("C"))) { TextAlignment = TextAlignment.Right }));

                tableRowGroup.Rows.Add(row);
            }

            itemsTable.RowGroups.Add(tableRowGroup);
            document.Blocks.Add(itemsTable);

            // Podsumowanie
            var summary = new Paragraph();
            summary.Margin = new Thickness(0, 20, 0, 0);
            summary.TextAlignment = TextAlignment.Right;

            summary.Inlines.Add(new Run("================================\n"));
            summary.Inlines.Add(new Run($"RAZEM: {order.TotalAmount:C}\n") { FontWeight = FontWeights.Bold, FontSize = 14 });
            summary.Inlines.Add(new Run("================================\n"));

            document.Blocks.Add(summary);

            // Footer
            var footer = new Paragraph();
            footer.TextAlignment = TextAlignment.Center;
            footer.Margin = new Thickness(0, 20, 0, 0);
            footer.FontSize = 10;

            footer.Inlines.Add(new Run("Dziękujemy za zamówienie!\n"));
            footer.Inlines.Add(new Run("Zapraszamy ponownie\n"));
            footer.Inlines.Add(new Run($"Data wydruku: {DateTime.Now:dd.MM.yyyy HH:mm}\n"));

            document.Blocks.Add(footer);

            return document;
        }

        /// <summary>
        /// Tworzy dokument zamówienia dla kuchni
        /// </summary>
        private FlowDocument CreateKitchenOrderDocument(Order order)
        {
            var document = new FlowDocument();
            document.PageWidth = 600;
            document.PagePadding = new Thickness(30);
            document.FontFamily = new FontFamily("Arial");
            document.FontSize = 14;

            // Header
            var header = new Paragraph();
            header.TextAlignment = TextAlignment.Center;
            header.Margin = new Thickness(0, 0, 0, 20);

            header.Inlines.Add(new Run("ZAMÓWIENIE DLA KUCHNI\n") { FontWeight = FontWeights.Bold, FontSize = 18 });
            header.Inlines.Add(new Run($"#{order.Id}\n") { FontWeight = FontWeights.Bold, FontSize = 16, Foreground = Brushes.Red });

            document.Blocks.Add(header);

            // Informacje o zamówieniu
            var orderInfo = new Paragraph();
            orderInfo.Margin = new Thickness(0, 0, 0, 20);
            orderInfo.FontSize = 12;

            orderInfo.Inlines.Add(new Run($"📅 Data zamówienia: {order.OrderDate:dd.MM.yyyy HH:mm}\n"));
            orderInfo.Inlines.Add(new Run($"👤 Klient: {order.User.FirstName} {order.User.LastName}\n"));
            orderInfo.Inlines.Add(new Run($"📧 Email: {order.User.Email}\n"));
            orderInfo.Inlines.Add(new Run($"📊 Status: {GetStatusDisplayName(order.Status)}\n"));
            orderInfo.Inlines.Add(new Run($"💰 Wartość zamówienia: {order.TotalAmount:C}\n"));

            document.Blocks.Add(orderInfo);

            // Pozycje do przygotowania
            var itemsTitle = new Paragraph(new Run("POZYCJE DO PRZYGOTOWANIA:") { FontWeight = FontWeights.Bold, FontSize = 16 });
            itemsTitle.Margin = new Thickness(0, 20, 0, 10);
            document.Blocks.Add(itemsTitle);

            foreach (var item in order.OrderItems)
            {
                var itemBlock = new Paragraph();
                itemBlock.Margin = new Thickness(20, 10, 0, 15);
                itemBlock.FontSize = 14;

                itemBlock.Inlines.Add(new Run($"🍽️ {item.MenuItem?.Name ?? "Nieznana pozycja"}\n") { FontWeight = FontWeights.Bold, FontSize = 16 });
                itemBlock.Inlines.Add(new Run($"   Kategoria: {item.MenuItem?.Category?.Name ?? "Brak"}\n"));
                itemBlock.Inlines.Add(new Run($"   Ilość: {item.Quantity} szt.\n") { FontWeight = FontWeights.Bold });
                
                if (!string.IsNullOrEmpty(item.MenuItem?.Description))
                {
                    itemBlock.Inlines.Add(new Run($"   Opis: {item.MenuItem.Description}\n"));
                }
                
                itemBlock.Inlines.Add(new Run($"   Cena jednostkowa: {item.UnitPrice:C}\n"));
                itemBlock.Inlines.Add(new Run("   ─────────────────────────\n"));

                document.Blocks.Add(itemBlock);
            }

            // Uwagi dla kuchni
            var notes = new Paragraph();
            notes.Margin = new Thickness(0, 30, 0, 0);
            notes.FontSize = 12;
            notes.Background = Brushes.LightYellow;
            notes.Padding = new Thickness(15);

            notes.Inlines.Add(new Run("📝 UWAGI:\n") { FontWeight = FontWeights.Bold });
            notes.Inlines.Add(new Run("• Sprawdź wszystkie pozycje przed rozpoczęciem przygotowania\n"));
            notes.Inlines.Add(new Run("• Po zakończeniu zmień status na 'Zrealizowane'\n"));
            notes.Inlines.Add(new Run("• W razie problemów skontaktuj się z administratorem\n"));

            document.Blocks.Add(notes);

            // Footer
            var footer = new Paragraph();
            footer.TextAlignment = TextAlignment.Center;
            footer.Margin = new Thickness(0, 30, 0, 0);
            footer.FontSize = 10;
            footer.Foreground = Brushes.Gray;

            footer.Inlines.Add(new Run($"Wydrukowano: {DateTime.Now:dd.MM.yyyy HH:mm}"));

            document.Blocks.Add(footer);

            return document;
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
    }
} 