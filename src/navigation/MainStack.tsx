import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WebSafeIcon from '../components/common/WebSafeIcon';
import HomeScreen from '../screens/main/HomeScreen';
import AppointmentScreen from '../screens/main/AppointmentScreen';
import AppointmentFormScreen from '../screens/main/AppointmentFormScreen';
import AppointmentDetailsScreen from '../screens/main/AppointmentDetailsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import PaymentHistoryScreen from '../screens/main/PaymentHistoryScreen';
import TestimonialScreen from '../screens/main/TestimonialScreen';
import PublicTestimonialsScreen from '../screens/main/PublicTestimonialsScreen';
import DetoxificationTestimonialScreen from '../screens/main/DetoxificationTestimonialScreen';
import TestimonialDetailsScreen from '../screens/main/TestimonialDetailsScreen';
import DailyQuestionsScreen from '../screens/main/DailyQuestionsScreen';
import WebViewScreen from '../screens/main/WebViewScreen';
import ForumScreen from '../screens/main/ForumScreen';
import TopicDetailsScreen from '../screens/main/TopicDetailsScreen';
import CreateTopicScreen from '../screens/main/CreateTopicScreen';
import DownlineChartScreen from '../screens/main/DownlineChartScreen';
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
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'Home';
          } else if (route.name === 'Appointments') {
            iconName = 'Calendar';
          } else if (route.name === 'Forum') {
            iconName = 'MessageSquare';
          } else if (route.name === 'Testimonials') {
            iconName = 'FileText';
          } else if (route.name === 'Profile') {
            iconName = 'User';
          } else {
            iconName = 'Home';
          }

          return <WebSafeIcon name={iconName} color={color} size={focused ? size + 2 : size} />;
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
        name="Forum" 
        component={ForumScreen}
        options={{
          tabBarLabel: 'Forum',
        }}
      />
      <Tab.Screen
        name="Testimonials"
        component={PublicTestimonialsScreen}
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
      <Stack.Screen name="TestimonialDetails" component={TestimonialDetailsScreen} />
      <Stack.Screen name="DailyQuestions" component={DailyQuestionsScreen} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="TopicDetails" component={TopicDetailsScreen} />
      <Stack.Screen name="CreateTopic" component={CreateTopicScreen} />
      <Stack.Screen name="DownlineChart" component={DownlineChartScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;