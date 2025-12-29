import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ServicesHomeScreen from '../screens/main/ServicesHomeScreen';
import MainStack from './MainStack';
import { theme } from '../constants/theme';

const Stack = createStackNavigator();

const ServicesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen
        name="ServicesHome"
        component={ServicesHomeScreen}
        options={{ title: 'Services' }}
      />
      <Stack.Screen
        name="MainStack"
        component={MainStack}
        options={{ title: 'Main' }}
      />
    </Stack.Navigator>
  );
};

export default ServicesStack;
