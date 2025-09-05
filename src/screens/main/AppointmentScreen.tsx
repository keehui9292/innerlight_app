import React, { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, RefreshControl, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import ApiService from '../../services/apiService';
import CustomButton from '../../components/common/Button';
import { Appointment, TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';

interface StatusColors {
  bg: string;
  text: string;
  dot: string;
}

const AppointmentScreen: React.FC<TabScreenProps<'Appointments'>> = ({ navigation, route }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

  useEffect(() => {
    fetchAppointments();
    setIsInitialMount(false);
  }, []);

  // Listen for navigation focus to refresh data when returning from any screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isInitialMount) {
        fetchAppointments();
      }
    });

    return unsubscribe;
  }, [navigation, isInitialMount]);

  const fetchAppointments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response: any = await ApiService.getAppointments();
      
      if (response.success && response.data) {
        // Handle paginated response format - data is inside response.data.data
        const appointmentsArray = response.data.data || [];
        
        // Map the appointments to include backward-compatible fields
        const mappedAppointments = appointmentsArray.map((appointment: any) => ({
          ...appointment,
          // Add backward-compatible fields
          title: appointment.appointment_form?.name || 'Appointment',
          description: appointment.form_data?.service_type || appointment.appointment_form?.description || '',
          date: appointment.form_data?.appointment_date || appointment.appointment_date?.split('T')[0] || '',
          time: appointment.form_data?.appointment_time || appointment.appointment_time?.split('T')[1]?.substring(0, 5) || '',
          provider: appointment.form_data?.full_name || 'Provider',
        }));
        
        setAppointments(mappedAppointments);
      } else {
        // Set empty array if API call fails
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Set empty array on error instead of mock data
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    
    // Handle both HH:mm format and full timestamp
    let timeToFormat = timeString;
    if (timeString.includes('T')) {
      // Extract time from timestamp
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
  };

  const getStatusColor = (status: string): StatusColors => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return { 
          bg: theme.colors.primaryGhost, 
          text: theme.colors.success, 
          dot: theme.colors.success 
        };
      case 'pending':
        return { 
          bg: theme.colors.primarySoft, 
          text: theme.colors.primary, 
          dot: theme.colors.primary 
        };
      case 'cancelled':
        return { 
          bg: '#fef2f0', 
          text: theme.colors.error, 
          dot: theme.colors.error 
        };
      default:
        return { 
          bg: theme.colors.border.subtle, 
          text: theme.colors.text.tertiary, 
          dot: theme.colors.text.tertiary 
        };
    }
  };

  const handleBookAppointment = (): void => {
    navigation.navigate('AppointmentForm');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            Loading appointments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Appointments</Text>
            <Text style={styles.subtitle}>Manage your schedule</Text>
            <Text style={styles.appointmentCount}>
              {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {appointments.length === 0 ? (
            // Empty state
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <WebSafeIcon name="Calendar" size={48} color={theme.colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                Your schedule awaits
              </Text>
              <Text style={styles.emptySubtitle}>
                Begin your wellness journey by booking your first appointment. Our team is ready to support you.
              </Text>
              
              <View style={styles.emptyButtonContainer}>
                <CustomButton
                  title="Book Appointment"
                  onPress={handleBookAppointment}
                  colorScheme="primary"
                  fullWidth
                />
              </View>
            </View>
          ) : (
            // Appointments list
            <View style={styles.appointmentsList}>
              {appointments.map((appointment) => {
                const statusColors = getStatusColor(appointment.status);
                
                return (
                  <TouchableOpacity
                    key={appointment.id}
                    style={styles.appointmentCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
                  >
                    {/* Header with status badge */}
                    <View style={styles.cardHeader}>
                      <View style={styles.appointmentInfo}>
                        <Text style={styles.appointmentTitle}>
                          {appointment.title || appointment.appointment_form?.name || 'Appointment'}
                        </Text>
                        <Text style={styles.appointmentDescription}>
                          {appointment.description || appointment.form_data?.service_type || ''}
                        </Text>
                      </View>
                      
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

                    {/* Details */}
                    <View style={styles.detailsContainer}>
                      <View style={styles.detailRow}>
                        <WebSafeIcon name="Calendar" size={14} color={theme.colors.text.secondary} />
                        <Text style={styles.detailText}>
                          {formatDate(appointment.date || appointment.form_data?.appointment_date || '')}
                        </Text>
                        <View style={styles.detailSeparator} />
                        <WebSafeIcon name="Clock" size={14} color={theme.colors.text.secondary} />
                        <Text style={styles.detailText}>
                          {formatTime(appointment.time || appointment.form_data?.appointment_time || '')}
                        </Text>
                      </View>
                      
                      {(appointment.form_data?.full_name || appointment.provider) && (
                        <View style={styles.detailRow}>
                          <WebSafeIcon name="User" size={14} color={theme.colors.text.secondary} />
                          <Text style={styles.detailText}>
                            {appointment.form_data?.full_name || appointment.provider}
                          </Text>
                        </View>
                      )}

                      {appointment.total_price && parseFloat(appointment.total_price) > 0 && (
                        <View style={styles.detailRow}>
                          <WebSafeIcon name="DollarSign" size={14} color={theme.colors.text.secondary} />
                          <Text style={styles.detailText}>
                            ${parseFloat(appointment.total_price).toFixed(2)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleBookAppointment}
        activeOpacity={0.8}
      >
        <WebSafeIcon name="Plus" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.regular,
  },
  appointmentCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    backgroundColor: theme.colors.primaryGhost,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xxl,
    marginTop: theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.weights.medium,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xxl,
    maxWidth: 280,
  },
  emptyButtonContainer: {
    width: '100%',
    maxWidth: 240,
  },
  appointmentsList: {
    paddingBottom: 100,
    gap: theme.spacing.sm,
  },
  appointmentCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    gap: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  appointmentInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
    maxWidth: '70%',
  },
  appointmentTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
    marginBottom: 2,
    flexShrink: 1,
    lineHeight: 20,
  },
  appointmentDescription: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    lineHeight: 14,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    flexShrink: 0,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'capitalize',
    letterSpacing: 0,
  },
  detailsContainer: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.regular,
  },
  detailSeparator: {
    width: 2,
    height: 2,
    backgroundColor: theme.colors.text.light,
    borderRadius: 1,
    marginHorizontal: 4,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.light,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
});

export default AppointmentScreen;