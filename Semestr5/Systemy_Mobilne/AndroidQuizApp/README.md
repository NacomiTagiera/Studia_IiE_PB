# Android Quiz App

A simple Android quiz application that tests users' knowledge through true/false questions on various topics

<div align="center">
  <img src="https://github.com/user-attachments/assets/24cdfeb8-ff84-4ffe-91ce-8bd878170772" alt="image" />
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/64a67663-3b40-4fa6-b06d-a928d3081672" alt="image" />
</div>

## Features

- True/False questions interface
- Question navigation system
- Hint/Answer reveal option
- Score tracking
- Answer validation
- Activity state preservation
- Results display

## How It Works

The app consists of two main activities:

1. `MainActivity`
   - Displays questions one at a time
   - Handles user input (True/False answers)
   - Tracks score and progress
   - Allows navigation between questions
   - Shows immediate feedback on answers

2. `PromptActivity`
   - Provides answer reveal functionality
   - Confirms user's intention to see the answer
   - Returns to main quiz interface after showing the answer

## Technical Details

- Written in Java
- Uses Android's Activity lifecycle management
- Implements state preservation through configuration changes
- Uses Intent system for inter-activity communication
- Built with Android's Material Design components
- Utilizes Android resource system for strings and layouts

## Building the Project

To build and run the project:

`./gradlew build`

Or open in Android Studio and run directly on an emulator or device.
