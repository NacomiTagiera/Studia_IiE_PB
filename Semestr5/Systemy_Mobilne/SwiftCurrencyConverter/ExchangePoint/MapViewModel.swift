import Foundation
import CoreLocation
import MapKit
import SwiftUI

class MapViewModel: ObservableObject {
    @Published var position: MapCameraPosition = .region(MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 0, longitude: 0),
        latitudinalMeters: 10000,
        longitudinalMeters: 10000
    ))
    
    @Published var cityAnnotation: MapAnnotationItem? = nil

    func geocodeCity(cityName: String) {
        let geocoder = CLGeocoder()
        geocoder.geocodeAddressString(cityName) { placemarks, error in
            if let placemark = placemarks?.first, let location = placemark.location {
                let coordinate = location.coordinate
                self.cityAnnotation = MapAnnotationItem(coordinate: coordinate)
                self.position = .region(MKCoordinateRegion(
                    center: coordinate,
                    latitudinalMeters: 10000,
                    longitudinalMeters: 10000
                ))
            } else {
                print("Error geocoding city: \(error?.localizedDescription ?? "Unknown error")")
            }
        }
    }
}
