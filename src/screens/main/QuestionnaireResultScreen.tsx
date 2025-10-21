import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';

interface ChartData {
  labels: string[];
  values: number[];
  percentages: number[];
}

interface Result {
  response_id: string;
  period: string;
  total_body_points: number;
  total_mind_points: number;
  total_spirit_points: number;
  total_points: number;
  dominant_category: string;
  chart_data: ChartData;
}

interface Period {
  year: number;
  month: number | null;
  label: string;
}

interface QuestionnaireResultScreenProps {
  navigation: any;
  route: {
    params: {
      result: Result;
      questionnaireTitle: string;
      period: Period;
    };
  };
}

const QuestionnaireResultScreen: React.FC<QuestionnaireResultScreenProps> = ({ navigation, route }) => {
  const { result, questionnaireTitle, period } = route.params;

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

  const renderPieChart = () => {
    const chartData = [
      { label: 'Body', value: result.total_body_points, color: '#ef4444', icon: 'Activity' },
      { label: 'Mind', value: result.total_mind_points, color: '#3b82f6', icon: 'Brain' },
      { label: 'Spirit', value: result.total_spirit_points, color: '#8b5cf6', icon: 'Heart' },
    ];

    const total = result.total_points;

    return (
      <View style={styles.pieChartContainer}>
        {/* Donut Chart using stacked percentage bars in circle */}
        <View style={styles.donutChartContainer}>
          <View style={styles.donutChart}>
            {/* Outer ring showing segments */}
            <View style={styles.segmentRing}>
              {chartData.map((item, index) => {
                const percentage = (item.value / total) * 100;
                return (
                  <View
                    key={item.label}
                    style={[
                      styles.segment,
                      {
                        backgroundColor: item.color,
                        width: `${percentage}%`,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Center circle */}
            <View style={styles.donutCenter}>
              <Text style={styles.donutCenterValue}>{total}</Text>
              <Text style={styles.donutCenterLabel}>Total Points</Text>
            </View>
          </View>

          {/* Individual category cards */}
          <View style={styles.categoriesGrid}>
            {chartData.map((item) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <View key={item.label} style={styles.categoryCard}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: item.color + '20' }]}>
                    <WebSafeIcon name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryLabel}>{item.label}</Text>
                    <Text style={[styles.categoryValue, { color: item.color }]}>
                      {item.value}
                    </Text>
                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Success Message */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <WebSafeIcon name="CheckCircle" size={48} color={theme.colors.success} />
          </View>
          <Text style={styles.successTitle}>Questionnaire Completed!</Text>
          <Text style={styles.successSubtitle}>
            {questionnaireTitle} - {period.label}
          </Text>
        </View>

        {/* Dominant Category Card */}
        <View style={styles.dominantCard}>
          <Text style={styles.dominantLabel}>Your Dominant Category</Text>
          <View style={styles.dominantContent}>
            <View
              style={[
                styles.dominantIcon,
                { backgroundColor: getCategoryColor(result.dominant_category) + '20' }
              ]}
            >
              <WebSafeIcon
                name={getCategoryIcon(result.dominant_category)}
                size={32}
                color={getCategoryColor(result.dominant_category)}
              />
            </View>
            <Text
              style={[
                styles.dominantCategory,
                { color: getCategoryColor(result.dominant_category) }
              ]}
            >
              {result.dominant_category}
            </Text>
          </View>
        </View>

        {/* Pie Chart */}
        {renderPieChart()}

        {/* Detailed Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Detailed Breakdown</Text>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.breakdownIcon, { backgroundColor: '#ef444420' }]}>
                <WebSafeIcon name="Activity" size={20} color="#ef4444" />
              </View>
              <Text style={styles.breakdownLabel}>Body</Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${(result.total_body_points / result.total_points) * 100}%`,
                    backgroundColor: '#ef4444',
                  },
                ]}
              />
            </View>
            <Text style={styles.breakdownValue}>{result.total_body_points} points</Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.breakdownIcon, { backgroundColor: '#3b82f620' }]}>
                <WebSafeIcon name="Brain" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.breakdownLabel}>Mind</Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${(result.total_mind_points / result.total_points) * 100}%`,
                    backgroundColor: '#3b82f6',
                  },
                ]}
              />
            </View>
            <Text style={styles.breakdownValue}>{result.total_mind_points} points</Text>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.breakdownIcon, { backgroundColor: '#8b5cf620' }]}>
                <WebSafeIcon name="Heart" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.breakdownLabel}>Spirit</Text>
            </View>
            <View style={styles.breakdownBar}>
              <View
                style={[
                  styles.breakdownFill,
                  {
                    width: `${(result.total_spirit_points / result.total_points) * 100}%`,
                    backgroundColor: '#8b5cf6',
                  },
                ]}
              />
            </View>
            <Text style={styles.breakdownValue}>{result.total_spirit_points} points</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('QuestionnaireList')}
            activeOpacity={0.7}
          >
            <WebSafeIcon name="List" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>View All Questionnaires</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => navigation.navigate('QuestionnaireHistory', {
              questionnaireId: route.params.result.response_id
            })}
            activeOpacity={0.7}
          >
            <WebSafeIcon name="BarChart2" size={20} color={theme.colors.white} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
              View History
            </Text>
          </TouchableOpacity>
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
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    height: 60,
    flexShrink: 0,
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
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 60, bottom: 0, left: 0, right: 0 } as any,
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  successIcon: {
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  successSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  dominantCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    alignItems: 'center',
  },
  dominantLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
  },
  dominantContent: {
    alignItems: 'center',
  },
  dominantIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dominantCategory: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
  },
  pieChartContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  donutChartContainer: {
    width: '100%',
  },
  donutChart: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  segmentRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  segment: {
    height: '100%',
  },
  donutCenter: {
    position: 'absolute',
    top: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  donutCenterValue: {
    fontSize: 32,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  donutCenterLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryInfo: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: 2,
  },
  categoryValue: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  chartLegend: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
  },
  legendLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
    flex: 1,
  },
  legendValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  breakdownCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  breakdownTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  breakdownItem: {
    marginBottom: theme.spacing.md,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  breakdownLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  breakdownBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  actionsContainer: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.white,
    gap: theme.spacing.sm,
  },
  actionButtonPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  actionButtonTextPrimary: {
    color: theme.colors.white,
  },
});

export default QuestionnaireResultScreen;
