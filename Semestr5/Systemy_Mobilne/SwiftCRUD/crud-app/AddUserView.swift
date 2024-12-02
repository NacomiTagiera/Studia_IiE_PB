import SwiftUI

struct AddUserView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phoneNumber = ""
    @State private var dateOfBirth = Date()
    @State private var address = ""
    @State private var errorMessage = ""
    @State private var showError = false
    
    let existingUsers: [User]
    var onCommit: (User) -> Void
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func validateInput() -> Bool {
        if firstName.isEmpty || lastName.isEmpty || email.isEmpty || phoneNumber.isEmpty || address.isEmpty {
            errorMessage = "All fields are required"
            return false
        }
        
        if !isValidEmail(email) {
            errorMessage = "Please enter a valid email address"
            return false
        }
        
        if existingUsers.contains(where: { $0.email == email }) {
            errorMessage = "A user with this email already exists"
            return false
        }
        
        if existingUsers.contains(where: { $0.phoneNumber == phoneNumber }) {
            errorMessage = "A user with this phone number already exists"
            return false
        }
        
        return true
    }
    
    private func commit() {
        if validateInput() {
            let user = User(
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                dateOfBirth: dateOfBirth,
                address: address
            )
            onCommit(user)
            dismiss()
        } else {
            showError = true
        }
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Personal Information") {
                    TextField("First Name", text: $firstName)
                    TextField("Last Name", text: $lastName)
                    TextField("Email", text: $email)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                    TextField("Phone Number", text: $phoneNumber)
                        .keyboardType(.phonePad)
                    DatePicker("Date of Birth", selection: $dateOfBirth, displayedComponents: .date)
                    TextField("Address", text: $address)
                }
            }
            .navigationTitle("New User")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        commit()
                    }
                }
            }
            .alert("Validation Error", isPresented: $showError) {
                Button("OK") {}
            } message: {
                Text(errorMessage)
            }
        }
    }
} 