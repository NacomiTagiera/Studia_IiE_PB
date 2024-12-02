import Foundation

struct User: Identifiable {
    let id = UUID()
    var firstName: String
    var lastName: String
    var email: String
    var phoneNumber: String
    var dateOfBirth: Date
    var address: String
}

extension User {
    static let samples = [
        User(
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phoneNumber: "+1234567890",
            dateOfBirth: Date(),
            address: "ul. Sienkiewicza 321"
        ),
        User(
            firstName: "Jakub",
            lastName: "Pawlak",
            email: "kpawlak02@wp.pl",
            phoneNumber: "+48600123456",
            dateOfBirth: Date(),
            address: "ul. Wiejska 123"
        )
    ]
} 