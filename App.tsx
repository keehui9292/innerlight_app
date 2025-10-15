// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { config } from './components/ui/gluestack-ui-provider/config';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthProvider from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import './src/config/firebase'; // Initialize Firebase

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GluestackUIProvider>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </GluestackUIProvider>
    </ErrorBoundary>
  );
};

export default App;