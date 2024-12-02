import SwiftUI

struct UserDetailsView: View {
    let user: User
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Personal Information") {
                    LabeledContent("Name", value: "\(user.firstName) \(user.lastName)")
                    LabeledContent("Email", value: user.email)
                    LabeledContent("Phone", value: user.phoneNumber)
                    LabeledContent("Date of Birth", value: user.dateOfBirth.formatted(date: .long, time: .omitted))
                    LabeledContent("Address", value: user.address)
                }
            }
            .navigationTitle("User Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
} 