import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  color: string;
  bgColor: string;
}

interface DashboardStats {
  user_info: {
    name: string;
    email: string;
    referral_code: string;
    team_name: string | null;
    user_group: string | null;
    tier: string | null;
    joined_date: string;
    avatar_url: string | null;
  };
  network_stats: {
    direct_referrals: number;
    total_network: number;
    indirect_referrals: number;
    network_depth: number;
    angel_builders_count: number;
    last_persons_count: number;
  };
  growth_stats: {
    this_month_referrals: number;
    this_week_referrals: number;
    last_month_referrals: number;
    growth_rate: number;
  };
  course_stats: {
    completed_courses: number;
    total_courses: number;
    completion_rate: number;
    courses: {
      metahealers: {
        status: string;
        is_expired: boolean;
        expiry_date: string | null;
      };
      john_course: {
        status: string;
        is_expired: boolean;
        expiry_date: string | null;
      };
      naha_intro: {
        status: string;
        is_expired: boolean;
        expiry_date: string | null;
      };
    };
  };
  recent_activities: {
    recent_referrals: Array<{
      id: string;
      name: string;
      email: string;
      user_group: string | null;
      tier: string | null;
      joined_date: string;
      referral_code: string;
      team_name: string | null;
    }>;
    total_shown: number;
  };
  angel_builder_metrics?: {
    is_angel_builder: boolean;
    total_downlines_analyzed: number;
    conversion_rates: {
      direct_to_total_ratio: number;
      network_depth: number;
      by_level: {
        [key: string]: {
          count: number;
          percentage_of_network: number;
        };
      };
      best_performing_level: string;
      monthly_conversion_trend: {
        this_month_new: number;
        last_month_new: number;
      };
    };
    course_attendance: {
      metahealers: {
        active_count: number;
        percentage: number;
      };
      john_course: {
        active_count: number;
        percentage: number;
      };
      naha_intro: {
        active_count: number;
        percentage: number;
      };
      summary: {
        total_downlines: number;
        with_any_course: number;
        course_adoption_rate: number;
        most_popular_course: string;
      };
    };
    testimonial_metrics: {
      total_testimonials: number;
      testimonial_participation_rate: number;
      status_breakdown: {
        draft: number;
        submitted: number;
        approved: number;
        rejected: number;
      };
      recent_activity: {
        last_30_days: number;
        monthly_rate: number;
      };
      completion_rate: number;
      quality_metrics: {
        approval_rate: number;
        rejection_rate: number;
      };
    };
    performance_summary: {
      top_conversion_source: string;
      most_active_course: string;
      testimonial_completion_rate: number;
    };
  };
}

const HomeScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Check if user is Angel Builder
  const isAngelBuilder = user?.user_group?.name === 'Angel Builder';

  // Debug logging
  useEffect(() => {
    console.log('HomeScreen - User data:', JSON.stringify(user, null, 2));
    console.log('HomeScreen - User group name:', user?.user_group?.name);
    console.log('HomeScreen - Is Angel Builder:', isAngelBuilder);
  }, [user, isAngelBuilder]);

  useEffect(() => {
    if (isAngelBuilder) {
      console.log('HomeScreen - Fetching dashboard stats for Angel Builder');
      fetchDashboardStats();
    } else {
      console.log('HomeScreen - User is not Angel Builder, skipping dashboard stats');
    }
  }, [isAngelBuilder]);

  const fetchDashboardStats = async () => {
    try {
      console.log('HomeScreen - Starting dashboard stats fetch...');
      setLoadingStats(true);
      const response = await ApiService.getDashboardStats();

      console.log('HomeScreen - Dashboard stats response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        console.log('HomeScreen - Setting dashboard stats:', response.data);
        setDashboardStats(response.data);
      } else {
        console.log('HomeScreen - Dashboard stats fetch failed or no data:', response);
      }
    } catch (error) {
      console.error('HomeScreen - Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (isAngelBuilder) {
      await fetchDashboardStats();
    }
    setRefreshing(false);
  }, [isAngelBuilder]);

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

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    const color = isPositive ? theme.colors.success : theme.colors.error;
    const icon = isPositive ? 'TrendingUp' : 'TrendingDown';
    return { color, icon, isPositive };
  };

  const renderDashboardStats = () => {
    console.log('HomeScreen - renderDashboardStats called');
    console.log('HomeScreen - isAngelBuilder:', isAngelBuilder);
    console.log('HomeScreen - dashboardStats:', dashboardStats);


    if (!isAngelBuilder) {
      console.log('HomeScreen - Not rendering stats: user is not Angel Builder');
      return null;
    }

    if (!dashboardStats) {
      console.log('HomeScreen - Not rendering stats: no dashboard data available');
      // Show loading state
      return (
        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>Network Dashboard</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <WebSafeIcon name="Users" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.statValue}>...</Text>
              <Text style={styles.statLabel}>Loading</Text>
            </View>
          </View>
        </View>
      );
    }

    console.log('HomeScreen - Rendering dashboard stats...');

    const { network_stats, growth_stats, course_stats } = dashboardStats;
    const growthInfo = formatGrowthRate(growth_stats.growth_rate);

    return (
      <View style={styles.dashboardSection}>
        <Text style={styles.sectionTitle}>Network Dashboard</Text>

        {/* Network Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <WebSafeIcon name="Users" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{network_stats.total_network}</Text>
            <Text style={styles.statLabel}>Total Network</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <WebSafeIcon name="UserPlus" size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.statValue}>{network_stats.direct_referrals}</Text>
            <Text style={styles.statLabel}>Direct Referrals</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: growthInfo.isPositive ? '#dcfce7' : '#fecaca' }]}>
              <WebSafeIcon name={growthInfo.icon} size={20} color={growthInfo.color} />
            </View>
            <Text style={[styles.statValue, { color: growthInfo.color }]}>
              {growth_stats.growth_rate.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>Growth Rate</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <WebSafeIcon name="Award" size={20} color={theme.colors.warning} />
            </View>
            <Text style={styles.statValue}>{network_stats.angel_builders_count}</Text>
            <Text style={styles.statLabel}>Angel Builders</Text>
          </View>
        </View>

        {/* Course Progress */}
        <View style={styles.courseProgressCard}>
          <View style={styles.courseProgressHeader}>
            <View style={styles.courseIconContainer}>
              <WebSafeIcon name="BookOpen" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.courseProgressInfo}>
              <Text style={styles.courseProgressTitle}>Course Progress</Text>
              <Text style={styles.courseProgressSubtitle}>
                {course_stats.completed_courses} of {course_stats.total_courses} completed
              </Text>
            </View>
            <Text style={styles.courseProgressPercentage}>
              {course_stats.completion_rate.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${course_stats.completion_rate}%` }
              ]}
            />
          </View>
        </View>

        {/* Recent Activity */}
        {dashboardStats.recent_activities.recent_referrals.length > 0 && (
          <View style={styles.recentActivityCard}>
            <View style={styles.recentActivityHeader}>
              <WebSafeIcon name="Activity" size={18} color={theme.colors.primary} />
              <Text style={styles.recentActivityTitle}>Recent Referrals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('DownlineChart')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {dashboardStats.recent_activities.recent_referrals.slice(0, 3).map((referral, index) => (
              <View key={referral.id} style={styles.recentActivityItem}>
                <View style={styles.recentActivityAvatar}>
                  <Text style={styles.recentActivityAvatarText}>
                    {referral.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <View style={styles.recentActivityInfo}>
                  <Text style={styles.recentActivityName}>{referral.name}</Text>
                  <Text style={styles.recentActivityDetail}>
                    {referral.user_group || 'Member'} • {new Date(referral.joined_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Angel Builder Advanced Metrics */}
        {dashboardStats.angel_builder_metrics && dashboardStats.angel_builder_metrics.is_angel_builder && (
          <>
            {/* Performance Summary */}
            <View style={styles.performanceSummaryCard}>
              <View style={styles.performanceHeader}>
                <WebSafeIcon name="TrendingUp" size={18} color={theme.colors.primary} />
                <Text style={styles.performanceTitle}>Performance Summary</Text>
              </View>

              <View style={styles.performanceGrid}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Top Level</Text>
                  <Text style={styles.performanceValue}>
                    {dashboardStats.angel_builder_metrics.performance_summary.top_conversion_source}
                  </Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Best Course</Text>
                  <Text style={styles.performanceValue}>
                    {dashboardStats.angel_builder_metrics.performance_summary.most_active_course}
                  </Text>
                </View>
              </View>
            </View>

            {/* Downline Course Attendance */}
            <View style={styles.courseAttendanceCard}>
              <View style={styles.courseAttendanceHeader}>
                <WebSafeIcon name="BookOpen" size={18} color={theme.colors.primary} />
                <Text style={styles.courseAttendanceTitle}>
                  Downline Course Attendance ({dashboardStats.angel_builder_metrics.course_attendance.summary.total_downlines} users)
                </Text>
              </View>

              <View style={styles.courseAttendanceList}>
                <View style={styles.courseAttendanceItem}>
                  <Text style={styles.courseName}>Metahealers</Text>
                  <View style={styles.courseProgressContainer}>
                    <View style={styles.courseProgressBar}>
                      <View style={[
                        styles.courseProgressFill,
                        {
                          width: `${dashboardStats.angel_builder_metrics.course_attendance.metahealers.percentage}%`,
                          backgroundColor: '#10b981'
                        }
                      ]} />
                    </View>
                    <Text style={styles.courseProgressText}>
                      {dashboardStats.angel_builder_metrics.course_attendance.metahealers.active_count} ({dashboardStats.angel_builder_metrics.course_attendance.metahealers.percentage.toFixed(1)}%)
                    </Text>
                  </View>
                </View>

                <View style={styles.courseAttendanceItem}>
                  <Text style={styles.courseName}>John Course</Text>
                  <View style={styles.courseProgressContainer}>
                    <View style={styles.courseProgressBar}>
                      <View style={[
                        styles.courseProgressFill,
                        {
                          width: `${dashboardStats.angel_builder_metrics.course_attendance.john_course.percentage}%`,
                          backgroundColor: '#3b82f6'
                        }
                      ]} />
                    </View>
                    <Text style={styles.courseProgressText}>
                      {dashboardStats.angel_builder_metrics.course_attendance.john_course.active_count} ({dashboardStats.angel_builder_metrics.course_attendance.john_course.percentage.toFixed(1)}%)
                    </Text>
                  </View>
                </View>

                <View style={styles.courseAttendanceItem}>
                  <Text style={styles.courseName}>NAHA Intro</Text>
                  <View style={styles.courseProgressContainer}>
                    <View style={styles.courseProgressBar}>
                      <View style={[
                        styles.courseProgressFill,
                        {
                          width: `${dashboardStats.angel_builder_metrics.course_attendance.naha_intro.percentage}%`,
                          backgroundColor: '#8b5cf6'
                        }
                      ]} />
                    </View>
                    <Text style={styles.courseProgressText}>
                      {dashboardStats.angel_builder_metrics.course_attendance.naha_intro.active_count} ({dashboardStats.angel_builder_metrics.course_attendance.naha_intro.percentage.toFixed(1)}%)
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.courseAdoptionSummary}>
                <Text style={styles.courseAdoptionText}>
                  Overall Adoption: {dashboardStats.angel_builder_metrics.course_attendance.summary.course_adoption_rate.toFixed(1)}% •
                  Most Popular: {dashboardStats.angel_builder_metrics.course_attendance.summary.most_popular_course}
                </Text>
              </View>
            </View>

            {/* Testimonial Metrics */}
            <View style={styles.testimonialMetricsCard}>
              <View style={styles.testimonialHeader}>
                <WebSafeIcon name="Star" size={18} color={theme.colors.primary} />
                <Text style={styles.testimonialTitle}>Testimonial Overview</Text>
              </View>

              <View style={styles.testimonialStatsGrid}>
                <View style={styles.testimonialStatItem}>
                  <Text style={styles.testimonialStatValue}>
                    {dashboardStats.angel_builder_metrics.testimonial_metrics.testimonial_participation_rate.toFixed(1)}%
                  </Text>
                  <Text style={styles.testimonialStatLabel}>Participation</Text>
                </View>
                <View style={styles.testimonialStatItem}>
                  <Text style={styles.testimonialStatValue}>
                    {dashboardStats.angel_builder_metrics.testimonial_metrics.quality_metrics.approval_rate.toFixed(1)}%
                  </Text>
                  <Text style={styles.testimonialStatLabel}>Approval Rate</Text>
                </View>
                <View style={styles.testimonialStatItem}>
                  <Text style={styles.testimonialStatValue}>
                    {dashboardStats.angel_builder_metrics.testimonial_metrics.recent_activity.last_30_days}
                  </Text>
                  <Text style={styles.testimonialStatLabel}>Recent (30d)</Text>
                </View>
              </View>

              <View style={styles.testimonialStatusBreakdown}>
                <Text style={styles.testimonialStatusTitle}>Status Breakdown:</Text>
                <View style={styles.testimonialStatusItems}>
                  <Text style={styles.testimonialStatusItem}>
                    Approved: {dashboardStats.angel_builder_metrics.testimonial_metrics.status_breakdown.approved}
                  </Text>
                  <Text style={styles.testimonialStatusItem}>
                    Submitted: {dashboardStats.angel_builder_metrics.testimonial_metrics.status_breakdown.submitted}
                  </Text>
                  <Text style={styles.testimonialStatusItem}>
                    Draft: {dashboardStats.angel_builder_metrics.testimonial_metrics.status_breakdown.draft}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Quick Actions for Angel Builders */}
        <View style={styles.angelBuilderActions}>
          <TouchableOpacity
            style={styles.angelActionButton}
            onPress={() => navigation.navigate('DownlineChart')}
            activeOpacity={0.8}
          >
            <WebSafeIcon name="GitBranch" size={16} color={theme.colors.white} />
            <Text style={styles.angelActionText}>View Network Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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

          {/* Dashboard Statistics - Only for Angel Builder users */}
          {renderDashboardStats()}

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

  // Dashboard Statistics Styles
  dashboardSection: {
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
    alignItems: 'center',
    width: '48%',
    minHeight: 90,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  courseProgressCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
    marginBottom: theme.spacing.md,
  },
  courseProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  courseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  courseProgressInfo: {
    flex: 1,
  },
  courseProgressTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  courseProgressSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  courseProgressPercentage: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  recentActivityCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
    marginBottom: theme.spacing.md,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  recentActivityTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  recentActivityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  recentActivityAvatarText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  recentActivityInfo: {
    flex: 1,
  },
  recentActivityName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  recentActivityDetail: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  angelBuilderActions: {
    marginTop: theme.spacing.sm,
  },
  angelActionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  angelActionText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },

  // Angel Builder Advanced Metrics Styles
  performanceSummaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
    marginBottom: theme.spacing.md,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  performanceTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  performanceLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  performanceValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Course Attendance Styles
  courseAttendanceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
    marginBottom: theme.spacing.md,
  },
  courseAttendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  courseAttendanceTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  courseAttendanceList: {
    marginBottom: theme.spacing.md,
  },
  courseAttendanceItem: {
    marginBottom: theme.spacing.md,
  },
  courseName: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  courseProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  courseProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  courseProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  courseProgressText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    minWidth: 60,
  },
  courseAdoptionSummary: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  courseAdoptionText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Testimonial Metrics Styles
  testimonialMetricsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
    marginBottom: theme.spacing.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  testimonialTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  testimonialStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  testimonialStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  testimonialStatValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  testimonialStatLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  testimonialStatusBreakdown: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  testimonialStatusTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  testimonialStatusItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  testimonialStatusItem: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
  },
});

export default HomeScreen;