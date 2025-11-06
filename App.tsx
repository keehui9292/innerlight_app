// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { config } from './components/ui/gluestack-ui-provider/config';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import AuthProvider from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import './src/config/firebase'; // Initialize Firebase

const linking = {
  prefixes: ['https://app.innerlight.community', 'innerlight://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      Main: {
        screens: {
          PaymentVerification: {
            path: 'payment-verify',
            parse: {
              session_id: (sessionId: string) => sessionId,
              appointment_id: (appointmentId: string) => appointmentId,
            },
          },
          MainTabs: {
            path: '',
            screens: {
              Home: 'home',
              Appointments: 'appointments',
              Events: 'events',
              Chats: 'chats',
              Forum: 'forum',
              Profile: 'profile',
            },
          },
        },
      },
    },
  },
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GluestackUIProvider>
        <AuthProvider>
          <NavigationContainer linking={linking}>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </GluestackUIProvider>
    </ErrorBoundary>
  );
};

export default App;