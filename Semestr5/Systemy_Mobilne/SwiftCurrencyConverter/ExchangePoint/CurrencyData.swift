import Foundation

struct CurrencyData {
    static let capitals: [String: String] = [
        "PLN": "Warsaw",
        "USD": "Washington, D.C.",
        "EUR": "Brussels",
        "GBP": "London",
        "JPY": "Tokyo",
        "CHF": "Bern",
        "AUD": "Canberra",
        "CAD": "Ottawa",
        "CNY": "Beijing",
        "INR": "New Delhi",
        "RUB": "Moscow",
        "BRL": "Brasília",
        "ZAR": "Pretoria",
        "KRW": "Seoul",
        "MXN": "Mexico City",
        "SEK": "Stockholm",
        "NOK": "Oslo",
        "DKK": "Copenhagen",
        "TRY": "Ankara",
        "NZD": "Wellington"
    ]
    
    static let defaultFromCurrency = "EUR"
    static let defaultToCurrency = "USD"
}
