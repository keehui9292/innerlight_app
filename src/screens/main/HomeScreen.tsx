import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
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
      icon: 'Calendar',
      onPress: () => navigation.navigate('Appointments'),
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
    },
    {
      title: 'View Schedule',
      description: 'See your upcoming appointments',
      icon: 'Clock',
      onPress: () => navigation.navigate('Appointments'),
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: 'User',
      onPress: () => navigation.navigate('Profile'),
      color: theme.colors.primary,
      bgColor: '#f5f3f1'
    },
    {
      title: 'Notifications',
      description: 'View your notifications',
      icon: 'Bell',
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
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>
                {getGreeting()}
              </Text>
              <Text style={styles.userName}>
                {user?.name || 'Welcome'}
              </Text>
            </View>
            
            <View style={styles.heroCard}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Your Wellness Journey
                </Text>
                <Text style={styles.heroSubtitle}>
                  Transform your life with personalized care and community support
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>
            
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={action.onPress}
                    style={styles.actionCard}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actionIconContainer}>
                      <WebSafeIcon name={action.icon} size={18} color={theme.colors.primary} />
                    </View>
                    
                    <Text style={styles.actionTitle}>
                      {action.title}
                    </Text>
                    <Text style={styles.actionDescription}>
                      {action.description}
                    </Text>
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
                <WebSafeIcon name="Calendar" size={32} color={theme.colors.text.light} />
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  heroSection: {
    marginBottom: theme.spacing.xl,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.1,
  },
  userName: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    ...theme.shadows.elegant,
    marginHorizontal: theme.spacing.xs,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.sm,
  },
  actionsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
    alignItems: 'center',
    width: '48%',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  actionDescription: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 14,
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