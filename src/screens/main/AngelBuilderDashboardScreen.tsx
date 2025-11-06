import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface LeaderboardUser {
  rank: number;
  user_id: string;
  user_name: string;
  user_email: string;
  member_id: string;
  total_points: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  current_user: {
    rank: number;
    total_points: number;
  };
  filter: {
    month?: number;
    year?: number;
  };
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

type FilterType = 'all' | 'month' | 'year';

const AngelBuilderDashboardScreen: React.FC<any> = ({ navigation }) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardStats();
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [filterType, selectedMonth, selectedYear]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getDashboardStats();

      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      let params: { month?: number; year?: number } = {};

      if (filterType === 'month') {
        params.month = selectedMonth;
        params.year = selectedYear;
      } else if (filterType === 'year') {
        params.year = selectedYear;
      }

      const response = await ApiService.getMeritsLeaderboard(params);

      if (response.success && response.data) {
        setLeaderboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardStats(), fetchLeaderboard()]);
    setRefreshing(false);
  }, [filterType, selectedMonth, selectedYear]);

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    const color = isPositive ? theme.colors.success : theme.colors.error;
    const icon = isPositive ? 'TrendingUp' : 'TrendingDown';
    return { color, icon, isPositive };
  };

  const renderPodium = () => {
    if (!leaderboardData || leaderboardData.leaderboard.length === 0) return null;

    const top3 = leaderboardData.leaderboard.slice(0, 3);
    const first = top3.find(u => u.rank === 1);
    const second = top3.find(u => u.rank === 2);
    const third = top3.find(u => u.rank === 3);

    return (
      <View style={styles.podiumContainer}>
        <View style={styles.podiumRow}>
          {/* Second Place - Left */}
          {second && (
            <View style={styles.podiumItemContainer}>
              <View style={styles.rankBadgeTop}>
                <Text style={styles.rankBadgeText}>2</Text>
              </View>
              <View style={[styles.podiumCard, styles.podiumCardSecond]}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarSecond]}>
                  <Text style={styles.podiumAvatarText}>
                    {second.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{second.user_name}</Text>
                <View style={styles.podiumPointsContainer}>
                  <Text style={styles.podiumPoints}>{second.total_points}</Text>
                  <Text style={styles.podiumPointsLabel}>points</Text>
                </View>
              </View>
            </View>
          )}

          {/* First Place - Middle (Biggest) */}
          {first && (
            <View style={styles.podiumItemContainer}>
              <View style={[styles.rankBadgeTop, styles.rankBadgeTopFirst]}>
                <WebSafeIcon name="Trophy" size={16} color={theme.colors.white} />
              </View>
              <View style={[styles.podiumCard, styles.podiumCardFirst]}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarFirst]}>
                  <Text style={[styles.podiumAvatarText, styles.podiumAvatarTextFirst]}>
                    {first.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.podiumName, styles.podiumNameFirst]} numberOfLines={1}>
                  {first.user_name}
                </Text>
                <View style={styles.podiumPointsContainer}>
                  <Text style={[styles.podiumPoints, styles.podiumPointsFirst]}>
                    {first.total_points}
                  </Text>
                  <Text style={styles.podiumPointsLabel}>points</Text>
                </View>
              </View>
            </View>
          )}

          {/* Third Place - Right */}
          {third && (
            <View style={styles.podiumItemContainer}>
              <View style={styles.rankBadgeTop}>
                <Text style={styles.rankBadgeText}>3</Text>
              </View>
              <View style={[styles.podiumCard, styles.podiumCardThird]}>
                <View style={[styles.podiumAvatar, styles.podiumAvatarThird]}>
                  <Text style={styles.podiumAvatarText}>
                    {third.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.podiumName} numberOfLines={1}>{third.user_name}</Text>
                <View style={styles.podiumPointsContainer}>
                  <Text style={styles.podiumPoints}>{third.total_points}</Text>
                  <Text style={styles.podiumPointsLabel}>points</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLeaderboardListItem = (user: LeaderboardUser) => {
    return (
      <View key={user.user_id} style={styles.listItem}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{user.rank}</Text>
        </View>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {user.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.user_name}</Text>
          <Text style={styles.userMemberId}>ID: {user.member_id}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{user.total_points}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <WebSafeIcon name="ChevronLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Angel Builder Dashboard</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dashboardStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <WebSafeIcon name="ChevronLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Angel Builder Dashboard</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyContainer}>
          <WebSafeIcon name="AlertCircle" size={48} color={theme.colors.text.light} />
          <Text style={styles.emptyTitle}>No Data Available</Text>
          <Text style={styles.emptySubtitle}>Unable to load dashboard statistics</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { network_stats, growth_stats, course_stats } = dashboardStats;
  const growthInfo = formatGrowthRate(growth_stats.growth_rate);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <WebSafeIcon name="ChevronLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Angel Builder Dashboard</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
          {/* Network Statistics Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network Overview</Text>
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
          </View>

          {/* Course Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Progress</Text>
            <View style={styles.courseProgressCard}>
              <View style={styles.courseProgressHeader}>
                <View style={styles.courseIconContainer}>
                  <WebSafeIcon name="BookOpen" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.courseProgressInfo}>
                  <Text style={styles.courseProgressTitle}>Overall Progress</Text>
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
          </View>

          {/* Recent Activity */}
          {dashboardStats.recent_activities.recent_referrals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Referrals</Text>
                <TouchableOpacity onPress={() => navigation.navigate('DownlineChart')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.recentActivityCard}>
                {dashboardStats.recent_activities.recent_referrals.slice(0, 5).map((referral) => (
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
            </View>
          )}

          {/* Angel Builder Advanced Metrics */}
          {dashboardStats.angel_builder_metrics && dashboardStats.angel_builder_metrics.is_angel_builder && (
            <>
              {/* Performance Summary */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Performance Summary</Text>
                <View style={styles.performanceSummaryCard}>
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
              </View>

              {/* Downline Course Attendance */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Downline Course Attendance
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {dashboardStats.angel_builder_metrics.course_attendance.summary.total_downlines} total users
                </Text>

                <View style={styles.courseAttendanceCard}>
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
              </View>

              {/* Testimonial Metrics */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Testimonial Overview</Text>
                <View style={styles.testimonialMetricsCard}>
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
                    <Text style={styles.testimonialStatusTitle}>Status Breakdown</Text>
                    <View style={styles.testimonialStatusItems}>
                      <View style={styles.testimonialStatusItem}>
                        <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                        <Text style={styles.testimonialStatusText}>
                          Approved: {dashboardStats.angel_builder_metrics.testimonial_metrics.status_breakdown.approved}
                        </Text>
                      </View>
                      <View style={styles.testimonialStatusItem}>
                        <View style={[styles.statusDot, { backgroundColor: theme.colors.warning }]} />
                        <Text style={styles.testimonialStatusText}>
                          Submitted: {dashboardStats.angel_builder_metrics.testimonial_metrics.status_breakdown.submitted}
                        </Text>
                      </View>
                      <View style={styles.testimonialStatusItem}>
                        <View style={[styles.statusDot, { backgroundColor: theme.colors.text.tertiary }]} />
                        <Text style={styles.testimonialStatusText}>
                          Draft: {dashboardStats.angel_builder_metrics.testimonial_metrics.status_breakdown.draft}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Merit Leaderboard Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Merit Leaderboard</Text>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
                onPress={() => setFilterType('all')}
              >
                <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>
                  All Time
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filterType === 'month' && styles.filterButtonActive]}
                onPress={() => setFilterType('month')}
              >
                <Text style={[styles.filterButtonText, filterType === 'month' && styles.filterButtonTextActive]}>
                  This Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filterType === 'year' && styles.filterButtonActive]}
                onPress={() => setFilterType('year')}
              >
                <Text style={[styles.filterButtonText, filterType === 'year' && styles.filterButtonTextActive]}>
                  This Year
                </Text>
              </TouchableOpacity>
            </View>

            {/* Current User Ranking */}
            {leaderboardData?.current_user && (
              <View style={styles.currentUserCard}>
                <View style={styles.currentUserHeader}>
                  <WebSafeIcon name="User" size={16} color={theme.colors.primary} />
                  <Text style={styles.currentUserTitle}>Your Ranking</Text>
                </View>
                <View style={styles.currentUserStats}>
                  <View style={styles.currentUserStat}>
                    <Text style={styles.currentUserStatLabel}>Rank</Text>
                    <Text style={styles.currentUserStatValue}>#{leaderboardData.current_user.rank}</Text>
                  </View>
                  <View style={styles.currentUserDivider} />
                  <View style={styles.currentUserStat}>
                    <Text style={styles.currentUserStatLabel}>Points</Text>
                    <Text style={styles.currentUserStatValue}>{leaderboardData.current_user.total_points}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Podium */}
            {renderPodium()}

            {/* Other Rankings */}
            {leaderboardData && leaderboardData.leaderboard.length > 3 && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Other Rankings</Text>
                {leaderboardData.leaderboard.slice(3, 8).map(renderLeaderboardListItem)}
              </View>
            )}

            {/* Empty State */}
            {leaderboardData && leaderboardData.leaderboard.length === 0 && (
              <View style={styles.emptyLeaderboard}>
                <WebSafeIcon name="Trophy" size={48} color={theme.colors.text.light} />
                <Text style={styles.emptyLeaderboardTitle}>No rankings yet</Text>
                <Text style={styles.emptyLeaderboardSubtitle}>Be the first to earn merit points!</Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('DownlineChart')}
              activeOpacity={0.8}
            >
              <WebSafeIcon name="GitBranch" size={18} color={theme.colors.white} />
              <Text style={styles.actionButtonText}>View Network Chart</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' && { height: '100vh' as any, overflow: 'hidden' }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    height: 70,
    zIndex: 10,
    flexShrink: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 70, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  viewAllText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
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
    minHeight: 100,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  courseProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  courseIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  recentActivityCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  recentActivityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  recentActivityAvatarText: {
    fontSize: theme.typography.sizes.sm,
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
  performanceSummaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
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
  courseAttendanceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
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
    minWidth: 70,
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
  testimonialMetricsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
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
    gap: theme.spacing.sm,
  },
  testimonialStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  testimonialStatusText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  actionButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
    marginLeft: theme.spacing.sm,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.medium,
  },
  filterButtonTextActive: {
    color: theme.colors.white,
  },
  currentUserCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  currentUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  currentUserTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  currentUserStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserStat: {
    flex: 1,
    alignItems: 'center',
  },
  currentUserStatLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  currentUserStatValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  currentUserDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border.light,
  },
  podiumContainer: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  podiumItemContainer: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 110,
  },
  rankBadgeTop: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    ...theme.shadows.soft,
  },
  rankBadgeTopFirst: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  rankBadgeText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  podiumCard: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.soft,
  },
  podiumCardFirst: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    ...theme.shadows.medium,
    minHeight: 140,
  },
  podiumCardSecond: {
    minHeight: 130,
  },
  podiumCardThird: {
    minHeight: 130,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  podiumAvatarFirst: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
  },
  podiumAvatarSecond: {
    backgroundColor: theme.colors.primaryLight,
  },
  podiumAvatarThird: {
    backgroundColor: theme.colors.primaryLight,
  },
  podiumAvatarText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  podiumAvatarTextFirst: {
    fontSize: theme.typography.sizes.lg,
  },
  podiumName: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  podiumNameFirst: {
    fontSize: theme.typography.sizes.sm,
  },
  podiumPointsContainer: {
    alignItems: 'center',
  },
  podiumPoints: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  podiumPointsFirst: {
    fontSize: theme.typography.sizes.xl,
  },
  podiumPointsLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  listContainer: {
    marginTop: theme.spacing.md,
  },
  listTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  rankText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  userAvatarText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  userMemberId: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  pointsLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  emptyLeaderboard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyLeaderboardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyLeaderboardSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.light,
  },
});

export default AngelBuilderDashboardScreen;
