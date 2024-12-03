import SwiftUI

struct ContentView: View {
    @State private var users = User.samples
    @State private var isAddUserDialogPresented = false
    @State private var isEditUserDialogPresented = false
    @State private var isUserDetailsPresented = false
    @State private var selectedUser: User? = nil
    
    private func presentAddUserView() {
        isAddUserDialogPresented.toggle()
    }
    
    private func presentEditUserView(for user: User) {
        selectedUser = user
        isEditUserDialogPresented.toggle()
    }
    
    private func presentUserDetails(for user: User) {
        selectedUser = user
        isUserDetailsPresented.toggle()
    }
    
    private func deleteUser(user: User) {
        if let index = users.firstIndex(where: { $0.id == user.id }) {
            users.remove(at: index)
        }
    }
    
    var body: some View {
        List {
            ForEach(users) { user in
                HStack {
                    VStack(alignment: .leading) {
                        Text("\(user.firstName) \(user.lastName)")
                            .font(.headline)
                    }
                    Spacer()
                    Image(systemName: "info.circle")
                        .foregroundColor(.blue)
                        .onTapGesture {
                            presentUserDetails(for: user)
                        }
                    Image(systemName: "pencil")
                        .foregroundColor(.blue)
                        .onTapGesture {
                            presentEditUserView(for: user)
                        }
                    Image(systemName: "trash")
                        .foregroundColor(.red)
                        .onTapGesture {
                            deleteUser(user: user)
                        }
                }
            }
        }
        .toolbar {
            ToolbarItemGroup(placement: .bottomBar) {
                Button(action: presentAddUserView) {
                    HStack {
                        Image(systemName: "plus.circle.fill")
                        Text("Add User")
                    }
                }
                Spacer()
            }
        }
        .sheet(isPresented: $isAddUserDialogPresented) {
            AddUserView(existingUsers: users) { user in
                users.append(user)
            }
        }
        .sheet(isPresented: $isEditUserDialogPresented) {
            if let selectedUser {
                EditUserView(user: selectedUser, existingUsers: users) { updatedUser in
                    if let index = users.firstIndex(where: { $0.id == selectedUser.id }) {
                        users[index] = updatedUser
                    }
                }
            }
        }
        .sheet(isPresented: $isUserDetailsPresented) {
            if let selectedUser {
                UserDetailsView(user: selectedUser)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            ContentView()
                .navigationTitle("Users")
        }
    }
}