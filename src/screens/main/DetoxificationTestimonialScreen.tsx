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
import { CheckCircle, Leaf, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../../services/apiService';
import CustomButton from '../../components/common/Button';
import Header from '../../components/common/Header';
import { theme } from '../../constants/theme';

interface FormField {
  type: string;
  name: string;
  label: string;
  required?: string;
  placeholder?: string | null;
  options?: Array<{
    value: string;
    label: string;
    price?: number;
  }> | null;
}

interface TestimonialForm {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  category: string;
  category_label: string;
  fields: FormField[];
  requires_photos: boolean;
  requires_before_after: boolean;
  has_daily_tracking: boolean;
  diary_days: number;
  website: {
    id: string;
    name: string;
    subdomain: string;
    logo: string | null;
  };
}

interface SubmissionResponse {
  testimonial_id: string;
  status: string;
  submitted_at: string;
  has_daily_tracking: boolean;
  diary_days: number;
}

interface DetoxificationTestimonialScreenProps {
  navigation: any;
}

const DetoxificationTestimonialScreen: React.FC<DetoxificationTestimonialScreenProps> = ({ navigation }) => {
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<SubmissionResponse | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [currentDateField, setCurrentDateField] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonialForm();
  }, []);

  const fetchTestimonialForm = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ApiService.getDetoxificationTestimonialForm();
      
      if (response.success && response.data) {
        setTestimonialForm(response.data);
        
        // Initialize form data with empty values
        const initialData: Record<string, string> = {};
        response.data.fields.forEach((field) => {
          initialData[field.name] = '';
        });
        setFormData(initialData);
      } else {
        Alert.alert('Error', 'Failed to load testimonial form');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching testimonial form:', error);
      Alert.alert('Error', 'Failed to load testimonial form');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!testimonialForm) return false;

    testimonialForm.fields.forEach((field) => {
      if (field.required === '1' && !formData[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const openDatePicker = (fieldName: string) => {
    setCurrentDateField(fieldName);
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
    setCurrentDateField(null);
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setCurrentDateField(null);
    }

    if (selectedDate && currentDateField) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      handleInputChange(currentDateField, formattedDate);
      
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
        setCurrentDateField(null);
      }
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Filter out empty values
      const cleanedData: Record<string, string> = {};
      Object.keys(formData).forEach(key => {
        if (formData[key]?.trim()) {
          cleanedData[key] = formData[key].trim();
        }
      });

      const response = await ApiService.submitDetoxificationTestimonial(cleanedData);
      
      if (response.success && response.data) {
        setSuccessData(response.data);
        Alert.alert(
          'Thank You!',
          'Your testimonial has been submitted successfully. Thank you for sharing your experience!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        // Handle validation errors
        if (response.errors && Object.keys(response.errors).length > 0) {
          // Set the errors state to show validation errors on specific fields
          const apiErrors: Record<string, string> = {};
          Object.keys(response.errors).forEach(field => {
            const fieldErrors = response.errors![field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              apiErrors[field] = fieldErrors[0]; // Take the first error message
            }
          });
          setErrors(apiErrors);
          
          // Show a summary alert with all validation errors
          const errorMessages = Object.keys(response.errors)
            .map(field => {
              const fieldErrors = response.errors![field];
              const fieldLabel = testimonialForm?.fields.find(f => f.name === field)?.label || field;
              return `• ${fieldLabel}: ${Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors}`;
            })
            .join('\n');
          
          Alert.alert(
            'Validation Errors', 
            `Please fix the following errors:\n\n${errorMessages}`,
            [{ text: 'OK', style: 'default' }]
          );
        } else {
          Alert.alert('Error', response.message || 'Failed to submit testimonial');
        }
      }
    } catch (error: any) {
      console.error('Error submitting testimonial:', error);
      
      // Try to extract validation errors from the error response
      if (error.message && error.message.includes('Validation failed')) {
        // The error might contain the response body with validation details
        Alert.alert('Validation Error', 'Please check all required fields and try again.');
      } else {
        Alert.alert('Error', 'Failed to submit testimonial. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === '1' && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <TextInput
              style={[styles.textInput, hasError && styles.textInputError]}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              value={value}
              onChangeText={(text) => handleInputChange(field.name, text)}
              keyboardType={field.type === 'number' ? 'numeric' : field.type === 'email' ? 'email-address' : 'default'}
              autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
              autoCorrect={field.type !== 'email'}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'textarea':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === '1' && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <TextInput
              style={[styles.textAreaInput, hasError && styles.textInputError]}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              value={value}
              onChangeText={(text) => handleInputChange(field.name, text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'select':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === '1' && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.selectOption,
                    value === option.value && styles.selectOptionSelected,
                    hasError && styles.selectOptionError
                  ]}
                  onPress={() => handleInputChange(field.name, option.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.selectOptionText,
                    value === option.value && styles.selectOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <CheckCircle size={18} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'radio':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === '1' && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.selectOption,
                    value === option.value && styles.selectOptionSelected,
                    hasError && styles.selectOptionError
                  ]}
                  onPress={() => handleInputChange(field.name, option.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.selectOptionText,
                    value === option.value && styles.selectOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <CheckCircle size={18} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'date':
        const dateValue = value ? new Date(value) : null;
        const displayDate = dateValue ? dateValue.toLocaleDateString() : 'Select Date';
        
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === '1' && <Text style={styles.requiredStar}> *</Text>}
            </Text>
            <TouchableOpacity
              style={[styles.dateInput, hasError && styles.textInputError]}
              onPress={() => openDatePicker(field.name)}
              activeOpacity={0.8}
            >
              <View style={styles.dateInputContent}>
                <Text style={[
                  styles.dateInputText,
                  !value && styles.dateInputPlaceholder
                ]}>
                  {displayDate}
                </Text>
                <Calendar size={18} color={theme.colors.text.tertiary} />
              </View>
            </TouchableOpacity>
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
            
            {showDatePicker && currentDateField === field.name && Platform.OS !== 'web' && (
              <DateTimePicker
                value={dateValue || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                onTouchCancel={closeDatePicker}
              />
            )}
            {showDatePicker && currentDateField === field.name && Platform.OS === 'web' && (
              <TextInput
                style={[styles.textInput, { marginTop: theme.spacing.sm }]}
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={(text) => {
                  handleInputChange(field.name, text);
                  setShowDatePicker(false);
                  setCurrentDateField(null);
                }}
                onBlur={() => {
                  setShowDatePicker(false);
                  setCurrentDateField(null);
                }}
                autoFocus
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detoxification Testimonial" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading testimonial form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (successData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color={theme.colors.success} />
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>
            Your testimonial has been submitted successfully. We appreciate you sharing your detoxification experience!
          </Text>
          
          <View style={styles.successDetails}>
            <Text style={styles.successDetailText}>
              Testimonial ID: {successData.testimonial_id.substring(0, 8)}...
            </Text>
            <Text style={styles.successDetailText}>
              Status: {successData.status.charAt(0).toUpperCase() + successData.status.slice(1)}
            </Text>
            {successData.has_daily_tracking && (
              <Text style={styles.successDetailText}>
                Daily tracking: {successData.diary_days} days
              </Text>
            )}
          </View>

          <CustomButton
            title="Done"
            onPress={() => navigation.goBack()}
            colorScheme="primary"
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Detoxification Testimonial" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerIcon}>
              <Leaf size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerTitle}>
              {testimonialForm?.name || 'Share Your Experience'}
            </Text>
            {testimonialForm?.description && (
              <Text style={styles.headerDescription}>
                {testimonialForm.description}
              </Text>
            )}
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {testimonialForm?.fields.map((field) => renderField(field))}
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <CustomButton
              title={submitting ? "Submitting..." : "Submit Testimonial"}
              onPress={handleSubmit}
              disabled={submitting}
              colorScheme="primary"
              fullWidth
            />
            {submitting && (
              <ActivityIndicator 
                size="small" 
                color={theme.colors.primary} 
                style={styles.submitLoader}
              />
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  formContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
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
    minHeight: 120,
  },
  textInputError: {
    borderColor: theme.colors.error,
  },
  selectContainer: {
    gap: theme.spacing.sm,
  },
  selectOption: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  selectOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGhost,
  },
  selectOptionError: {
    borderColor: theme.colors.error,
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
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  dateInput: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
  },
  dateInputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  dateInputPlaceholder: {
    color: theme.colors.text.tertiary,
  },
  submitContainer: {
    alignItems: 'center',
  },
  submitLoader: {
    marginTop: theme.spacing.md,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    maxWidth: 320,
  },
  successDetails: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    width: '100%',
    maxWidth: 280,
  },
  successDetailText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
});

export default DetoxificationTestimonialScreen;