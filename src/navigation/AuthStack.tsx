import { createStackNavigator } from '@react-navigation/stack';
import GetStartedScreen from '../screens/auth/GetStartedScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import RequestOTPScreen from '../screens/auth/RequestOTPScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';
import { theme } from '../constants/theme';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      initialRouteName="GetStarted"
    >
      <Stack.Screen
        name="GetStarted"
        component={GetStartedScreen}
        options={{ title: 'Get Started | Innerlight' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login | Innerlight' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Forgot Password | Innerlight',
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="RequestOTP"
        component={RequestOTPScreen}
        options={{
          title: 'Request OTP | Innerlight',
          gestureDirection: 'horizontal',
        }}
      />
      <Stack.Screen
        name="VerifyOTP"
        component={VerifyOTPScreen}
        options={{
          title: 'Verify OTP | Innerlight',
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;