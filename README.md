# Astrovigya Users

A comprehensive React Native mobile application for astrology services, consultations, and spiritual guidance.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Dependencies](#key-dependencies)
- [Build Instructions](#build-instructions)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

Astrovigya Users is a mobile application that provides users with access to astrology services including:
- Personal consultations with astrologers
- Horoscope and chart readings
- Spiritual courses and remedies
- Puja services and bookings
- E-commerce store for spiritual products
- Wallet functionality for payments
- Multi-language support (English/Hindi)

## Features

- **Authentication System**: Secure login/signup with OTP verification
- **Consultation Services**: Book and manage astrology consultations
- **Live Chat**: Real-time communication with astrologers
- **Video Calls**: Integrated video calling using Agora
- **E-commerce**: Browse and purchase spiritual products
- **Wallet Integration**: Manage payments and transactions
- **Multi-language Support**: Available in English and Hindi
- **Push Notifications**: Stay updated with important information
- **Offline Support**: Basic functionality available offline
- **Dark/Light Theme**: Customizable user interface

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **React Native CLI**: `npm install -g react-native-cli`
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)
- **Java Development Kit (JDK)**: Version 11 or higher
- **Android SDK**: API level 33 or higher

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AstrovigyaUsersUpdated
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Apply patches** (automatically runs after install):
   ```bash
   npm run postinstall
   ```

4. **Link assets**:
   ```bash
   npx react-native-asset
   ```

5. **iOS Setup** (macOS only):
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the Application

### Start Metro Bundler

First, start the Metro development server:

```bash
npm start
# or
yarn start
```

### Run on Android

```bash
npm run android
# or
yarn android
```

### Run on iOS

```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
src/
├── assets/           # Images, fonts, and other static assets
├── components/       # Reusable UI components
├── context/          # React Context providers
├── Languages/        # Internationalization files
├── model/           # Data models and types
├── navigation/      # Navigation configuration
├── screens/         # Screen components
│   ├── AuthScreen/  # Authentication related screens
│   └── NoAuthScreen/ # Main application screens
├── store/           # Redux store configuration
└── utils/           # Utility functions and helpers
```

## Key Dependencies

### Core Framework
- **React Native**: 0.80.1
- **React**: 19.1.0

### Navigation
- **@react-navigation/native**: Bottom tabs, drawer, and stack navigation

### State Management
- **@reduxjs/toolkit**: State management
- **react-redux**: React bindings for Redux

### Firebase Integration
- **@react-native-firebase/app**: Core Firebase functionality
- **@react-native-firebase/messaging**: Push notifications
- **@react-native-firebase/firestore**: Database
- **@react-native-firebase/storage**: File storage

### Communication
- **agora-rn-uikit**: Video calling functionality
- **react-native-gifted-chat**: Chat interface

### Payment Integration
- **react-native-razorpay**: Payment gateway integration

### UI Components
- **react-native-vector-icons**: Icon library
- **react-native-linear-gradient**: Gradient backgrounds
- **react-native-modal**: Modal components

## Build Instructions

### Android Build

1. **Debug Build**:
   ```bash
   npm run android
   ```

2. **Release Build**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Clean Build**:
   ```bash
   npm run clean
   ```

### iOS Build

1. **Debug Build**:
   ```bash
   npm run ios
   ```

2. **Release Build**:
   Open `ios/AstrovigyaUsers.xcworkspace` in Xcode and build for release.

## Development Notes

### Environment Setup

1. **Firebase Configuration**:
   - Place `google-services.json` in `android/app/`
   - Configure Firebase services in the Firebase Console

2. **API Keys**:
   - Configure Razorpay keys for payment integration
   - Set up Agora credentials for video calling
   - Add Google Places API key for location services

### Patches Applied

The project uses several patches for third-party libraries:
- `react-native-document-picker`: Enhanced document selection
- `react-native-google-places-autocomplete`: Location autocomplete fixes
- `react-native-snap-carousel`: Carousel component improvements
- `react-native-splash-screen`: Splash screen enhancements

### Asset Management

Custom fonts and images are managed through:
- Fonts: Located in `src/assets/fonts/`
- Images: Located in `src/assets/images/`
- Use `npx react-native-asset` after adding new assets

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build failures**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

3. **iOS build issues**:
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

4. **Package conflicts**:
   ```bash
   rm -rf node_modules
   npm install
   ```

### Performance Optimization

- Use `@d11/react-native-fast-image` for optimized image loading
- Implement proper list virtualization for large datasets
- Use React.memo and useMemo for component optimization

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Code Style

- Follow ESLint configuration provided in the project
- Use Prettier for code formatting
- Follow React Native best practices
- Write meaningful commit messages

---

**Version**: 0.0.4  
**Minimum Node.js Version**: 18+  
**React Native Version**: 0.80.1

For technical support or questions, please refer to the project documentation or contact the development team.
