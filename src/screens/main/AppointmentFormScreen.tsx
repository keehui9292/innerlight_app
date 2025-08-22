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
import { ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react-native';
import ApiService from '../../services/apiService';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';

interface FormField {
  type: string;
  name: string;
  label: string;
  column_size: string;
  placeholder: string;
  min: string;
  max: string;
  accept: string;
  min_date: string | null;
  max_date: string | null;
  min_time: string | null;
  max_time: string | null;
  time_interval: string | null;
  required: string;
  conflict_logic: string;
  max_conflict_count: number | null;
  options?: Array<{
    value: string;
    label: string;
    price?: number;
  }>;
}

interface AppointmentForm {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
}

interface FormData {
  [key: string]: string | number;
}

interface AppointmentFormScreenProps {
  navigation: any;
  route: any;
}

const AppointmentFormScreen: React.FC<AppointmentFormScreenProps> = ({ navigation }) => {
  const [selectedForm, setSelectedForm] = useState<AppointmentForm | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    fetchAppointmentForms();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [formData, selectedForm]);

  const fetchAppointmentForms = async () => {
    try {
      setLoading(true);
      const response: any = await ApiService.getAppointmentForms();
      
      if (response.success && response.data) {
        if (response.data.length > 0) {
          setSelectedForm(response.data[0]);
          initializeFormData(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching appointment forms:', error);
      Alert.alert('Error', 'Failed to load appointment forms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (form: AppointmentForm) => {
    const initialData: FormData = {};
    form.fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
    setErrors({});
  };

  const generateTimeOptions = (field: FormField) => {
    const options = [];
    const minTime = field.min_time || '00:00';
    const maxTime = field.max_time || '23:59';
    const interval = parseInt(field.time_interval || '30'); // Default 30 minutes
    
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);
    
    let currentHour = minHour;
    let currentMinute = minMinute;
    
    while (currentHour < maxHour || (currentHour === maxHour && currentMinute <= maxMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      options.push({
        value: timeString,
        label: displayTime
      });
      
      currentMinute += interval;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return options;
  };

  const calculateTotalPrice = () => {
    if (!selectedForm) return;

    let total = 0;
    selectedForm.fields.forEach(field => {
      if (field.options && formData[field.name]) {
        const selectedOption = field.options.find(option => option.value === formData[field.name]);
        if (selectedOption?.price) {
          total += selectedOption.price;
        }
      }
    });
    setTotalPrice(total);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (selectedForm) {
      selectedForm.fields.forEach(field => {
        if (field.required === 'on' && !formData[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }

        if (field.type === 'email' && formData[field.name]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData[field.name] as string)) {
            newErrors[field.name] = 'Please enter a valid email address';
          }
        }

        if (field.type === 'tel' && formData[field.name]) {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(formData[field.name] as string)) {
            newErrors[field.name] = 'Please enter a valid phone number';
          }
        }

        if (field.type === 'date' && formData[field.name]) {
          const selectedDate = new Date(formData[field.name] as string);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (field.min_date) {
            const minDate = new Date(field.min_date);
            if (selectedDate < minDate) {
              newErrors[field.name] = `Date must be after ${minDate.toLocaleDateString()}`;
            }
          } else if (selectedDate < today) {
            newErrors[field.name] = 'Please select a future date';
          }
          
          if (field.max_date) {
            const maxDate = new Date(field.max_date);
            if (selectedDate > maxDate) {
              newErrors[field.name] = `Date must be before ${maxDate.toLocaleDateString()}`;
            }
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedForm) return;

    try {
      setSubmitting(true);
      
      const appointmentData: any = {
        appointment_form_id: selectedForm.id,
        form_data: formData
      };

      const response = await ApiService.createAppointment(appointmentData);
      
      if (response.success) {
        Alert.alert(
          'Success!',
          'Your appointment has been booked successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormField = (field: FormField) => {
    const hasError = !!errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === 'on' && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={[styles.textInput, hasError && styles.inputError]}
              placeholder={field.placeholder}
              value={formData[field.name] as string}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field.name]: text }))}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'tel' ? 'phone-pad' : 'default'}
              autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'textarea':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === 'on' && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={[styles.textArea, hasError && styles.inputError]}
              placeholder={field.placeholder}
              value={formData[field.name] as string}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field.name]: text }))}
              multiline
              numberOfLines={4}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'date':
        if (Platform.OS === 'web') {
          // Use HTML date input for web
          const minDate = field.min_date || new Date().toISOString().split('T')[0];
          const maxDate = field.max_date || '';
          
          return (
            <View key={field.name} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                {field.label}
                {field.required === 'on' && <Text style={styles.required}>*</Text>}
              </Text>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={formData[field.name] as string || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                style={{
                  border: hasError ? `1px solid ${theme.colors.warning}` : `1px solid ${theme.colors.border.light}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.md,
                  fontSize: theme.typography.sizes.md,
                  backgroundColor: theme.colors.white,
                  color: theme.colors.text.primary,
                  fontFamily: 'inherit',
                }}
              />
              {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
            </View>
          );
        } else {
          // Use TouchableOpacity for mobile (you can implement a proper date picker later)
          return (
            <View key={field.name} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                {field.label}
                {field.required === 'on' && <Text style={styles.required}>*</Text>}
              </Text>
              <TouchableOpacity
                style={[styles.dateTimeButton, hasError && styles.inputError]}
                onPress={() => {
                  // For mobile, set tomorrow's date as default for now
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const dateString = tomorrow.toISOString().split('T')[0];
                  setFormData(prev => ({ ...prev, [field.name]: dateString }));
                }}
              >
                <Calendar size={20} color={theme.colors.text.secondary} />
                <Text style={styles.dateTimeText}>
                  {formData[field.name] ? 
                    new Date(formData[field.name] as string).toLocaleDateString() : 
                    'Select Date'
                  }
                </Text>
              </TouchableOpacity>
              {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
            </View>
          );
        }

      case 'time':
        const timeOptions = generateTimeOptions(field);
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === 'on' && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData[field.name] === option.value && styles.optionButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, [field.name]: option.value }))}
                >
                  <View style={styles.optionContent}>
                    <Clock size={16} color={theme.colors.text.secondary} />
                    <Text style={[
                      styles.optionText,
                      formData[field.name] === option.value && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'select':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required === 'on' && <Text style={styles.required}>*</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    formData[field.name] === option.value && styles.optionButtonSelected
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, [field.name]: option.value }))}
                >
                  <View style={styles.optionContent}>
                    <Text style={[
                      styles.optionText,
                      formData[field.name] === option.value && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {option.price !== undefined && option.price > 0 && (
                      <View style={styles.priceContainer}>
                        <DollarSign size={16} color={theme.colors.text.secondary} />
                        <Text style={styles.priceText}>{option.price}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading appointment form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {selectedForm && (
          <>
            {/* Form Fields */}
            <View style={styles.section}>
              {selectedForm.fields.map(field => renderFormField(field))}
            </View>

            {/* Price Summary */}
            {totalPrice > 0 && (
              <View style={styles.priceSection}>
                <Text style={styles.sectionTitle}>Price Summary</Text>
                <View style={styles.totalPriceContainer}>
                  <Text style={styles.totalPriceLabel}>Total Amount:</Text>
                  <Text style={styles.totalPriceValue}>${totalPrice}</Text>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <CustomButton
                title={submitting ? 'Booking...' : 'Book Appointment'}
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                size="lg"
                colorScheme="primary"
                fullWidth
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // Web-specific height constraint
    ...(Platform.OS === 'web' && {
      height: '100vh' as any,
      maxHeight: '100vh' as any,
      overflow: 'hidden' as any
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    // Ensure header is fixed height
    height: 60,
    flexShrink: 0,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    minHeight: 800, // Fixed minimum height
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
  formInfo: {
    paddingVertical: theme.spacing.lg,
  },
  formTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  formDescription: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  dateTimeText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  required: {
    color: theme.colors.warning,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    backgroundColor: theme.colors.white,
    color: theme.colors.text.primary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    backgroundColor: theme.colors.white,
    color: theme.colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.warning,
  },
  errorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    marginTop: theme.spacing.xs,
  },
  selectContainer: {
    gap: theme.spacing.sm,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  },
  optionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  optionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  optionTextSelected: {
    color: theme.colors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  priceText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  priceSection: {
    marginBottom: theme.spacing.xl,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  totalPriceLabel: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  totalPriceValue: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  submitContainer: {
    paddingBottom: theme.spacing.xl,
  },
});

export default AppointmentFormScreen;