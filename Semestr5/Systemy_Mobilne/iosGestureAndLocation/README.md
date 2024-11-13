# iOS Gesture and Location App

This app demonstrates gesture detection and location services in iOS. It contains two views with distinct functionalities: gesture recognition and location retrieval.

## Features

### View 1: Gesture Recognition

- **Shake Gesture**: Detects a shake gesture and prompts the user to change the background color.
- **Tap Gesture**: Recognizes a tap gesture and updates a label with "Tap detected!"
- **Pinch Gesture**: Detects a pinch gesture and updates a label with "Pinch detected!"
- **Swipe Gesture**: Recognizes a swipe gesture, updates a label with "Swipe detected!" and navigates to the second view.
- **Long Press Gesture**: Detects a long press gesture and updates a label with "LongPress detected!"

<p align="center">
  <img width="572" alt="First View" src="https://github.com/user-attachments/assets/d4657ea0-40b4-42e2-b79b-2b1675ca437f">
</p>

### View 2: Location Services

- **Current Location Retrieval**: Initiates location services to retrieve and display the user's current latitude, longitude, and address information.
- **Location Error Handling**: Shows an alert if there is an error in fetching the location.
- **Reverse Geocoding**: Converts the current coordinates into a readable address format and displays it on the screen.

<p align="center">
  <img width="572" alt="Second View" src="https://github.com/user-attachments/assets/573c01ee-23af-409a-9e75-20c760bff690">
</p>

## Usage

1. **Run the App**: Launch the app on an iOS device or simulator.
2. **Interact with Gestures**: In the first view, try different gestures (shake, tap, pinch, swipe, and long press) to see corresponding actions.
3. **Access Location**: Swipe to the second view and tap the "Get Current Location" button to display your coordinates and address (location permissions required).
