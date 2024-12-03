# Swift CRUD App

A simple yet functional iOS application demonstrating CRUD (Create, Read, Update, Delete) operations using SwiftUI. The app allows users to manage a list of contacts with their personal information.

<div align="center">
  <img width="572" margin="10px" src="https://github.com/user-attachments/assets/0b8e949a-990b-4432-aafb-ae251ee64ef5" alt="Main Screen">
</div>
<div align="center">
  <img width="572" margin="10px" src="https://github.com/user-attachments/assets/30301905-56cc-4790-826a-00f00917265f" alt="User Details Screen">
</div>
<div align="center">
  <img width="572" margin="10px" src="https://github.com/user-attachments/assets/f8964149-4648-4eb3-80a4-b8648652433c" alt="Add User Screen">
</div>
<div align="center">
  <img width="572" margin="10px" src="https://github.com/user-attachments/assets/51eb5f4e-121e-482d-ad14-a8d082ad427e" alt="Email Validation Error">
</div>

## Features

- **Create:** Add new users with their personal details
- **Read:** View a list of users and their detailed information
- **Update:** Edit existing user information
- **Delete:** Remove users from the list

## App Structure

The app consists of several SwiftUI views:

- **ContentView:** Main view displaying the list of users with options to add, edit, view details, and delete
- **AddUserView:** Form for adding new users with input validation
- **EditUserView:** Form for modifying existing user information
- **UserDetailsView:** Detailed view of user information
- **User:** Data model for storing user information

## Features in Detail

### User Management
- Display users in a list format
- Each user entry shows their full name
- Quick access buttons for viewing details, editing, and deleting users

### Data Validation
- Required field validation
- Email format validation
- Duplicate email and phone number checking
- Error messages for invalid inputs

### User Information
Each user record includes:
- First Name
- Last Name
- Email Address
- Phone Number
- Date of Birth
- Address

## Technical Implementation

- Built using SwiftUI framework
- Implements MVVM architecture pattern
- Uses Swift's native data structures
- Implements form validation and error handling
- Uses SwiftUI's sheet presentations for modals
- Utilizes @State and @Environment property wrappers for state management

## Requirements

- iOS 15.0+
- Xcode 13.0+
- Swift 5.5+

## Installation

1. Clone the repository
2. Open the project in Xcode
3. Build and run the application

## Future Improvements

- Data persistence using CoreData or other storage solutions
- User authentication
- Search and filter functionality
- Sort options for the user list
- Additional user information fields
- Image upload for user profiles