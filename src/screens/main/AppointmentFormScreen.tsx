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
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ApiService from '../../services/apiService';
import CustomButton from '../../components/common/Button';
import Header from '../../components/common/Header';
import { theme } from '../../constants/theme';

// --- Interfaces Updated to Match Provided API JSON ---
interface Option {
  value: string;
  label: string;
  price?: number;
}

interface TimeOption {
  start_time: string | null;
  end_time: string | null;
  label: string | null;
}

interface FormField {
  type: string;
  name: string;
  label: string;
  required: string;
  placeholder?: string;
  min_date?: string | null;
  max_date?: string | null;
  has_pricing?: string;
  time_options?: TimeOption[];
  options?: Option[];
}

interface AppointmentForm {
  id: string;
  name: string;
  description?: string | null;
  fields: FormField[];
}

interface FormData {
  [key: string]: string | number;
}

interface AppointmentSuccessData {
    id: string;
    appointment_form_id: string;
    user_id: string;
    website_id: string;
    appointment_date: string;
    appointment_time: string;
    form_data: {
        appointment_date?: string;
        appointment_time?: string;
        full_name?: string;
        email?: string;
        phone?: string;
        service_type?: string;
        notes?: string | null;
        [key: string]: any;
    };
    total_price: number;
    status: string;
    created_at: string;
    updated_at: string;
    appointment_form: {
        id: string;
        name: string;
        description?: string | null;
        fields: FormField[];
    };
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
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<AppointmentSuccessData | null>(null);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointmentForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      calculateTotalPrice();
    }
  }, [formData, selectedForm]);

  const fetchAppointmentForms = async () => {
    try {
      setLoading(true);
      const response: any = await ApiService.getAppointmentForms();
      
      if (response.success && response.data && response.data.length > 0) {
        const form = response.data[0];
        setSelectedForm(form);
        initializeFormData(form);
      } else {
        Alert.alert('Error', 'No appointment forms were found.');
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
    setTotalPrice(0);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    if (!selectedForm) return;

    selectedForm.fields.forEach(field => {
      if (field.has_pricing === 'on' && field.options && formData[field.name]) {
        const selectedValue = formData[field.name];
        const selectedOption = field.options.find(opt => opt.value === selectedValue);
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
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedForm) return;

    const dateField = selectedForm.fields.find(f => f.type === 'date');
    const timeField = selectedForm.fields.find(f => f.type === 'time');
    const nameField = selectedForm.fields.find(f => f.name.includes('name'));
    const emailField = selectedForm.fields.find(f => f.type === 'email');
    const phoneField = selectedForm.fields.find(f => f.type === 'tel');

    try {
      setSubmitting(true);
      
      const appointmentData: any = {
        appointment_form_id: selectedForm.id,
        appointment_date: dateField ? formData[dateField.name] as string : undefined,
        appointment_time: timeField ? formData[timeField.name] as string : undefined,
        guest_name: nameField ? formData[nameField.name] as string : undefined,
        guest_email: emailField ? formData[emailField.name] as string : undefined,
        guest_phone: phoneField ? formData[phoneField.name] as string : undefined,
        form_data: formData,
      };

      const response: any = await ApiService.createAppointment(appointmentData);
      
      if (response.success) {
        setSuccessData(response.data);
        setIsSuccess(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSuccessDone = () => {
    setIsSuccess(false);
    setSuccessData(null);
    if (selectedForm) initializeFormData(selectedForm);
    navigation.navigate('MainTabs', {
      screen: 'Appointments',
      params: { refresh: true }
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS
    
    if (selectedDate && currentDateField) {
      const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setFormData(prev => ({ ...prev, [currentDateField]: dateString }));
      
      // Close picker on Android after selection
      if (Platform.OS === 'android') {
        setCurrentDateField(null);
      }
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

  const renderFormField = (field: FormField) => {
    const hasError = !!errors[field.name];
    const value = formData[field.name] as string || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required === 'on' && <Text style={styles.required}>*</Text>}</Text>
            <TextInput
              style={[styles.textInput, hasError && styles.inputError]}
              placeholder={field.placeholder}
              value={value}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field.name]: text }))}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'tel' ? 'phone-pad' : 'default'}
              autoCapitalize="none"
            />
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'textarea':
        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required === 'on' && <Text style={styles.required}>*</Text>}</Text>
            <TextInput
              style={[styles.textArea, hasError && styles.inputError]}
              placeholder={field.placeholder}
              value={value}
              onChangeText={(text) => setFormData(prev => ({ ...prev, [field.name]: text }))}
              multiline
              numberOfLines={4}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
          </View>
        );

      case 'date':
        if (Platform.OS === 'web') {
          const minDate = field.min_date || new Date().toISOString().split('T')[0];
          return (
            <View key={field.name} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{field.label}{field.required === 'on' && <Text style={styles.required}>*</Text>}</Text>
              <input
                type="date"
                min={minDate}
                max={field.max_date || ''}
                value={value}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                style={webStyles.dateInput(hasError)}
              />
              {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
            </View>
          );
        } else {
          return (
            <View key={field.name} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{field.label}{field.required === 'on' && <Text style={styles.required}>*</Text>}</Text>
              <TouchableOpacity
                style={[styles.dateTimeButton, hasError && styles.inputError]}
                onPress={() => openDatePicker(field.name)}
              >
                <Calendar size={20} color={theme.colors.text.secondary} />
                <Text style={styles.dateTimeText}>
                  {value ? new Date(value + 'T00:00:00Z').toLocaleDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              {hasError && <Text style={styles.errorText}>{errors[field.name]}</Text>}
            </View>
          );
        }

      case 'time':
      case 'select':
        const options = field.type === 'time'
          ? field.time_options?.map(t => ({ value: t.start_time || '', label: t.label || '', price: undefined }))
          : field.options;
          
        if (!options || options.length === 0 || !options[0].value) return null;

        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}{field.required === 'on' && <Text style={styles.required}>*</Text>}</Text>
            <View style={styles.selectContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionButton, value === option.value && styles.optionButtonSelected]}
                  onPress={() => setFormData(prev => ({ ...prev, [field.name]: option.value }))}
                >
                  <View style={styles.optionContent}>
                    {field.type === 'time' && <Clock size={16} color={theme.colors.text.secondary} />}
                    <Text style={[styles.optionText, value === option.value && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                    {field.has_pricing === 'on' && option.price != null && (
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
        return <Text key={field.name}>Unsupported field type: {field.type}</Text>;
    }
  };

  const renderSuccessView = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.successHeader}>
        <CheckCircle size={48} color={theme.colors.success} />
        <Text style={styles.successTitle}>Appointment Booked!</Text>
        <Text style={styles.successMessage}>Your appointment has been successfully scheduled.</Text>
      </View>

      <ScrollView 
        style={styles.successScrollContainer}
        contentContainerStyle={styles.successScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {successData && (
          <View style={styles.successDetails}>
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Appointment ID</Text>
              <Text style={styles.successDetailValue}>{successData.id.substring(0, 8)}...</Text>
            </View>
            
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Service</Text>
              <Text style={styles.successDetailValue}>{successData.appointment_form.name}</Text>
            </View>
            
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Name</Text>
              <Text style={styles.successDetailValue}>{successData.form_data.full_name}</Text>
            </View>
            
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Email</Text>
              <Text style={styles.successDetailValue}>{successData.form_data.email}</Text>
            </View>
            
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Date</Text>
              <Text style={styles.successDetailValue}>
                {new Date(successData.form_data.appointment_date + 'T00:00:00Z').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Time</Text>
              <Text style={styles.successDetailValue}>
                {new Date(`1970-01-01T${successData.form_data.appointment_time}:00Z`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </Text>
            </View>
            
            {successData.total_price > 0 && (
              <View style={styles.successDetailItem}>
                <Text style={styles.successDetailLabel}>Total</Text>
                <Text style={[styles.successDetailValue, {color: theme.colors.primary, fontWeight: theme.typography.weights.medium}]}>
                  ${successData.total_price.toFixed(2)}
                </Text>
              </View>
            )}
            
            <View style={styles.successDetailItem}>
              <Text style={styles.successDetailLabel}>Status</Text>
              <Text style={[styles.successDetailValue, {color: theme.colors.warning, fontWeight: theme.typography.weights.medium}]}>
                {successData.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.successButtonContainer}>
        <CustomButton title="Done" onPress={handleSuccessDone} colorScheme="primary" fullWidth />
      </View>
    </SafeAreaView>
  );

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
  
  if (isSuccess) {
      return renderSuccessView();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header
        title={selectedForm?.name || 'Book Appointment'}
      />

      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {selectedForm ? (
            <>
              {selectedForm.description && (
                  <View style={styles.formInfo}><Text style={styles.formDescription}>{selectedForm.description}</Text></View>
              )}
              <View style={styles.section}>
                {selectedForm.fields.map(field => renderFormField(field))}
              </View>
              {totalPrice > 0 && (
                <View style={styles.priceSection}>
                  <Text style={styles.sectionTitle}>Price Summary</Text>
                  <View style={styles.totalPriceContainer}>
                    <Text style={styles.totalPriceLabel}>Total Amount:</Text>
                    <Text style={styles.totalPriceValue}>${totalPrice.toFixed(2)}</Text>
                  </View>
                </View>
              )}
              <View style={styles.submitContainer}>
                <CustomButton
                  title={submitting ? 'Booking...' : 'Book Appointment'}
                  onPress={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                  colorScheme="primary"
                  fullWidth
                />
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
                <Text>No form available to display.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Native Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={currentDateField && formData[currentDateField] 
            ? new Date(formData[currentDateField] as string + 'T00:00:00Z') 
            : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={handleDateChange}
          {...(Platform.OS === 'ios' && {
            style: { backgroundColor: 'white' }
          })}
        />
      )}

      {/* iOS Date Picker Done Button */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerActions}>
          <TouchableOpacity onPress={closeDatePicker} style={styles.iosDatePickerButton}>
            <Text style={styles.iosDatePickerButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// --- STYLE ADJUSTMENTS HAVE BEEN APPLIED BELOW ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        ...(Platform.OS === 'web' && { height: '100vh' as any, overflow: 'hidden' }),
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: theme.spacing.md, fontSize: theme.typography.sizes.md, color: theme.colors.text.secondary },
    formInfo: { marginBottom: theme.spacing.lg },
    formDescription: { 
        fontSize: theme.typography.sizes.md, 
        color: theme.colors.text.tertiary, 
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    section: { marginBottom: 0 },
    sectionTitle: { 
        fontSize: theme.typography.sizes.lg, 
        fontWeight: theme.typography.weights.medium, 
        color: theme.colors.text.primary, 
        marginBottom: theme.spacing.md,
        letterSpacing: -0.2,
    },
    dateTimeButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.white, 
        borderWidth: 1, 
        borderColor: theme.colors.border.default, 
        borderRadius: theme.borderRadius.lg, 
        gap: theme.spacing.md,
        height: 50, // <-- SET EXPLICIT HEIGHT
        ...theme.shadows.elegant,
    },
    dateTimeText: { 
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text.primary,
        letterSpacing: -0.2,
    },
    fieldContainer: { marginBottom: theme.spacing.lg },
    fieldLabel: { 
        fontSize: theme.typography.sizes.md, 
        fontWeight: theme.typography.weights.medium, 
        color: theme.colors.text.secondary, 
        marginBottom: theme.spacing.md,
        letterSpacing: 0.2,
    },
    required: { color: theme.colors.primary },
    textInput: { 
        borderWidth: 1, 
        borderColor: theme.colors.border.default, 
        borderRadius: theme.borderRadius.lg, 
        paddingHorizontal: theme.spacing.lg,
        fontSize: theme.typography.sizes.md,
        backgroundColor: theme.colors.white, 
        color: theme.colors.text.primary,
        height: 50, // <-- SET EXPLICIT HEIGHT
        ...theme.shadows.elegant,
    },
    textArea: { 
        borderWidth: 1, 
        borderColor: theme.colors.border.default, 
        borderRadius: theme.borderRadius.lg, 
        paddingVertical: theme.spacing.md, // Keep vertical padding for multi-line
        paddingHorizontal: theme.spacing.lg,
        fontSize: theme.typography.sizes.md,
        backgroundColor: theme.colors.white, 
        color: theme.colors.text.primary, 
        minHeight: 120, // Keep minHeight for multi-line
        textAlignVertical: 'top',
        ...theme.shadows.elegant,
    },
    inputError: { borderColor: theme.colors.error, backgroundColor: '#fef2f0' },
    errorText: { 
        fontSize: theme.typography.sizes.sm, 
        color: theme.colors.error, 
        marginTop: theme.spacing.sm,
        fontWeight: theme.typography.weights.medium,
    },
    selectContainer: { gap: theme.spacing.sm },
    optionButton: { 
        borderWidth: 1, 
        borderColor: theme.colors.border.default, 
        borderRadius: theme.borderRadius.lg, 
        backgroundColor: theme.colors.white,
        ...theme.shadows.elegant,
    },
    optionButtonSelected: { 
        borderColor: theme.colors.primary, 
        backgroundColor: theme.colors.primaryGhost,
        borderWidth: 2,
    },
    optionContent: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
        height: 50, // <-- SET EXPLICIT HEIGHT
    },
    optionText: { 
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text.primary, 
        fontWeight: theme.typography.weights.regular, 
        flex: 1,
        letterSpacing: -0.2,
    },
    optionTextSelected: { 
        color: theme.colors.primary,
        fontWeight: theme.typography.weights.medium,
    },
    priceContainer: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
    priceText: { fontSize: theme.typography.sizes.sm, color: theme.colors.text.secondary, fontWeight: theme.typography.weights.medium },
    priceSection: { marginVertical: theme.spacing.xl },
    totalPriceContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white, 
        borderRadius: theme.borderRadius.xl, 
        borderWidth: 1, 
        borderColor: theme.colors.border.subtle,
        ...theme.shadows.soft,
    },
    totalPriceLabel: { 
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.regular, 
        color: theme.colors.text.tertiary,
        letterSpacing: -0.2,
    },
    totalPriceValue: { 
        fontSize: 28,
        fontWeight: theme.typography.weights.light, 
        color: theme.colors.primary,
        letterSpacing: -0.8,
    },
    submitContainer: { 
        paddingTop: theme.spacing.lg,
    },
    successHeader: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    successScrollContainer: {
        flex: 1,
    },
    successScrollContent: {
        padding: theme.spacing.md,
    },
    successTitle: { 
        fontSize: 22,
        fontWeight: theme.typography.weights.medium, 
        color: theme.colors.text.primary, 
        marginTop: theme.spacing.md, 
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    successMessage: { 
        fontSize: theme.typography.sizes.sm, 
        color: theme.colors.text.tertiary, 
        textAlign: 'center', 
        marginTop: theme.spacing.sm, 
        lineHeight: 20,
        paddingHorizontal: theme.spacing.sm,
    },
    successDetails: { 
        backgroundColor: theme.colors.white, 
        borderRadius: theme.borderRadius.lg, 
        borderWidth: 1, 
        borderColor: theme.colors.border.subtle,
        overflow: 'hidden',
        ...theme.shadows.elegant,
    },
    successDetailItem: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },
    successDetailLabel: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.text.muted,
        fontWeight: theme.typography.weights.medium,
        flex: 0.4,
    },
    successDetailValue: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.text.primary,
        fontWeight: theme.typography.weights.regular,
        flex: 0.6,
        textAlign: 'right',
        lineHeight: 18,
    },
    successButtonContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
        backgroundColor: theme.colors.background,
    },
    boldText: { 
        fontWeight: theme.typography.weights.medium,
        letterSpacing: -0.2,
    },
    iosDatePickerActions: {
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.subtle,
        alignItems: 'flex-end',
    },
    iosDatePickerButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    iosDatePickerButtonText: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.medium,
    },
});

const webStyles = {
    dateInput: (hasError: boolean): React.CSSProperties => ({
      border: `1px solid ${hasError ? theme.colors.warning : theme.colors.border.light}`,
      borderRadius: theme.borderRadius.md,
      padding: '0 12px', // Adjust web padding for fixed height
      fontSize: theme.typography.sizes.md,
      backgroundColor: theme.colors.white,
      color: theme.colors.text.primary,
      fontFamily: 'inherit',
      width: '100%',
      boxSizing: 'border-box',
      height: '50px', // Set fixed height for web too
      display: 'flex',
      alignItems: 'center',
    }),
};

export default AppointmentFormScreen;