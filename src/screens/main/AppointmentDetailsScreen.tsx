import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, FileText, Plus } from 'lucide-react-native';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';
import { Appointment } from '../../types';
import * as ExpoCalendar from 'expo-calendar';
import Header from '../../components/common/Header';
interface AppointmentDetailsScreenProps {
  navigation: any;
  route: any;
}

const AppointmentDetailsScreen: React.FC<AppointmentDetailsScreenProps> = ({ navigation, route }) => {
  const { appointment } = route.params || {};
  
  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
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
        return { bg: theme.colors.primaryGhost, text: theme.colors.success, dot: theme.colors.success };
      case 'pending':
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
    Alert.alert('Coming Soon', 'MOU signing feature will be available soon!');
  };

  const renderFormDataItem = (key: string, value: any) => {
    if (!value || value === null) return null;

    const getIconForKey = (key: string) => {
      switch (key.toLowerCase()) {
        case 'full_name':
        case 'name':
          return <User size={16} color={theme.colors.text.secondary} />;
        case 'email':
          return <Mail size={16} color={theme.colors.text.secondary} />;
        case 'phone':
          return <Phone size={16} color={theme.colors.text.secondary} />;
        case 'appointment_date':
          return <Calendar size={16} color={theme.colors.text.secondary} />;
        case 'appointment_time':
          return <Clock size={16} color={theme.colors.text.secondary} />;
        case 'notes':
          return <FileText size={16} color={theme.colors.text.secondary} />;
        default:
          return <FileText size={16} color={theme.colors.text.secondary} />;
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

  const statusColors = getStatusColor(appointment.status);
  const appointmentDate = appointment.form_data?.appointment_date || appointment.date;
  const appointmentTime = appointment.form_data?.appointment_time || appointment.time;
  const hasDateAndTime = appointmentDate && appointmentTime;

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
                {appointment.status}
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
                <FileText size={16} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.formDataContent}>
                <Text style={styles.formDataLabel}>Appointment ID</Text>
                <Text style={styles.formDataValue}>{appointment.id.substring(0, 8)}...</Text>
              </View>
            </View>

            {/* Show creation date */}
            <View style={styles.formDataItem}>
              <View style={styles.formDataIcon}>
                <Calendar size={16} color={theme.colors.text.secondary} />
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
                <Plus size={16} color={theme.colors.primary} />
                <Text style={styles.calendarButtonText}>Add to Calendar</Text>
              </View>
            </CustomButton>
          </View>
        )}

        {/* Sign MOU Button */}
        <View style={styles.mouSection}>
          <CustomButton
            title="Sign MOU Now"
            onPress={handleSignMOU}
            colorScheme="primary"
            fullWidth
            disabled={true}
          />
          <Text style={styles.mouDisabledText}>
            MOU signing will be available once your appointment is confirmed
          </Text>
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
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.elegant,
  },
  statusContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1,
  },
  appointmentInfo: {
    width: '100%',
    paddingTop: theme.spacing.sm,
    paddingRight: 120, // Space for status badge
    marginBottom: theme.spacing.md,
  },
  appointmentTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.sm,
    lineHeight: 26,
    flexWrap: 'wrap',
  },
  appointmentDescription: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.tertiary,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.tertiary,
    letterSpacing: -0.2,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: theme.typography.weights.light,
    color: theme.colors.primary,
    letterSpacing: -0.8,
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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  formDataIcon: {
    marginRight: theme.spacing.lg,
    marginTop: 2,
    width: 20,
    alignItems: 'center',
  },
  formDataContent: {
    flex: 1,
  },
  formDataLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: theme.typography.weights.medium,
  },
  formDataValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
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
  mouSection: {
  },
  mouDisabledText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 18,
  },
});

export default AppointmentDetailsScreen;