import React, { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, RefreshControl, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Clock, MapPin, User } from 'lucide-react-native';
// import ApiService from '../../services/apiService'; // Will be used when API is connected
import CustomButton from '../../components/common/Button';
import { Appointment, TabScreenProps } from '../../types';

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
      // Simulate API call with mock data for demo
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
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (Platform.OS === 'web') {
        Alert.alert('Error', 'Failed to load appointments');
      } else {
        Alert.alert('Error', 'Failed to load appointments');
      }
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
          <ActivityIndicator size="large" color="#6366f1" />
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
              <Calendar size={64} color="#d1d5db" />
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
                          <Calendar size={16} color="#6b7280" />
                          <Text style={styles.detailText}>
                            {formatDate(appointment.date)}
                          </Text>
                          <View style={styles.detailSeparator} />
                          <Clock size={16} color="#6b7280" />
                          <Text style={styles.detailText}>
                            {formatTime(appointment.time)}
                          </Text>
                        </View>
                        
                        {appointment.provider && (
                          <View style={styles.detailRow}>
                            <User size={16} color="#6b7280" />
                            <Text style={styles.detailText}>
                              {appointment.provider}
                            </Text>
                          </View>
                        )}

                        {appointment.location && (
                          <View style={styles.detailRow}>
                            <MapPin size={16} color="#6b7280" />
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
        <Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  appointmentCount: {
    fontSize: 14,
    color: '#6b7280',
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
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButtonContainer: {
    marginTop: 24,
  },
  appointmentsList: {
    paddingBottom: 80,
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
  },
  cardContent: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appointmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  appointmentDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailSeparator: {
    width: 4,
    height: 4,
    backgroundColor: '#9ca3af',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#6366f1',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AppointmentScreen;