import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';
import Header from '../../components/common/Header';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import ApiService from '../../services/apiService';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: string;
  options?: Array<{
    value: string;
    label: string;
  }> | null;
}

interface Template {
  id: string;
  name: string;
  initial_fields?: FormField[];
  daily_fields?: FormField[];
  initial_input_type?: string;
  daily_input_type?: string;
}

interface DayData {
  day_number: number;
  initial_data?: Record<string, string>;
  daily_data?: Record<string, string>;
}

interface DailyQuestionsScreenProps {
  navigation: any;
  route: any;
}

const DailyQuestionsScreen: React.FC<DailyQuestionsScreenProps> = ({ navigation, route }) => {
  const { testimonialId, dayNumber, isCompleted, dayData, template } = route.params || {};
  const [initialFormData, setInitialFormData] = useState<Record<string, string>>({});
  const [dailyFormData, setDailyFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Cross-platform alert function
  const showAlert = (title: string, message: string, onPress?: () => void) => {
    if (Platform.OS === 'web') {
      // For web, use native alert and then call onPress
      if (window.alert) {
        window.alert(`${title}\n\n${message}`);
        onPress && onPress();
      } else {
        // Fallback for web
        console.log(`${title}: ${message}`);
        onPress && onPress();
      }
    } else {
      // For mobile, use React Native Alert
      Alert.alert(
        title,
        message,
        onPress ? [{ text: 'OK', onPress }] : [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };

  useEffect(() => {
    if (isCompleted && dayData) {
      // For completed days, use the submitted data
      const initialData = dayData.initial_data || {};
      const dailyData = dayData.daily_data || {};
      
      setInitialFormData(initialData);
      setDailyFormData(dailyData);
    } else {
      // Initialize with empty form data based on template fields
      const initialData: Record<string, string> = {};
      const dailyData: Record<string, string> = {};
      
      if (dayNumber === 1 && template?.initial_fields) {
        template.initial_fields.forEach((field: any) => {
          initialData[field.name] = '';
        });
      }
      
      if (template?.daily_fields) {
        template.daily_fields.forEach((field: any) => {
          dailyData[field.name] = '';
        });
      }
      
      setInitialFormData(initialData);
      setDailyFormData(dailyData);
    }
  }, [isCompleted, dayData, template, dayNumber]);

  const handleInitialInputChange = (fieldName: string, value: string) => {
    setInitialFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleDailyInputChange = (fieldName: string, value: string) => {
    setDailyFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (isCompleted) {
      // Just viewing completed data, go back
      navigation.goBack();
      return;
    }

    // Test alert to verify it's working
    console.log('Submit button clicked!');

    // Validate required fields
    const validateRequiredFields = () => {
      const missingFields: string[] = [];
      
      // Check initial fields for day 1
      if (dayNumber === 1 && template?.initial_fields) {
        template.initial_fields.forEach((field: any) => {
          if (field.required === "1") {
            const value = initialFormData[field.name] || '';
            if (!value.trim()) {
              missingFields.push(field.label);
            }
          }
        });
      }
      
      // Check daily fields
      if (template?.daily_fields) {
        template.daily_fields.forEach((field: any) => {
          if (field.required === "1") {
            const value = dailyFormData[field.name] || '';
            if (!value.trim()) {
              missingFields.push(field.label);
            }
          }
        });
      }
      
      return missingFields;
    };

    const missingRequiredFields = validateRequiredFields();
    if (missingRequiredFields.length > 0) {
      const fieldList = missingRequiredFields.join(', ');
      showAlert('Required Fields Missing', `Please fill in the following required fields: ${fieldList}`);
      return;
    }

    // Basic validation - check if at least some data is provided
    const hasInitialData = dayNumber === 1 && Object.values(initialFormData).some(value => value.trim());
    const hasDailyData = Object.values(dailyFormData).some(value => value.trim());
    
    if (!hasInitialData && !hasDailyData) {
      showAlert('Validation Error', 'Please fill in at least one field');
      return;
    }

    try {
      setSubmitting(true);
      
      console.log('Form data before submit:', { initialFormData, dailyFormData }); // Debug log
      
      // Clean the data
      const cleanedInitialData: Record<string, string> = {};
      const cleanedDailyData: Record<string, string> = {};
      
      if (dayNumber === 1) {
        Object.keys(initialFormData).forEach(key => {
          const value = initialFormData[key];
          if (typeof value === 'string' && value.trim()) {
            cleanedInitialData[key] = value.trim();
          }
        });
      }
      
      Object.keys(dailyFormData).forEach(key => {
        const value = dailyFormData[key];
        if (typeof value === 'string' && value.trim()) {
          cleanedDailyData[key] = value.trim();
        }
      });

      const submitData: {
        initial_data?: Record<string, string>;
        daily_data: Record<string, string>;
      } = {
        daily_data: cleanedDailyData
      };

      if (dayNumber === 1 && Object.keys(cleanedInitialData).length > 0) {
        submitData.initial_data = cleanedInitialData;
      }

      console.log('Submit data:', submitData); // Debug log

      const response = await ApiService.submitDailyTracking(testimonialId, dayNumber, submitData);
      
      console.log('Submit response:', response); // Debug log
      
      if (response && response.success) {
        // Stop submitting state and set success
        setSubmitting(false);
        setSubmitSuccess(true);
        
        // Multiple approaches to ensure success is communicated
        const successMessage = response.message || `Day ${dayNumber} tracking has been submitted successfully.`;
        
        // 1. Console log for debugging
        console.log('SUCCESS:', successMessage);
        
        // 2. Try platform alert
        showAlert('Success!', successMessage, () => {
          navigation.navigate('MainTabs', { screen: 'Testimonials' });
        });
        
        // 3. Fallback: Navigate after a short delay if alert doesn't work
        setTimeout(() => {
          if (submitSuccess) {
            navigation.navigate('MainTabs', { screen: 'Testimonials' });
          }
        }, 2000);
        
        return; // Exit early to avoid setting submitting false again
      } else {
        showAlert(
          'Error', 
          response?.message || 'Failed to submit daily tracking'
        );
      }
    } catch (error: any) {
      console.error('Error submitting daily tracking:', error);
      showAlert('Error', 'Failed to submit daily tracking. Please try again.');
      setSubmitting(false);
    }
    // Note: Don't use finally block as success case already sets submitting to false
  };

  const renderField = (field: FormField, isInitial: boolean = false) => {
    const formData = isInitial ? initialFormData : dailyFormData;
    const handleChange = isInitial ? handleInitialInputChange : handleDailyInputChange;
    const value = formData[field.name] || '';
    const isDisabled = isCompleted;
    const isRequired = field.required === "1";

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {isRequired && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                isDisabled && styles.disabledInput
              ]}
              placeholder={isDisabled ? `No ${field.label.toLowerCase()} entered` : `Enter ${field.label.toLowerCase()}`}
              value={value}
              onChangeText={(text) => handleChange(field.name, text)}
              keyboardType={field.type === 'number' ? 'numeric' : 'default'}
              editable={!isDisabled}
            />
          </View>
        );

      case 'textarea':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {isRequired && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <TextInput
              style={[
                styles.textAreaInput,
                isDisabled && styles.disabledInput
              ]}
              placeholder={isDisabled ? `No ${field.label.toLowerCase()} entered` : `Enter ${field.label.toLowerCase()}`}
              value={value}
              onChangeText={(text) => handleChange(field.name, text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isDisabled}
            />
          </View>
        );

      case 'select':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {isRequired && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.selectOption,
                    value === option.value && styles.selectOptionSelected,
                  ]}
                  onPress={() => !isDisabled && handleChange(field.name, option.value)}
                  activeOpacity={0.8}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.selectOptionText,
                    value === option.value && styles.selectOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <WebSafeIcon name="CheckCircle" size={18} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title={`Day ${dayNumber} ${isCompleted ? '- Completed' : 'Tracking'}`} />

      <View style={styles.scrollContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={[
              styles.headerIcon,
              isCompleted && styles.headerIconCompleted
            ]}>
              <WebSafeIcon 
                name={isCompleted ? "CheckCircle" : "Calendar"} 
                size={24} 
                color={isCompleted ? theme.colors.success : theme.colors.primary} 
              />
            </View>
            <Text style={styles.headerTitle}>
              {isCompleted ? `Day ${dayNumber} - Completed` : `Day ${dayNumber} Tracking`}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isCompleted 
                ? 'Review your submitted responses below'
                : 'Please fill out your daily tracking information'
              }
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Initial Questions (Day 1 only) */}
            {dayNumber === 1 && template?.initial_fields && template.initial_fields.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Initial Questions</Text>
                {template.initial_fields.map((field: any) => renderField(field, true))}
              </View>
            )}

            {/* Daily Questions */}
            {template?.daily_fields && template.daily_fields.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Daily Questions</Text>
                {template.daily_fields.map((field: any) => renderField(field, false))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            {submitSuccess ? (
              <View style={styles.successContainer}>
                <WebSafeIcon name="CheckCircle" size={24} color={theme.colors.success} />
                <Text style={styles.successText}>Successfully Submitted!</Text>
                <Text style={styles.successSubtext}>Returning to testimonials...</Text>
              </View>
            ) : (
              <>
                <CustomButton
                  title={isCompleted ? "Close" : submitting ? "Submitting..." : `Submit Day ${dayNumber}`}
                  onPress={handleSubmit}
                  disabled={submitting}
                  colorScheme={isCompleted ? "secondary" : "primary"}
                  fullWidth
                />
                {submitting && (
                  <ActivityIndicator 
                    size="small" 
                    color={theme.colors.primary} 
                    style={styles.submitLoader}
                  />
                )}
              </>
            )}
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
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 70, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerIconCompleted: {
    backgroundColor: theme.colors.success + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  formContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  fieldContainer: {
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.1,
  },
  requiredStar: {
    color: theme.colors.error,
  },
  textInput: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    minHeight: 48,
  },
  textAreaInput: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    minHeight: 100,
  },
  disabledInput: {
    backgroundColor: theme.colors.border.subtle,
    color: theme.colors.text.secondary,
  },
  submitContainer: {
    alignItems: 'center',
  },
  submitLoader: {
    marginTop: theme.spacing.md,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  successText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.success,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  successSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  selectContainer: {
    gap: theme.spacing.sm,
  },
  selectOption: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  selectOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGhost,
  },
  selectOptionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  selectOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
});

export default DailyQuestionsScreen;