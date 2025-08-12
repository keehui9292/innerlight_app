import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, User, Bell } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  color: string;
  bgColor: string;
}

const HomeScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const { user } = useAuth();

  const quickActions: QuickAction[] = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment',
      icon: Calendar,
      onPress: () => navigation.navigate('Appointments'),
      color: '#6366f1',
      bgColor: '#eef2ff'
    },
    {
      title: 'View Schedule',
      description: 'See your upcoming appointments',
      icon: Clock,
      onPress: () => navigation.navigate('Appointments'),
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: User,
      onPress: () => navigation.navigate('Profile'),
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Notifications',
      description: 'View your notifications',
      icon: Bell,
      onPress: () => console.log('Notifications'),
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    }
  ];

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Welcome Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {getGreeting()},
            </Text>
            <Text style={styles.welcomeTitle}>
              {user?.name || 'Welcome'} 👋
            </Text>
            <Text style={styles.subtitle}>
              How can we help you today?
            </Text>
          </View>

          {/* Quick Stats Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.cardTitle}>
              Welcome to Innerlight Community
            </Text>
            <Text style={styles.cardText}>
              Your wellness journey starts here. Book appointments, manage your schedule, and stay connected with our community.
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>
            
            <View style={styles.actionsList}>
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={action.onPress}
                    style={styles.actionCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.actionContent}>
                      <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
                        <IconComponent size={24} color={action.color} />
                      </View>
                      
                      <View style={styles.actionText}>
                        <Text style={styles.actionTitle}>
                          {action.title}
                        </Text>
                        <Text style={styles.actionDescription}>
                          {action.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Recent Activity Section */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>
              Recent Activity
            </Text>
            
            <View style={styles.activityCard}>
              <View style={styles.emptyState}>
                <Calendar size={32} color="#d1d5db" />
                <Text style={styles.emptyTitle}>
                  No recent activity
                </Text>
                <Text style={styles.emptySubtitle}>
                  Your appointments and updates will appear here
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  welcomeCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#312e81',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4338ca',
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
  },
});

export default HomeScreen;