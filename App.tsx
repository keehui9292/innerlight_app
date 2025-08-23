// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { config } from './gluestack-ui.config.json'; 
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthProvider from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GluestackUIProvider config={config}>
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