import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, User, MessageSquare } from 'lucide-react-native';
import HomeScreen from '../screens/main/HomeScreen';
import AppointmentScreen from '../screens/main/AppointmentScreen';
import AppointmentFormScreen from '../screens/main/AppointmentFormScreen';
import AppointmentDetailsScreen from '../screens/main/AppointmentDetailsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import PaymentHistoryScreen from '../screens/main/PaymentHistoryScreen';
import TestimonialScreen from '../screens/main/TestimonialScreen';
import DetoxificationTestimonialScreen from '../screens/main/DetoxificationTestimonialScreen';
import { theme } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          height: 80,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          ...theme.shadows.light,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: theme.typography.weights.medium,
          marginTop: 5
        },
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent: any;

          if (route.name === 'Home') {
            IconComponent = Home;
          } else if (route.name === 'Appointments') {
            IconComponent = Calendar;
          } else if (route.name === 'Testimonials') {
            IconComponent = MessageSquare;
          } else if (route.name === 'Profile') {
            IconComponent = User;
          }

          return <IconComponent color={color} size={focused ? size + 2 : size} />;
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentScreen}
        options={{
          tabBarLabel: 'Appointments',
        }}
      />
      <Tab.Screen 
        name="Testimonials" 
        component={TestimonialScreen}
        options={{
          tabBarLabel: 'Testimonials',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Testimonial" component={TestimonialScreen} />
      <Stack.Screen name="DetoxificationTestimonial" component={DetoxificationTestimonialScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;