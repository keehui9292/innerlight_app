import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { TabScreenProps } from '../../types';
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

type FilterType = 'all' | 'month' | 'year';

const LeaderboardScreen: React.FC<TabScreenProps<'Leaderboard'>> = ({ navigation }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchLeaderboard();
  }, [filterType, selectedMonth, selectedYear]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  }, [filterType, selectedMonth, selectedYear]);

  const getFilterTitle = () => {
    if (filterType === 'all') return 'All Time';
    if (filterType === 'month') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[selectedMonth - 1]} ${selectedYear}`;
    }
    return `${selectedYear}`;
  };

  const renderPodium = () => {
    if (!leaderboardData || leaderboardData.leaderboard.length === 0) return null;

    const top3 = leaderboardData.leaderboard.slice(0, 3);
    const first = top3.find(u => u.rank === 1);
    const second = top3.find(u => u.rank === 2);
    const third = top3.find(u => u.rank === 3);

    return (
      <View style={styles.podiumContainer}>
        <Text style={styles.topPerformersTitle}>Top Performers</Text>
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

  const renderListItem = (user: LeaderboardUser) => {
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

  const renderCurrentUser = () => {
    if (!leaderboardData?.current_user) return null;

    return (
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
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Merit Leaderboard</Text>
        <View style={styles.backButton} />
      </View>

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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.periodTitle}>{getFilterTitle()}</Text>

          {renderCurrentUser()}

          {renderPodium()}

          {leaderboardData && leaderboardData.leaderboard.length > 3 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Other Rankings</Text>
              {leaderboardData.leaderboard.slice(3).map(renderListItem)}
            </View>
          )}

          {leaderboardData && leaderboardData.leaderboard.length === 0 && (
            <View style={styles.emptyState}>
              <WebSafeIcon name="Trophy" size={48} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No rankings yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to earn merit points!</Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  periodTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: -0.3,
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
  currentUserCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
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
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  topPerformersTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.light,
  },
});

export default LeaderboardScreen;
