# Currency Converter App

A modern iOS application built with SwiftUI that allows users to convert between different currencies using real-time exchange rates from the National Bank of Poland (NBP) API. The app features an interactive interface, shake gesture support, and integration with Apple Maps.

<div align="center">
  <img width="572" margin="10px" src="https://github.com/user-attachments/assets/8677f394-befb-4166-8a9f-8349d596bbdc" alt="Converter Screen">
</div>
<div align="center">
  <img width="572" margin="10px" src="https://github.com/user-attachments/assets/b9d98a8c-6757-4ad1-8ea2-1c4138dcda7f" alt="Map Screen">
</div>

## Features

### Currency Conversion
- Real-time currency conversion using NBP API
- Support for multiple currencies
- Simple and intuitive interface for entering amounts
- Quick currency selection through dropdown menus
- Automatic rate calculation

### Interactive Features
- Shake gesture support to reset conversion values
- Interactive map view showing capital cities of selected currencies
- Tab-based navigation for easy access to different features

### Maps Integration
- Display of capital cities for selected currencies
- Interactive markers with city names
- Automatic map centering on selected locations
- Smooth zoom and pan controls

### Technical Features
- Real-time data fetching from NBP API
- Accelerometer integration for shake detection
- CoreLocation integration for geocoding
- MapKit integration for displaying locations
- SwiftUI-based modern user interface

## Technical Implementation

### Core Components
- **APIHandler**: Manages API calls to NBP for currency rates
- **CurrencyData**: Stores currency metadata and capital cities
- **MapViewModel**: Handles map-related functionality
- **ContentView**: Main interface with currency conversion logic

### Data Models
- Currency conversion models
- Location annotation models
- Exchange rate data structures

### External Integrations
- NBP API for exchange rates
- Apple MapKit for map display
- Core Motion for shake detection
- CoreLocation for geocoding

## Requirements

- iOS 15.0 or later
- Xcode 13.0 or later
- Internet connection for fetching exchange rates
- Location services enabled for map functionality

## Installation

1. Clone the repository
2. Open `ExchangePoint.xcodeproj` in Xcode
3. Build and run the application on your iOS device or simulator

## Usage

1. **Currency Conversion**
   - Select source currency from the "From" dropdown
   - Enter amount to convert
   - Select target currency from the "To" dropdown
   - View the converted amount instantly

2. **Map View**
   - Tap the map tab to view capital cities
   - Select different currencies to see their capitals
   - Interact with the map using standard gestures

3. **Reset Feature**
   - Shake the device to reset all input values
   - Use the reset button for manual reset