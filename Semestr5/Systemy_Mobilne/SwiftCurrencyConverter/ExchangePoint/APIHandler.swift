import Foundation

struct Currency : Codable {
    let code: String
    let mid: Double
}

struct CurrencyTable: Codable {
    let rates: [Currency]
}
	
class APIHandler{
    static let shared = APIHandler()
    private init() {}
    
    func fetchCurrencies(completion: @escaping([Currency]?)->Void){
        guard let url = URL(string: "https://api.nbp.pl/api/exchangerates/tables/A/?format=json") else { return }
        
        URLSession.shared.dataTask(with: url) {data, _,error in
            if let data = data {
                do {
                    let result = try JSONDecoder().decode([CurrencyTable].self, from: data)
                    completion(result.first?.rates)
                } catch {
                    print("Error decoding: \(error)")
                    completion(nil)
                }
            } else {
                print("Error fetching data: \(error?.localizedDescription ?? "Unknown error")")
                completion(nil)
            }
        }.resume()
    }
}
