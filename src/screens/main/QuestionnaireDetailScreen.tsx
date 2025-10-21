import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface Answer {
  id: string;
  answer_text: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice';
  is_required: boolean;
  answers: Answer[];
}

interface Period {
  year: number;
  month: number | null;
  label: string;
}

interface QuestionnaireDetailScreenProps {
  navigation: any;
  route: {
    params: {
      questionnaireId: string;
      period: Period;
    };
  };
}

const QuestionnaireDetailScreen: React.FC<QuestionnaireDetailScreenProps> = ({ navigation, route }) => {
  const { questionnaireId, period } = route.params;
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [responses, setResponses] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchQuestionnaireDetails();
  }, []);

  const fetchQuestionnaireDetails = async () => {
    try {
      const response = await ApiService.getQuestionnaireDetails(questionnaireId);
      if (response.success && response.data) {
        setQuestionnaire(response.data);
      }
    } catch (error) {
      console.error('Error fetching questionnaire details:', error);
      Alert.alert('Error', 'Failed to load questionnaire');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerToggle = (questionId: string, answerId: string, questionType: string) => {
    setResponses(prev => {
      const currentAnswers = prev[questionId] || [];

      if (questionType === 'single_choice') {
        // Single choice: replace with new answer
        return { ...prev, [questionId]: [answerId] };
      } else {
        // Multiple choice: toggle answer
        const answerIndex = currentAnswers.indexOf(answerId);
        if (answerIndex > -1) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter(id => id !== answerId)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId]
          };
        }
      }
    });
  };

  const isAnswerSelected = (questionId: string, answerId: string): boolean => {
    return (responses[questionId] || []).includes(answerId);
  };

  const validateStep = (step: number): boolean => {
    const stepQuestions = questionnaire.questions_by_step[step.toString()] || [];

    for (const question of stepQuestions) {
      if (question.is_required) {
        const hasAnswer = responses[question.id] && responses[question.id].length > 0;
        if (!hasAnswer) {
          Alert.alert('Required Question', `Please answer: ${question.question_text}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < questionnaire.total_steps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate current step first
    if (!validateStep(currentStep)) {
      return;
    }

    // Validate all required questions across all steps
    for (let step = 1; step <= questionnaire.total_steps; step++) {
      const stepQuestions = questionnaire.questions_by_step[step.toString()] || [];
      for (const question of stepQuestions) {
        if (question.is_required) {
          const hasAnswer = responses[question.id] && responses[question.id].length > 0;
          if (!hasAnswer) {
            Alert.alert('Incomplete', `Please complete all required questions in Step ${step}`);
            setCurrentStep(step);
            return;
          }
        }
      }
    }

    setSubmitting(true);

    try {
      const submitData = {
        period_year: period.year,
        period_month: period.month,
        responses: responses
      };

      const response = await ApiService.submitQuestionnaire(questionnaireId, submitData);

      if (response.success && response.data) {
        navigation.replace('QuestionnaireResult', {
          result: response.data,
          questionnaireTitle: questionnaire.title,
          period: period
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to submit questionnaire');
      }
    } catch (error: any) {
      console.error('Error submitting questionnaire:', error);
      Alert.alert('Error', error.message || 'Failed to submit questionnaire');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const isMultipleChoice = question.question_type === 'multiple_choice';

    return (
      <View key={question.id} style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question.question_text}
          {question.is_required && <Text style={styles.required}> *</Text>}
        </Text>
        {isMultipleChoice && (
          <Text style={styles.questionHint}>(Select all that apply)</Text>
        )}

        <View style={styles.answersContainer}>
          {question.answers.map((answer) => {
            const isSelected = isAnswerSelected(question.id, answer.id);

            return (
              <TouchableOpacity
                key={answer.id}
                style={[
                  styles.answerButton,
                  isSelected && styles.answerButtonSelected
                ]}
                onPress={() => handleAnswerToggle(question.id, answer.id, question.question_type)}
                activeOpacity={0.7}
              >
                <View style={[
                  isMultipleChoice ? styles.checkbox : styles.radio,
                  isSelected && (isMultipleChoice ? styles.checkboxSelected : styles.radioSelected)
                ]}>
                  {isSelected && (
                    <WebSafeIcon
                      name={isMultipleChoice ? 'Check' : 'Circle'}
                      size={isMultipleChoice ? 14 : 8}
                      color={theme.colors.white}
                    />
                  )}
                </View>
                <Text style={[
                  styles.answerText,
                  isSelected && styles.answerTextSelected
                ]}>
                  {answer.answer_text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
          <Text style={styles.headerTitle}>Questionnaire</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const currentStepQuestions = questionnaire?.questions_by_step[currentStep.toString()] || [];
  const isLastStep = currentStep === questionnaire?.total_steps;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{questionnaire.title}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Step {currentStep} of {questionnaire.total_steps}
          </Text>
          <Text style={styles.periodText}>{period.label}</Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / questionnaire.total_steps) * 100}%` }
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStepQuestions.map(renderQuestion)}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.footerButton,
            currentStep === 1 && styles.footerButtonDisabled
          ]}
          onPress={handlePrevious}
          disabled={currentStep === 1}
          activeOpacity={0.7}
        >
          <WebSafeIcon
            name="ChevronLeft"
            size={20}
            color={currentStep === 1 ? theme.colors.text.light : theme.colors.text.primary}
          />
          <Text style={[
            styles.footerButtonText,
            currentStep === 1 && styles.footerButtonTextDisabled
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        {isLastStep ? (
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.submitButton,
              submitting && styles.footerButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.7}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit</Text>
                <WebSafeIcon name="Check" size={20} color={theme.colors.white} />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.footerButton, styles.nextButton]}
            onPress={handleNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <WebSafeIcon name="ChevronRight" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>
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
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  periodText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  questionContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  questionText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: 22,
  },
  required: {
    color: theme.colors.error,
  },
  questionHint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  answersContainer: {
    gap: theme.spacing.sm,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.background,
  },
  answerButtonSelected: {
    backgroundColor: theme.colors.primaryGhost,
    borderColor: theme.colors.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  answerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  answerTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing.sm,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.white,
    gap: theme.spacing.xs,
  },
  footerButtonDisabled: {
    opacity: 0.4,
  },
  footerButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  footerButtonTextDisabled: {
    color: theme.colors.text.light,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  nextButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  submitButton: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  submitButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
});

export default QuestionnaireDetailScreen;
