import React, { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, RefreshControl, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Clock, MapPin, User } from 'lucide-react-native';
import ApiService from '../../services/apiService';
import CustomButton from '../../components/common/Button';
import { Appointment, TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';

interface StatusColors {
  bg: string;
  text: string;
  dot: string;
}

const AppointmentScreen: React.FC<TabScreenProps<'Appointments'>> = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ApiService.getAppointments();
      
      if (response.success && response.data) {
        setAppointments(response.data);
      } else {
        // Fallback to mock data for demo if API is not available
        const mockAppointments: Appointment[] = [
          {
            id: '1',
            title: 'Wellness Consultation',
            description: 'Initial wellness assessment and planning session',
            date: new Date().toISOString().split('T')[0],
            time: '10:00',
            status: 'confirmed',
            provider: 'Dr. Sarah Johnson',
            location: 'Innerlight Center - Room 101'
          },
          {
            id: '2',
            title: 'Follow-up Session',
            description: 'Progress review and adjustment session',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:30',
            status: 'pending',
            provider: 'Dr. Sarah Johnson',
            location: 'Innerlight Center - Room 203'
          }
        ];
        setAppointments(mockAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Fallback to mock data for demo
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          title: 'Wellness Consultation',
          description: 'Initial wellness assessment and planning session',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          status: 'confirmed',
          provider: 'Dr. Sarah Johnson',
          location: 'Innerlight Center - Room 101'
        }
      ];
      setAppointments(mockAppointments);
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
    const [hours, minutes] = timeString.split(':');
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
        return { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' };
      case 'pending':
        return { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' };
      case 'cancelled':
        return { bg: '#fecaca', text: '#dc2626', dot: '#ef4444' };
      default:
        return { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
    }
  };

  const handleBookAppointment = (): void => {
    Alert.alert('Coming Soon', 'Appointment booking feature will be available soon!');
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
          <Text style={styles.title}>
            My Appointments
          </Text>
          <Text style={styles.appointmentCount}>
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
          </Text>
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
              <Calendar size={64} color={theme.colors.text.light} />
              <Text style={styles.emptyTitle}>
                No appointments scheduled
              </Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to book your first appointment with our wellness team
              </Text>
              
              <View style={styles.emptyButtonContainer}>
                <CustomButton
                  title="Book First Appointment"
                  onPress={handleBookAppointment}
                  size="md"
                  colorScheme="primary"
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
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardContent}>
                      {/* Header */}
                      <View style={styles.cardHeader}>
                        <View style={styles.appointmentInfo}>
                          <Text style={styles.appointmentTitle}>
                            {appointment.title}
                          </Text>
                          <Text style={styles.appointmentDescription}>
                            {appointment.description}
                          </Text>
                        </View>
                        
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                          <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                          <Text style={[styles.statusText, { color: statusColors.text }]}>
                            {appointment.status}
                          </Text>
                        </View>
                      </View>

                      {/* Details */}
                      <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                          <Calendar size={16} color={theme.colors.text.secondary} />
                          <Text style={styles.detailText}>
                            {formatDate(appointment.date)}
                          </Text>
                          <View style={styles.detailSeparator} />
                          <Clock size={16} color={theme.colors.text.secondary} />
                          <Text style={styles.detailText}>
                            {formatTime(appointment.time)}
                          </Text>
                        </View>
                        
                        {appointment.provider && (
                          <View style={styles.detailRow}>
                            <User size={16} color={theme.colors.text.secondary} />
                            <Text style={styles.detailText}>
                              {appointment.provider}
                            </Text>
                          </View>
                        )}

                        {appointment.location && (
                          <View style={styles.detailRow}>
                            <MapPin size={16} color={theme.colors.text.secondary} />
                            <Text style={styles.detailText}>
                              {appointment.location}
                            </Text>
                          </View>
                        )}
                      </View>
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
        <Plus size={24} color={theme.colors.white} />
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  appointmentCount: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
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
    paddingVertical: theme.spacing.xxl + theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontWeight: theme.typography.weights.medium,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.light,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  emptyButtonContainer: {
    marginTop: theme.spacing.lg,
  },
  appointmentsList: {
    paddingBottom: 80,
    gap: theme.spacing.md,
  },
  appointmentCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.light,
  },
  cardContent: {
    gap: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appointmentInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  appointmentTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  appointmentDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  detailSeparator: {
    width: 4,
    height: 4,
    backgroundColor: theme.colors.text.muted,
    borderRadius: 2,
    marginHorizontal: theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    ...theme.shadows.medium,
  },
});

export default AppointmentScreen;