import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface ChartData {
  labels: string[];
  values: number[];
  percentages: number[];
}

interface Response {
  id: string;
  questionnaire: {
    id: string;
    title: string;
    description: string;
    frequency: string;
  };
  period: string;
  period_year: number;
  period_month: number | null;
  total_body_points: number;
  total_mind_points: number;
  total_spirit_points: number;
  total_points: number;
  dominant_category: string;
  chart_data: ChartData;
  completed_at: string;
}

interface QuestionnaireHistoryScreenProps {
  navigation: any;
  route: {
    params: {
      questionnaireId?: string;
    };
  };
}

const QuestionnaireHistoryScreen: React.FC<QuestionnaireHistoryScreenProps> = ({ navigation, route }) => {
  const { questionnaireId } = route.params || {};
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const params = questionnaireId ? { questionnaire_id: questionnaireId } : undefined;
      const response = await ApiService.getMyQuestionnaireResponses(params);
      if (response.success && response.data) {
        setResponses(response.data.responses || []);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchResponses();
    setRefreshing(false);
  }, []);

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'body':
        return '#ef4444';
      case 'mind':
        return '#3b82f6';
      case 'spirit':
        return '#8b5cf6';
      default:
        return theme.colors.primary;
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'body':
        return 'Activity';
      case 'mind':
        return 'Brain';
      case 'spirit':
        return 'Heart';
      default:
        return 'Circle';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderResponseCard = (response: Response) => {
    return (
      <TouchableOpacity
        key={response.id}
        style={styles.responseCard}
        onPress={() => navigation.navigate('QuestionnaireResult', {
          result: {
            response_id: response.id,
            period: response.period,
            total_body_points: response.total_body_points,
            total_mind_points: response.total_mind_points,
            total_spirit_points: response.total_spirit_points,
            total_points: response.total_points,
            dominant_category: response.dominant_category,
            chart_data: response.chart_data,
          },
          questionnaireTitle: response.questionnaire.title,
          period: {
            year: response.period_year,
            month: response.period_month,
            label: response.period,
          },
        })}
        activeOpacity={0.7}
      >
        <View style={styles.responseHeader}>
          <View style={styles.responseInfo}>
            <Text style={styles.responseTitle}>{response.questionnaire.title}</Text>
            <Text style={styles.responsePeriod}>{response.period}</Text>
            <Text style={styles.responseDate}>Completed: {formatDate(response.completed_at)}</Text>
          </View>
          <View
            style={[
              styles.dominantBadge,
              { backgroundColor: getCategoryColor(response.dominant_category) + '20' },
            ]}
          >
            <WebSafeIcon
              name={getCategoryIcon(response.dominant_category)}
              size={20}
              color={getCategoryColor(response.dominant_category)}
            />
          </View>
        </View>

        <View style={styles.pointsContainer}>
          <View style={styles.pointItem}>
            <View style={[styles.pointIcon, { backgroundColor: '#ef444420' }]}>
              <WebSafeIcon name="Activity" size={14} color="#ef4444" />
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Body</Text>
              <Text style={styles.pointValue}>{response.total_body_points}</Text>
            </View>
          </View>

          <View style={styles.pointItem}>
            <View style={[styles.pointIcon, { backgroundColor: '#3b82f620' }]}>
              <WebSafeIcon name="Brain" size={14} color="#3b82f6" />
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Mind</Text>
              <Text style={styles.pointValue}>{response.total_mind_points}</Text>
            </View>
          </View>

          <View style={styles.pointItem}>
            <View style={[styles.pointIcon, { backgroundColor: '#8b5cf620' }]}>
              <WebSafeIcon name="Heart" size={14} color="#8b5cf6" />
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Spirit</Text>
              <Text style={styles.pointValue}>{response.total_spirit_points}</Text>
            </View>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Points</Text>
          <Text style={styles.totalValue}>{response.total_points}</Text>
        </View>

        <View style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <WebSafeIcon name="ChevronRight" size={16} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>History</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {responses.length === 0 ? (
          <View style={styles.emptyState}>
            <WebSafeIcon name="BarChart2" size={48} color={theme.colors.text.light} />
            <Text style={styles.emptyTitle}>No results yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete a questionnaire to see your results here
            </Text>
          </View>
        ) : (
          <View style={styles.responsesList}>
            <Text style={styles.resultsCount}>
              {responses.length} result{responses.length !== 1 ? 's' : ''}
            </Text>
            {responses.map(renderResponseCard)}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  responsesList: {
    padding: theme.spacing.md,
  },
  resultsCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.weights.medium,
  },
  responseCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.soft,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  responseInfo: {
    flex: 1,
  },
  responseTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  responsePeriod: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  responseDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  dominantBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  pointIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointInfo: {
    alignItems: 'flex-start',
  },
  pointLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  pointValue: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  viewDetailsText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
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
    textAlign: 'center',
  },
});

export default QuestionnaireHistoryScreen;
