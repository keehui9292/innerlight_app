import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface Period {
  year: number;
  month: number | null;
  label: string;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  frequency: 'monthly' | 'yearly';
  total_steps: number;
  total_questions: number;
  available_periods: Period[];
  completed_periods: Period[];
}

interface QuestionnaireListScreenProps {
  navigation: any;
}

const QuestionnaireListScreen: React.FC<QuestionnaireListScreenProps> = ({ navigation }) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const response = await ApiService.getQuestionnaires();
      if (response.success && response.data) {
        setQuestionnaires(response.data);
      }
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQuestionnaires();
    setRefreshing(false);
  }, []);

  const isPeriodCompleted = (questionnaire: Questionnaire, period: Period): boolean => {
    return questionnaire.completed_periods.some(
      cp => cp.year === period.year && cp.month === period.month
    );
  };

  const handlePeriodPress = (questionnaire: Questionnaire, period: Period) => {
    const isCompleted = isPeriodCompleted(questionnaire, period);

    if (isCompleted) {
      // Navigate to history to view the completed response
      navigation.navigate('QuestionnaireHistory', { questionnaireId: questionnaire.id });
    } else {
      // Navigate to questionnaire form to fill it out
      navigation.navigate('QuestionnaireDetail', {
        questionnaireId: questionnaire.id,
        period: period
      });
    }
  };

  const renderQuestionnaireCard = (questionnaire: Questionnaire) => {
    return (
      <View key={questionnaire.id} style={styles.questionnaireCard}>
        <View style={styles.questionnaireHeader}>
          <View style={styles.iconContainer}>
            <WebSafeIcon name="FileText" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.questionnaireInfo}>
            <Text style={styles.questionnaireTitle}>{questionnaire.title}</Text>
            <Text style={styles.questionnaireDescription}>{questionnaire.description}</Text>
            <View style={styles.questionnaireMeta}>
              <View style={styles.metaItem}>
                <WebSafeIcon name="List" size={12} color={theme.colors.text.tertiary} />
                <Text style={styles.metaText}>{questionnaire.total_questions} questions</Text>
              </View>
              <View style={styles.metaItem}>
                <WebSafeIcon name="Layers" size={12} color={theme.colors.text.tertiary} />
                <Text style={styles.metaText}>{questionnaire.total_steps} steps</Text>
              </View>
              <View style={styles.metaItem}>
                <WebSafeIcon name="Calendar" size={12} color={theme.colors.text.tertiary} />
                <Text style={styles.metaText}>{questionnaire.frequency}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.periodsSection}>
          <Text style={styles.periodsTitle}>Available Periods</Text>
          <View style={styles.periodsList}>
            {questionnaire.available_periods.map((period, index) => {
              const isCompleted = isPeriodCompleted(questionnaire, period);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.periodButton,
                    isCompleted && styles.periodButtonCompleted
                  ]}
                  onPress={() => handlePeriodPress(questionnaire, period)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.periodText,
                    isCompleted && styles.periodTextCompleted
                  ]}>
                    {period.label}
                  </Text>
                  {isCompleted && (
                    <WebSafeIcon name="CheckCircle" size={16} color={theme.colors.success} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {questionnaire.completed_periods.length > 0 && (
          <TouchableOpacity
            style={styles.viewHistoryButton}
            onPress={() => navigation.navigate('QuestionnaireHistory', { questionnaireId: questionnaire.id })}
            activeOpacity={0.7}
          >
            <WebSafeIcon name="BarChart2" size={16} color={theme.colors.primary} />
            <Text style={styles.viewHistoryText}>View History & Results</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Questionnaires</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Questionnaires</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {questionnaires.length === 0 ? (
            <View style={styles.emptyState}>
              <WebSafeIcon name="FileText" size={48} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>No questionnaires available</Text>
              <Text style={styles.emptySubtitle}>
                Check back later for available questionnaires
              </Text>
            </View>
          ) : (
            <View style={styles.questionnairesList}>
              {questionnaires.map(renderQuestionnaireCard)}
            </View>
          )}
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
    zIndex: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 60, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  questionnairesList: {
  },
  questionnaireCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.soft,
  },
  questionnaireHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  questionnaireInfo: {
    flex: 1,
  },
  questionnaireTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  questionnaireDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  questionnaireMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  periodsSection: {
    // marginBottom: theme.spacing.md,
  },
  periodsTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  periodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.xs,
  },
  periodButtonCompleted: {
    backgroundColor: '#dcfce7',
    borderColor: theme.colors.success,
  },
  periodText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  periodTextCompleted: {
    color: theme.colors.success,
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  viewHistoryText: {
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

export default QuestionnaireListScreen;
