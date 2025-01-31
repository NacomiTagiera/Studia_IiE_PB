import SwiftUI
import CoreMotion

extension UIWindow {
    open override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake {
            NotificationCenter.default.post(name: .shakeGesture, object: nil)
        }
    }
}

extension Notification.Name {
    static let shakeGesture = Notification.Name("shakeGesture")
}

struct ContentView: View {
    @State private var amountText = ""
    @State private var fromCurrencyIndex = 0
    @State private var toCurrencyIndex = 1
    @State private var resultText = "0.00"
    @State private var currencies: [Currency] = []
    @State private var currencyCodes: [String] = []
    @State private var currencyMap: [String: Double] = [:]
    @State private var isLoading = true
    @State private var isFromDropdownOpen = false
    @State private var isToDropdownOpen = false

    let motionManager = CMMotionManager()

    var body: some View {
        TabView {
            // Currency Converter Tab
            NavigationView {
                ScrollView {
                    VStack(spacing: 24) {
                        if isLoading {
                            ProgressView("Loading currencies...")
                                .padding()
                        } else {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Amount")
                                    .foregroundColor(.secondary)
                                    .font(.subheadline)

                                TextField("Enter amount", text: $amountText)
                                    .keyboardType(.decimalPad)
                                    .textFieldStyle(RoundedBorderTextFieldStyle())
                                    .font(.system(size: 24, weight: .medium))
                                    .padding()
                                    .background(Color(.systemBackground))
                                    .cornerRadius(12)
                                    .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
                            }
                            .padding(.horizontal)

                            VStack(spacing: 16) {
                                // From Currency
                                Menu {
                                    ForEach(0..<currencyCodes.count, id: \.self) { index in
                                        Button(action: {
                                            fromCurrencyIndex = index
                                        }) {
                                            Text(currencyCodes[index])
                                        }
                                    }
                                } label: {
                                    HStack {
                                        Text("From: \(currencyCodes[fromCurrencyIndex])")
                                            .foregroundColor(.primary)
                                        Spacer()
                                        Image(systemName: "chevron.down")
                                            .foregroundColor(.secondary)
                                    }
                                    .padding()
                                    .background(Color(.systemBackground))
                                    .cornerRadius(12)
                                    .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
                                }

                                // To Currency
                                Menu {
                                    ForEach(0..<currencyCodes.count, id: \.self) { index in
                                        Button(action: {
                                            toCurrencyIndex = index
                                        }) {
                                            Text(currencyCodes[index])
                                        }
                                    }
                                } label: {
                                    HStack {
                                        Text("To: \(currencyCodes[toCurrencyIndex])")
                                            .foregroundColor(.primary)
                                        Spacer()
                                        Image(systemName: "chevron.down")
                                            .foregroundColor(.secondary)
                                    }
                                    .padding()
                                    .background(Color(.systemBackground))
                                    .cornerRadius(12)
                                    .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
                                }
                            }
                            .padding(.horizontal)

                            VStack(spacing: 16) {
                                Button(action: calculateConversion) {
                                    Text("Convert")
                                        .font(.headline)
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity)
                                        .padding()
                                        .background(Color.blue)
                                        .cornerRadius(12)
                                }

                                VStack(spacing: 8) {
                                    Text("Converted Amount")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                    Text(resultText)
                                        .font(.system(size: 32, weight: .bold))
                                        .foregroundColor(.primary)
                                }
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Color(.systemBackground))
                                .cornerRadius(12)
                                .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
                            }
                            .padding(.horizontal)

                            // Action Buttons
                            HStack(spacing: 16) {
                                Button(action: resetFields) {
                                    HStack {
                                        Image(systemName: "arrow.counterclockwise")
                                        Text("Reset")
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.red)
                                    .cornerRadius(12)
                                }

                                NavigationLink(destination: MapView(cityName: getSelectedCapital())) {
                                    HStack {
                                        Image(systemName: "map")
                                        Text("Show Map")
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.green)
                                    .cornerRadius(12)
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                    .padding(.vertical)
                }
                .navigationTitle("Currency Converter")
                .onAppear {
                    fetchCurrencies()
                    shakeGesture()
                }
                .onDisappear {
                    motionManager.stopAccelerometerUpdates()
                }
                .onReceive(NotificationCenter.default.publisher(for: .shakeGesture)) { _ in
                    resetFields()
                }
            }
            .tabItem {
                Label("Currency Converter", systemImage: "dollarsign.circle")
            }

            NavigationView {
                MapView(cityName: getSelectedCapital())
                    .navigationTitle("Map")
            }
            .tabItem {
                Label("Map", systemImage: "map")
            }
        }
    }

    func fetchCurrencies() {
        APIHandler.shared.fetchCurrencies { rates in
            DispatchQueue.main.async {
                if let rates = rates {
                    self.currencies = rates
                    self.currencyCodes = rates.map { $0.code }
                    self.currencyMap = Dictionary(uniqueKeysWithValues: rates.map { ($0.code, $0.mid) })

                    if let eurIndex = self.currencyCodes.firstIndex(of: CurrencyData.defaultFromCurrency) {
                        self.fromCurrencyIndex = eurIndex
                    }
                    if let usdIndex = self.currencyCodes.firstIndex(of: CurrencyData.defaultToCurrency) {
                        self.toCurrencyIndex = usdIndex
                    }
                }
                self.isLoading = false
            }
        }
    }

    func calculateConversion() {
        guard !currencyCodes.isEmpty else { return }
        guard let amount = Double(amountText) else { return }
        let fromCurrency = currencyCodes[fromCurrencyIndex]
        let toCurrency = currencyCodes[toCurrencyIndex]

        if let fromRate = currencyMap[fromCurrency], let toRate = currencyMap[toCurrency] {
            let result = amount * (fromRate / toRate)
            resultText = String(format: "%.2f", result)
        }
    }

    func resetFields() {
        DispatchQueue.main.async {
            amountText = ""
            if let eurIndex = currencyCodes.firstIndex(of: CurrencyData.defaultFromCurrency) {
                fromCurrencyIndex = eurIndex
            }
            if let usdIndex = currencyCodes.firstIndex(of: CurrencyData.defaultToCurrency) {
                toCurrencyIndex = usdIndex
            }
            resultText = "0.00"
        }
    }

    func getSelectedCapital() -> String {
        guard !currencyCodes.isEmpty else { return "Unknown" }
        let selectedCurrency = currencyCodes[fromCurrencyIndex]
        return CurrencyData.capitals[selectedCurrency] ?? "Unknown"
    }

    func shakeGesture() {
        guard motionManager.isAccelerometerAvailable else {
            print("Accelerometer not available.")
            return
        }

        motionManager.accelerometerUpdateInterval = 0.1
        motionManager.startAccelerometerUpdates(to: .main) { data, _ in
            if let acceleration = data?.acceleration {
                if abs(acceleration.x) > 1.5 || abs(acceleration.y) > 1.5 || abs(acceleration.z) > 1.5 {
                    resetFields()
                }
            }
        }
    }
}
