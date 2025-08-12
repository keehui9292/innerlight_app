# Innerlight Community App

A React Native app built with Expo and Gluestack UI for the Innerlight Community. This is a member-only wellness application that allows users to manage appointments and stay connected with the community.

## Features

- **Member-Only Authentication**: Secure login and forgot password functionality
- **Appointment Management**: View, schedule, and manage wellness appointments
- **Cross-Platform Support**: iOS, Android, and Web platforms
- **Minimalist Design**: Clean and modern UI using Gluestack UI
- **Responsive Layout**: Optimized for different screen sizes
- **Real-time Updates**: Live appointment status and notifications

## Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: Gluestack UI with custom theming
- **Navigation**: React Navigation v6
- **Icons**: Lucide React Native
- **State Management**: React Context
- **Storage**: AsyncStorage for local data persistence
- **Platforms**: iOS, Android, Web

## Project Structure

```
src/
├── components/
│   └── common/
│       ├── FormInput.js      # Reusable form input component
│       ├── Button.js         # Custom button component
│       ├── LoadingScreen.js  # Loading state component
│       └── ErrorBoundary.js  # Error handling component
├── context/
│   └── AuthContext.js        # Authentication state management
├── navigation/
│   ├── AppNavigator.js       # Main app navigator
│   ├── AuthStack.js          # Authentication screens
│   └── MainStack.js          # Main app screens with tabs
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js    # Login screen
│   │   └── ForgotPasswordScreen.js
│   └── main/
│       ├── HomeScreen.js     # Dashboard/home screen
│       ├── AppointmentScreen.js # Appointments management
│       └── ProfileScreen.js  # User profile and settings
├── services/
│   └── apiService.js         # API communication service
└── constants/
    └── config.js             # App configuration and constants
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

### Running on Different Platforms

```bash
# Start Expo development server
npm start

# Run on iOS (requires Xcode)
npm run ios

# Run on Android (requires Android Studio)
npm run android

# Run on Web
npm run web
```

## API Configuration

The app automatically configures API endpoints based on environment:

- **Development**: `http://127.0.0.1:8000`
- **Production**: `https://admin.innerlight.community/public`

The environment is detected using `__DEV__` flag.

## Authentication Flow

1. **Public Access**: Login and Forgot Password screens
2. **Member Access**: Home, Appointments, and Profile screens
3. **Automatic Token Management**: Secure token storage and validation
4. **Session Persistence**: Remember login state across app restarts

## Key Features

### Authentication System
- Email/password login with validation
- Forgot password with email reset
- Secure token storage using AsyncStorage
- Automatic session management

### Appointment Management
- View upcoming and past appointments
- Real-time status updates (Confirmed, Pending, Cancelled)
- Appointment details with provider and location info
- Pull-to-refresh functionality

### User Profile
- Personal information display
- Account settings and preferences
- Security and privacy controls
- Sign out functionality

### Reusable Components
- **FormInput**: Customizable input with validation and password toggle
- **CustomButton**: Themed button with loading states and color schemes
- **LoadingScreen**: Consistent loading state across the app
- **ErrorBoundary**: Graceful error handling

## Design System

The app uses a minimalist design approach with:

- **Primary Color**: Indigo (#6366f1)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing system using design tokens
- **Icons**: Lucide icons for consistency
- **Animations**: Subtle transitions and interactions

## Platform-Specific Features

### iOS
- Native iOS navigation animations
- iOS-specific keyboard handling
- Support for tablets

### Android
- Material Design guidelines
- Android-specific navigation patterns
- Adaptive icons

### Web
- Responsive design for desktop/mobile
- Web-optimized interactions
- Progressive Web App support

## Development

### Code Style
- JavaScript (ES6+) - No TypeScript as requested
- Functional components with hooks
- Context for state management
- Modular component architecture

### Best Practices
- Component reusability
- Proper error handling
- Secure API communication
- Performance optimization
- Accessibility considerations

## Deployment

### Expo Go
The app is configured to work with Expo Go for easy testing and development.

### Production Build
```bash
# Build for production
expo build:ios
expo build:android
expo build:web
```

## Contributing

1. Follow the existing code patterns
2. Use the established component structure
3. Maintain the minimalist design principles
4. Test across all platforms
5. Ensure proper error handling

## License

Private project for Innerlight Community members.