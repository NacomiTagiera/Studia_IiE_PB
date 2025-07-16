# Foodify – Food Delivery Desktop Application

## Project Overview
Foodify is a modern desktop application built with WPF (.NET 8) that allows customers to order food for delivery. The app covers the whole journey – from browsing the menu, through secure authentication, to order management for administrators.

## Tech Stack
- Framework: Windows Presentation Foundation (WPF) on .NET 8
- Database: PostgreSQL (hosted on Neon.tech)
- ORM: Entity Framework Core
- Architectural Pattern: MVVM (Model-View-ViewModel) with CommunityToolkit.Mvvm
- Password hashing: BCrypt.Net with a work factor of 12
- Printing: Raw print service for kitchen tickets & customer receipts

## Project Structure (simplified)

```text
WpfRestaurant/
├── Data/                     # Entity Framework DbContext & factory
├── Enums/                    # Enumerations (user roles & order statuses)
├── Models/                   # EF entities (User, Category, MenuItem, Order, OrderItem)
├── Services/                 # Business logic (User, Menu, Order, Password, Print)
├── ViewModels/               # MVVM layer
├── Views/                    # XAML views
├── Migrations/               # EF Core migrations & seed data
├── appsettings.json          # Configuration (connection string, logging…)
└── Program.cs                # Application entry-point
```

## Implemented Features

### ✅ Database & Migrations
• Complete Entity Framework Core model that matches the Product Requirements Document (PRD)  
• InitialCreate + FixSeedData migrations applied  
• All required tables are present: `Users`, `Categories`, `MenuItems`, `Orders`, `OrderItems`  
• Proper foreign-key relations and validation attributes  
• Seed data – including a default administrator account and 4 sample categories

### ✅ Security
• Passwords are hashed with BCrypt (12 rounds) – see `PasswordService.cs`  
• Password policy enforcement (min 8 chars, at least 1 letter & 1 digit)  
• Email & phone number validation via DataAnnotations  
• Extended `User` entity with `PhoneNumber` and `Address` fields

### ✅ MVVM with Real-time Validation
• Clean MVVM separation with CommunityToolkit.Mvvm  
• `BaseViewModel` inherits from `ObservableValidator` for automatic validation  
• `LoginViewModel` & `RegisterViewModel` provide async commands with instant feedback  
• Data binding works with `PasswordBox` via attached behaviour

### ✅ Application Windows
• **LoginWindow** – modern sign-in form with loading indicators & error messages  
• **RegisterWindow** – full registration with live validation  
• **MainWindow** – customer area (menu browsing, cart, checkout)  
• **AdminPanelWindow** – administration dashboard (menu management, order monitoring, ticket printing)  
• **OrderHistoryWindow** – customer order archive with receipt printing

## Data Model

• **User** – email (unique), hashed password, first & last name, phone number, address, role, createdAt  
• **Category** – unique name, description, 1-to-many with `MenuItems`  
• **MenuItem** – name, description, price, active flag, many-to-1 with `Category`  
• **Order** – associated user, status (RECEIVED / IN_PREPARATION / COMPLETED), orderDate, completedDate, totalAmount  
• **OrderItem** – quantity, unitPrice, FK to `Order` & `MenuItem`

### Default Administrator
Email: `admin@foodify.com`  
Password: `admin123`

## Getting Started

1. Clone the repository  
   ```bash
   git clone <repository-url>
   cd WpfRestaurant
   ```

2. Restore NuGet packages  
   ```bash
   dotnet restore
   ```

3. Apply migrations (only needed on a fresh database)  
   ```bash
   dotnet ef database update
   ```

4. Run the application  
   ```bash
   dotnet run
   ```

## Testing

• Login using the default admin credentials above  
• Try entering invalid data to see real-time validation in action  
• Explore the Admin Panel: add/edit menu items, change order status, print tickets  
• As a customer, place an order and review it in Order History

## System Requirements
• Windows 10 (or newer) / macOS Catalina (or newer)  
• .NET 8 Runtime  
• Internet access (for the Neon.tech PostgreSQL instance)
