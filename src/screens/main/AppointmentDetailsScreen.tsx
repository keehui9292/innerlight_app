import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';
import { Appointment } from '../../types';
import * as ExpoCalendar from 'expo-calendar';
import Header from '../../components/common/Header';
import ApiService from '../../services/apiService';
import WebSafeIcon from '../../components/common/WebSafeIcon';
interface AppointmentDetailsScreenProps {
  navigation: any;
  route: any;
}

const AppointmentDetailsScreen: React.FC<AppointmentDetailsScreenProps> = ({ navigation, route }) => {
  const { appointment: initialAppointment } = route.params || {};
  const [appointment, setAppointment] = useState<Appointment>(initialAppointment);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true);
  const appointmentId = initialAppointment?.id;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initial data fetch
  useEffect(() => {
    fetchAppointmentDetails();
    setIsInitialMount(false);
  }, [appointmentId]);

  // Auto-refresh appointment data when mou_status is pending
  useEffect(() => {
    if (appointment?.mou_status === 'pending') {
      intervalRef.current = setInterval(() => {
        refreshAppointmentData();
      }, 5000); // Refresh every 5 seconds
    }

    // Cleanup interval when component unmounts or mou_status changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [appointment?.mou_status, appointmentId]);

  // Also listen for navigation focus to refresh data when returning to screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (appointmentId && !isInitialMount) {
        refreshAppointmentData();
      }
    });

    return unsubscribe;
  }, [navigation, appointmentId, isInitialMount]);

  const fetchAppointmentDetails = async () => {
    if (!appointmentId) return;

    try {
      setLoading(true);
      const response = await ApiService.getAppointment(appointmentId);
      if (response.success && response.data) {
        setAppointment(response.data);
        
        // Clear interval if MOU status changed from pending
        if (response.data.mou_status !== 'pending' && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAppointmentData = async () => {
    await fetchAppointmentDetails();
  };
  
  if (loading && !appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Loading..." />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading appointment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Error" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Appointment not found</Text>
          <CustomButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return { bg: theme.colors.primaryGhost, text: theme.colors.success, dot: theme.colors.success };
      case 'pending':
      case 'pending payment':
        return { bg: theme.colors.primarySoft, text: theme.colors.primary, dot: theme.colors.primary };
      case 'cancelled':
        return { bg: '#fef2f0', text: theme.colors.error, dot: theme.colors.error };
      default:
        return { bg: theme.colors.border.subtle, text: theme.colors.text.tertiary, dot: theme.colors.text.tertiary };
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return 'Not set';
    
    try {
      // Handle both HH:mm format and full timestamp
      let timeToFormat = timeString;
      if (timeString.includes('T')) {
        timeToFormat = timeString.split('T')[1]?.substring(0, 5) || timeString;
      }
      
      const [hours, minutes] = timeToFormat.split(':');
      if (!hours || !minutes) return timeString;
      
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  const addToCalendar = async () => {
    try {
      // Check if we have appointment date and time
      const appointmentDate = appointment.form_data?.appointment_date || appointment.date;
      const appointmentTime = appointment.form_data?.appointment_time || appointment.time;
      
      if (!appointmentDate || !appointmentTime) {
        Alert.alert('Error', 'Appointment date or time is missing');
        return;
      }

      // Web platform - create downloadable .ics file
      if (Platform.OS === 'web') {
        const eventDate = new Date(appointmentDate + 'T' + appointmentTime + ':00');
        const endDate = new Date(eventDate.getTime() + (60 * 60 * 1000)); // Add 1 hour
        
        // Format dates for ICS format (YYYYMMDDTHHMMSSZ)
        const formatDateForICS = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const startDateICS = formatDateForICS(eventDate);
        const endDateICS = formatDateForICS(endDate);
        
        // Create ICS file content
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Innerlight Community//EN',
          'BEGIN:VEVENT',
          `UID:${appointment.id}@innerlight.community`,
          `DTSTART:${startDateICS}`,
          `DTEND:${endDateICS}`,
          `SUMMARY:${appointment.appointment_form?.name || appointment.title || 'Appointment'}`,
          `DESCRIPTION:Service: ${appointment.form_data?.service_type || ''}\\nName: ${appointment.form_data?.full_name || ''}\\nEmail: ${appointment.form_data?.email || ''}\\nPhone: ${appointment.form_data?.phone || ''}\\nNotes: ${appointment.form_data?.notes || ''}`,
          'BEGIN:VALARM',
          'TRIGGER:-PT1H',
          'DESCRIPTION:Appointment Reminder',
          'ACTION:DISPLAY',
          'END:VALARM',
          'BEGIN:VALARM',
          'TRIGGER:-PT15M',
          'DESCRIPTION:Appointment Starting Soon',
          'ACTION:DISPLAY',
          'END:VALARM',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\\r\\n');

        // Create and download the file
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `appointment-${appointmentDate}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        Alert.alert('Success', 'Calendar event file downloaded! Open it to add to your calendar.');
        return;
      }

      // Mobile platforms - use Expo Calendar
      // Request calendar permissions
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Calendar access is required to add reminders');
        return;
      }

      // Get default calendar
      const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.source.name === 'Default') || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar available');
        return;
      }

      // Create event date
      const eventDate = new Date(appointmentDate + 'T' + appointmentTime + ':00');
      const endDate = new Date(eventDate.getTime() + (60 * 60 * 1000)); // Add 1 hour

      // Create calendar event
      const eventId = await ExpoCalendar.createEventAsync(defaultCalendar.id, {
        title: `${appointment.appointment_form?.name || appointment.title || 'Appointment'}`,
        notes: `Service: ${appointment.form_data?.service_type || ''}\nName: ${appointment.form_data?.full_name || ''}\nEmail: ${appointment.form_data?.email || ''}\nPhone: ${appointment.form_data?.phone || ''}\nNotes: ${appointment.form_data?.notes || ''}`,
        startDate: eventDate,
        endDate: endDate,
        timeZone: 'default',
        alarms: [
          { relativeOffset: -60 }, // 1 hour before
          { relativeOffset: -15 }   // 15 minutes before
        ]
      });

      if (eventId) {
        Alert.alert('Success', 'Appointment added to your calendar with reminders!');
      }
    } catch (error) {
      console.error('Error adding to calendar:', error);
      Alert.alert('Error', 'Failed to add appointment to calendar');
    }
  };

  const handleSignMOU = () => {
    if (!appointment.mou_link) {
      Alert.alert('Error', 'MOU link is not available');
      return;
    }

    // Navigate to WebView screen instead of opening external browser
    navigation.navigate('WebView', {
      url: appointment.mou_link,
      title: 'Sign MOU'
    });
  };

  const handleContinuePayment = async () => {
    if (!appointment.payment_url) {
      Alert.alert('Error', 'Payment URL is not available');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(appointment.payment_url);
      if (canOpen) {
        await Linking.openURL(appointment.payment_url);
      } else {
        Alert.alert('Error', 'Cannot open payment URL');
      }
    } catch (error) {
      console.error('Error opening payment URL:', error);
      Alert.alert('Error', 'Failed to open payment page');
    }
  };

  const renderFormDataItem = (key: string, value: any) => {
    if (!value || value === null) return null;

    const getIconForKey = (key: string) => {
      switch (key.toLowerCase()) {
        case 'full_name':
        case 'name':
          return <WebSafeIcon name="User" size={16} color={theme.colors.text.secondary} />;
        case 'email':
          return <WebSafeIcon name="Mail" size={16} color={theme.colors.text.secondary} />;
        case 'phone':
          return <WebSafeIcon name="Phone" size={16} color={theme.colors.text.secondary} />;
        case 'appointment_date':
          return <WebSafeIcon name="Calendar" size={16} color={theme.colors.text.secondary} />;
        case 'appointment_time':
          return <WebSafeIcon name="Clock" size={16} color={theme.colors.text.secondary} />;
        case 'notes':
          return <WebSafeIcon name="FileText" size={16} color={theme.colors.text.secondary} />;
        default:
          return <WebSafeIcon name="FileText" size={16} color={theme.colors.text.secondary} />;
      }
    };

    const formatLabel = (key: string): string => {
      return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatValue = (key: string, value: any): string => {
      if (key === 'appointment_date') {
        return formatDate(value);
      }
      if (key === 'appointment_time') {
        return formatTime(value);
      }
      return String(value);
    };

    return (
      <View key={key} style={styles.formDataItem}>
        <View style={styles.formDataIcon}>
          {getIconForKey(key)}
        </View>
        <View style={styles.formDataContent}>
          <Text style={styles.formDataLabel}>{formatLabel(key)}</Text>
          <Text style={styles.formDataValue}>{formatValue(key, value)}</Text>
        </View>
      </View>
    );
  };

  // Use payment_status for display instead of status
  const displayStatus = appointment.payment_status || appointment.status;
  const statusColors = getStatusColor(displayStatus);
  const appointmentDate = appointment.form_data?.appointment_date || appointment.date;
  const appointmentTime = appointment.form_data?.appointment_time || appointment.time;
  const hasDateAndTime = appointmentDate && appointmentTime;
  const isPendingPayment = appointment.payment_status?.toLowerCase() === 'pending';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header
        title={'Book Appointment'}
      />

      <View style={styles.scrollContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Appointment Info Card */}
        <View style={styles.appointmentCard}>
          {/* Status Badge - Top Right */}
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: statusColors.bg,
                borderColor: statusColors.text + '20'
              }
            ]}>
              <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {displayStatus}
              </Text>
            </View>
          </View>
          
          {/* Appointment Info */}
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>
              {appointment.appointment_form?.name || appointment.title || 'Appointment'}
            </Text>
            <Text style={styles.appointmentDescription}>
              {appointment.form_data?.service_type || appointment.description || ''}
            </Text>
          </View>

          {/* Price Display */}
          {appointment.total_price && parseFloat(appointment.total_price) > 0 && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Amount</Text>
              <Text style={styles.priceValue}>
                ${parseFloat(appointment.total_price).toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Form Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.formDataContainer}>
            {appointment.form_data && Object.entries(appointment.form_data).map(([key, value]) => 
              renderFormDataItem(key, value)
            )}
            
            {/* Show appointment ID */}
            <View style={styles.formDataItem}>
              <View style={styles.formDataIcon}>
                <WebSafeIcon name="FileText" size={16} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.formDataContent}>
                <Text style={styles.formDataLabel}>Appointment ID</Text>
                <Text style={styles.formDataValue}>{appointment.id.substring(0, 8)}...</Text>
              </View>
            </View>

            {/* Show creation date */}
            <View style={styles.formDataItem}>
              <View style={styles.formDataIcon}>
                <WebSafeIcon name="Calendar" size={16} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.formDataContent}>
                <Text style={styles.formDataLabel}>Created</Text>
                <Text style={styles.formDataValue}>
                  {new Date(appointment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Button - Show if payment is pending */}
        {isPendingPayment && appointment.payment_url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <CustomButton
              onPress={handleContinuePayment}
              colorScheme="primary"
              fullWidth
            >
              <View style={styles.buttonContent}>
                <WebSafeIcon name="CreditCard" size={16} color={theme.colors.white} />
                <Text style={styles.paymentButtonText}>Continue Payment</Text>
              </View>
            </CustomButton>
            <Text style={styles.paymentHintText}>
              Complete your payment to confirm the appointment
            </Text>
          </View>
        )}

        {/* Calendar Reminder Button */}
        {hasDateAndTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <CustomButton
              onPress={addToCalendar}
              colorScheme="secondary"
              fullWidth
            >
              <View style={styles.buttonContent}>
                <WebSafeIcon name="Plus" size={16} color={theme.colors.primary} />
                <Text style={styles.calendarButtonText}>Add to Calendar</Text>
              </View>
            </CustomButton>
          </View>
        )}

        {/* Sign MOU Button */}
        {appointment.mou_link && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MOU Signing</Text>
            <CustomButton
              title={appointment.mou_status === 'signed' ? 'You already signed this MOU' : 'Sign MOU Now'}
              onPress={handleSignMOU}
              colorScheme="primary"
              fullWidth
              disabled={appointment.mou_status !== 'pending'}
            />
            {appointment.mou_status !== 'pending' && (
              <Text style={styles.mouDisabledText}>
                MOU signing will be available once your appointment is confirmed
              </Text>
            )}
            {appointment.mou_status === 'pending' && (
              <Text style={styles.mouEnabledText}>
                Your MOU is ready for signing. Click the button above to proceed.
              </Text>
            )}
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
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    height: 70,
    zIndex: 10,
    flexShrink: 0,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 70, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.elegant,
  },
  statusContainer: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
  },
  appointmentInfo: {
    width: '100%',
    paddingTop: theme.spacing.xs,
    paddingRight: 100, // Space for status badge
    marginBottom: theme.spacing.sm,
  },
  appointmentTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  appointmentDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: 9,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.1,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    marginTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  priceLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.tertiary,
    letterSpacing: -0.2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    letterSpacing: -0.4,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.2,
  },
  formDataContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    ...theme.shadows.elegant,
  },
  formDataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  formDataIcon: {
    marginRight: theme.spacing.md,
    marginTop: 1,
    width: 18,
    alignItems: 'center',
  },
  formDataContent: {
    flex: 1,
  },
  formDataLabel: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: theme.typography.weights.medium,
  },
  formDataValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  calendarButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  paymentButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  paymentHintText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 18,
  },
  mouDisabledText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 18,
  },
  mouEnabledText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 18,
    fontWeight: theme.typography.weights.medium,
  },
});

export default AppointmentDetailsScreen;