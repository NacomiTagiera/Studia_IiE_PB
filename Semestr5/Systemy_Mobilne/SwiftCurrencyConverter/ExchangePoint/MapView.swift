import SwiftUI
import MapKit

struct MapView: View {
    var cityName: String
    @StateObject private var viewModel = MapViewModel()

    var body: some View {
        Map(position: $viewModel.position) {
            if let annotation = viewModel.cityAnnotation {
                Marker(cityName, coordinate: annotation.coordinate)
            }
        }
        .onAppear {
            viewModel.geocodeCity(cityName: cityName)
        }
        .navigationTitle(cityName)
    }
}
