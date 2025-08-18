import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, User, Bell } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';

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
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
    },
    {
      title: 'View Schedule',
      description: 'See your upcoming appointments',
      icon: Clock,
      onPress: () => navigation.navigate('Appointments'),
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: User,
      onPress: () => navigation.navigate('Profile'),
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
    },
    {
      title: 'Notifications',
      description: 'View your notifications',
      icon: Bell,
      onPress: () => console.log('Notifications'),
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
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
                <Calendar size={32} color={theme.colors.text.light} />
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
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  welcomeTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  welcomeCard: {
    backgroundColor: '#f9f8f7',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  actionsList: {
    gap: theme.spacing.md,
  },
  actionCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.light,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  activitySection: {
    marginBottom: theme.spacing.lg,
  },
  activityCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.light,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
});

export default HomeScreen;