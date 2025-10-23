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
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatDetailScreen from '../screens/main/ChatDetailScreen';
import NewChatScreen from '../screens/main/NewChatScreen';
import QuestionnaireListScreen from '../screens/main/QuestionnaireListScreen';
import QuestionnaireDetailScreen from '../screens/main/QuestionnaireDetailScreen';
import QuestionnaireResultScreen from '../screens/main/QuestionnaireResultScreen';
import QuestionnaireHistoryScreen from '../screens/main/QuestionnaireHistoryScreen';
import { theme } from '../constants/theme';
import { useUnreadCount } from '../hooks/useUnreadCount';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  const { unreadCount } = useUnreadCount();

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
          } else if (route.name === 'Chats') {
            iconName = 'MessageCircle';
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
          title: 'Home | Innerlight'
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentScreen}
        options={{
          tabBarLabel: 'Appointments',
          title: 'Appointments | Innerlight'
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Chats',
          title: 'Chats | Innerlight',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 10,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            lineHeight: 18,
          }
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{
          tabBarLabel: 'Forum',
          title: 'Forum | Innerlight'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          title: 'Profile | Innerlight'
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
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Innerlight' }}/>
      <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} options={{ title: 'Appointment Form | Innerlight' }}/>
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} options={{ title: 'Appointment Details | Innerlight' }}/>
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History | Innerlight' }}/>
      <Stack.Screen name="Testimonial" component={TestimonialScreen} options={{ title: 'Testimonial | Innerlight' }}/>
      <Stack.Screen name="DetoxificationTestimonial" component={DetoxificationTestimonialScreen} options={{ title: 'Detoxification Testimonial | Innerlight' }}/>
      <Stack.Screen name="TestimonialDetails" component={TestimonialDetailsScreen} options={{ title: 'Testimonial Details | Innerlight' }}/>
      <Stack.Screen name="DailyQuestions" component={DailyQuestionsScreen} options={{ title: 'Daily Questions | Innerlight' }}/>
      <Stack.Screen name="WebView" component={WebViewScreen} options={{ title: 'WebView | Innerlight' }}/>
      <Stack.Screen name="TopicDetails" component={TopicDetailsScreen} options={{ title: 'Topic Details | Innerlight' }}/>
      <Stack.Screen name="CreateTopic" component={CreateTopicScreen} options={{ title: 'Create Topic | Innerlight' }}/>
      <Stack.Screen name="DownlineChart" component={DownlineChartScreen} options={{ title: 'Downline Chart | Innerlight' }}/>
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard | Innerlight' }}/>
      <Stack.Screen name="NewChat" component={NewChatScreen} options={{ title: 'New Chat | Innerlight' }}/>
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ title: 'Chat | Innerlight' }}/>
      <Stack.Screen name="QuestionnaireList" component={QuestionnaireListScreen} options={{ title: 'Questionnaires | Innerlight' }}/>
      <Stack.Screen name="QuestionnaireDetail" component={QuestionnaireDetailScreen} options={{ title: 'Questionnaire | Innerlight' }}/>
      <Stack.Screen name="QuestionnaireResult" component={QuestionnaireResultScreen} options={{ title: 'Results | Innerlight' }}/>
      <Stack.Screen name="QuestionnaireHistory" component={QuestionnaireHistoryScreen} options={{ title: 'History | Innerlight' }}/>
      <Stack.Screen name="PublicTestimonials" component={PublicTestimonialsScreen} options={{ title: 'Share Your Story | Innerlight' }}/>
    </Stack.Navigator>
  );
};

export default MainStack;