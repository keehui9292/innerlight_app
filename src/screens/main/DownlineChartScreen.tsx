import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

const { width } = Dimensions.get('window');

type ScreenProps = StackScreenProps<any, 'DownlineChart'>;

interface ChartNode {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  team_name: string | null;
  user_group: string | null;
  tier: string | null;
  level: number;
  direct_count: number;
  total_count: number;
  requires_team_name: boolean;
  children: ChartNode[];
}

interface ChartData {
  chart_data: ChartNode | null;
  user_info: {
    id: string;
    name: string;
    referral_code: string;
    team_name: string | null;
    user_group: string | null;
    tier: string | null;
    requires_team_name: boolean;
  };
  stats: {
    direct_count: number;
    total_count: number;
    indirect_count: number;
    max_levels: number;
  };
}

interface LastPerson {
  user: {
    id: string;
    name: string;
    email: string;
    referral_code: string;
    team_name: string | null;
    user_group: string | null;
    tier: string | null;
    requires_team_name: boolean;
  };
  depth: number;
  path: Array<{
    id: string;
    name: string;
  }>;
}

interface AngelBuilder {
  user: {
    id: string;
    name: string;
    email: string;
    referral_code: string;
    team_name: string | null;
    user_group: string | null;
    tier: string | null;
    requires_team_name: boolean;
  };
  level: number;
  upline_path: Array<{
    id: string;
    name: string;
    referral_code: string;
  }>;
}

const DownlineChartScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [lastPersons, setLastPersons] = useState<LastPerson[]>([]);
  const [angelBuilders, setAngelBuilders] = useState<AngelBuilder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'last-persons' | 'angel-builders'>('chart');
  const [levels, setLevels] = useState<number>(4);

  useEffect(() => {
    fetchAllData();
  }, [levels]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchChart(),
        fetchLastPersons(),
        fetchAngelBuilders()
      ]);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      Alert.alert('Error', 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async () => {
    try {
      const response = await ApiService.getUserChart(levels);
      if (response.success) {
        setChartData(response.data);
      }
    } catch (error) {
      console.error('Error fetching chart:', error);
    }
  };

  const fetchLastPersons = async () => {
    try {
      const response = await ApiService.findLastPersons();
      if (response.success) {
        setLastPersons(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching last persons:', error);
    }
  };

  const fetchAngelBuilders = async () => {
    try {
      const response = await ApiService.findAngelBuilders();
      if (response.success) {
        setAngelBuilders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching angel builders:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [levels]);

  const renderChartNode = (node: ChartNode, isRoot: boolean = false) => {
    const getBadgeColor = (userGroup: string | null) => {
      switch (userGroup) {
        case 'Angel Builder':
          return { bg: '#fef3c7', text: '#d97706' };
        case 'Member':
          return { bg: '#dcfce7', text: '#15803d' };
        default:
          return { bg: '#f3f4f6', text: '#6b7280' };
      }
    };

    const badgeColors = getBadgeColor(node.user_group);

    return (
      <View key={node.id} style={styles.chartNodeContainer}>
        <View style={[styles.chartNode, isRoot && styles.rootNode]}>
          <View style={styles.nodeHeader}>
            <View style={styles.nodeAvatar}>
              <Text style={styles.nodeAvatarText}>
                {node.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.nodeInfo}>
              <Text style={styles.nodeName}>{node.name}</Text>
              <Text style={styles.nodeCode}>{node.referral_code}</Text>
              {node.team_name && (
                <Text style={styles.nodeTeam}>{node.team_name}</Text>
              )}
            </View>
          </View>

          <View style={styles.nodeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Direct</Text>
              <Text style={styles.statValue}>{node.direct_count}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{node.total_count}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>{node.level}</Text>
            </View>
          </View>

          {node.user_group && (
            <View style={[styles.userGroupBadge, { backgroundColor: badgeColors.bg }]}>
              <Text style={[styles.userGroupText, { color: badgeColors.text }]}>
                {node.user_group}
              </Text>
            </View>
          )}
        </View>

        {node.children && node.children.length > 0 && (
          <View style={styles.childrenContainer}>
            {node.children.map((child, index) => (
              <View key={child.id} style={styles.childWrapper}>
                {index > 0 && <View style={styles.childSeparator} />}
                {renderChartNode(child)}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderLastPersons = () => {
    if (lastPersons.length === 0) {
      return (
        <View style={styles.emptyState}>
          <WebSafeIcon name="Users" size={48} color={theme.colors.text.muted} />
          <Text style={styles.emptyStateText}>No last persons found</Text>
          <Text style={styles.emptyStateSubtext}>
            This happens when you don't have any downlines yet or all branches have reached maximum depth.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {lastPersons.map((person, index) => (
          <View key={`${person.user.id}-${index}`} style={styles.personCard}>
            <View style={styles.personHeader}>
              <View style={styles.personAvatar}>
                <Text style={styles.personAvatarText}>
                  {person.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{person.user.name}</Text>
                <Text style={styles.personCode}>{person.user.referral_code}</Text>
                <Text style={styles.personDepth}>Depth: {person.depth}</Text>
              </View>
            </View>

            <View style={styles.pathContainer}>
              <Text style={styles.pathLabel}>Path:</Text>
              <Text style={styles.pathText}>
                {person.path.map(p => p.name).join(' → ')}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderAngelBuilders = () => {
    if (angelBuilders.length === 0) {
      return (
        <View style={styles.emptyState}>
          <WebSafeIcon name="Star" size={48} color={theme.colors.text.muted} />
          <Text style={styles.emptyStateText}>No angel builders found</Text>
          <Text style={styles.emptyStateSubtext}>
            No users with "Angel Builder" status were found in your network.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {angelBuilders.map((builder, index) => (
          <View key={`${builder.user.id}-${index}`} style={styles.builderCard}>
            <View style={styles.builderHeader}>
              <View style={styles.builderAvatar}>
                <Text style={styles.builderAvatarText}>
                  {builder.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
              <View style={styles.builderInfo}>
                <Text style={styles.builderName}>{builder.user.name}</Text>
                <Text style={styles.builderCode}>{builder.user.referral_code}</Text>
                <Text style={styles.builderLevel}>Level: {builder.level}</Text>
                {builder.user.team_name && (
                  <Text style={styles.builderTeam}>{builder.user.team_name}</Text>
                )}
              </View>
              <View style={styles.angelBadge}>
                <Text style={styles.angelBadgeText}>Angel Builder</Text>
              </View>
            </View>

            <View style={styles.uplineContainer}>
              <Text style={styles.uplineLabel}>Upline Path:</Text>
              <Text style={styles.uplineText}>
                {builder.upline_path.map(p => p.name).join(' → ')}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Downline Chart</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading chart data...</Text>
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
        <Text style={styles.headerTitle}>Downline Chart</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setLevels(levels === 4 ? 6 : 4)}
            style={styles.levelButton}
          >
            <Text style={styles.levelButtonText}>{levels}L</Text>
          </TouchableOpacity>
        </View>
      </View>

      {chartData && (
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{chartData.stats.direct_count}</Text>
            <Text style={styles.statBoxLabel}>Direct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{chartData.stats.total_count}</Text>
            <Text style={styles.statBoxLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{chartData.stats.indirect_count}</Text>
            <Text style={styles.statBoxLabel}>Indirect</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{chartData.stats.max_levels}</Text>
            <Text style={styles.statBoxLabel}>Max Levels</Text>
          </View>
        </View>
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chart' && styles.activeTab]}
          onPress={() => setActiveTab('chart')}
        >
          <WebSafeIcon
            name="GitBranch"
            size={16}
            color={activeTab === 'chart' ? theme.colors.primary : theme.colors.text.tertiary}
          />
          <Text style={[styles.tabText, activeTab === 'chart' && styles.activeTabText]}>
            Chart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'last-persons' && styles.activeTab]}
          onPress={() => setActiveTab('last-persons')}
        >
          <WebSafeIcon
            name="Users"
            size={16}
            color={activeTab === 'last-persons' ? theme.colors.primary : theme.colors.text.tertiary}
          />
          <Text style={[styles.tabText, activeTab === 'last-persons' && styles.activeTabText]}>
            Last Persons
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'angel-builders' && styles.activeTab]}
          onPress={() => setActiveTab('angel-builders')}
        >
          <WebSafeIcon
            name="Star"
            size={16}
            color={activeTab === 'angel-builders' ? theme.colors.primary : theme.colors.text.tertiary}
          />
          <Text style={[styles.tabText, activeTab === 'angel-builders' && styles.activeTabText]}>
            Angel Builders
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {activeTab === 'chart' && (
            <>
              {chartData?.chart_data ? (
                renderChartNode(chartData.chart_data, true)
              ) : (
                <View style={styles.emptyState}>
                  <WebSafeIcon name="GitBranch" size={48} color={theme.colors.text.muted} />
                  <Text style={styles.emptyStateText}>No chart data available</Text>
                  <Text style={styles.emptyStateSubtext}>
                    You don't have any downlines yet. Start building your network!
                  </Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'last-persons' && renderLastPersons()}
          {activeTab === 'angel-builders' && renderAngelBuilders()}
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
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
  },
  levelButton: {
    backgroundColor: theme.colors.primaryGhost,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  levelButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  statBoxLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
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
  chartNodeContainer: {
    marginBottom: theme.spacing.md,
  },
  chartNode: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
  },
  rootNode: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  nodeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  nodeAvatarText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  nodeCode: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  nodeTeam: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  nodeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  statValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  userGroupBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  userGroupText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
  },
  childrenContainer: {
    marginLeft: theme.spacing.lg,
    paddingLeft: theme.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border.light,
  },
  childWrapper: {
    marginTop: theme.spacing.md,
  },
  childSeparator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.sm,
  },
  listContainer: {
    gap: theme.spacing.md,
  },
  personCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  personAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  personAvatarText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  personCode: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  personDepth: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  pathContainer: {
    marginTop: theme.spacing.xs,
  },
  pathLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
  },
  pathText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  builderCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    ...theme.shadows.soft,
  },
  builderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  builderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  builderAvatarText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  builderInfo: {
    flex: 1,
  },
  builderName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  builderCode: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  builderLevel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  builderTeam: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  angelBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  angelBadgeText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: '#d97706',
  },
  uplineContainer: {
    marginTop: theme.spacing.xs,
  },
  uplineLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
  },
  uplineText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DownlineChartScreen;