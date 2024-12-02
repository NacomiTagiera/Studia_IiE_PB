import SwiftUI

struct EditUserView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var user: User
    @State private var errorMessage = ""
    @State private var showError = false
    
    let existingUsers: [User]
    var onSave: (User) -> Void
    
    init(user: User, existingUsers: [User], onSave: @escaping (User) -> Void) {
        _user = State(initialValue: user)
        self.existingUsers = existingUsers
        self.onSave = onSave
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func validateInput() -> Bool {
        if user.firstName.isEmpty || user.lastName.isEmpty || user.email.isEmpty || 
           user.phoneNumber.isEmpty || user.address.isEmpty {
            errorMessage = "All fields are required"
            return false
        }
        
        if !isValidEmail(user.email) {
            errorMessage = "Please enter a valid email address"
            return false
        }
        
        let otherUsers = existingUsers.filter { $0.id != user.id }
        
        if otherUsers.contains(where: { $0.email == user.email }) {
            errorMessage = "A user with this email already exists"
            return false
        }
        
        if otherUsers.contains(where: { $0.phoneNumber == user.phoneNumber }) {
            errorMessage = "A user with this phone number already exists"
            return false
        }
        
        return true
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Personal Information") {
                    TextField("First Name", text: $user.firstName)
                    TextField("Last Name", text: $user.lastName)
                    TextField("Email", text: $user.email)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.emailAddress)
                    TextField("Phone Number", text: $user.phoneNumber)
                        .keyboardType(.phonePad)
                    DatePicker("Date of Birth", selection: $user.dateOfBirth, displayedComponents: .date)
                    TextField("Address", text: $user.address)
                }
            }
            .navigationTitle("Edit User")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        if validateInput() {
                            onSave(user)
                            dismiss()
                        } else {
                            showError = true
                        }
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