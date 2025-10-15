import React, { useState, useEffect, useCallback } from 'react';
import {
  Platform,
  Alert,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
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

const AppointmentScreen: React.FC<TabScreenProps<'Appointments'>> = ({
  navigation,
  route,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

  useEffect(() => {
    fetchAppointments();
    setIsInitialMount(false);
  }, []);

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
        const appointmentsArray = response.data.data || [];
        const mappedAppointments = appointmentsArray.map((appointment: any) => ({
          ...appointment,
          title: appointment.appointment_form?.name || 'Appointment',
          description:
            appointment.form_data?.service_type ||
            appointment.appointment_form?.description ||
            '',
          date:
            appointment.form_data?.appointment_date ||
            appointment.appointment_date?.split('T')[0] ||
            '',
          time:
            appointment.form_data?.appointment_time ||
            appointment.appointment_time?.split('T')[1]?.substring(0, 5) ||
            '',
          provider: appointment.form_data?.full_name || 'Provider',
        }));
        setAppointments(mappedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
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
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';

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
      hour12: true,
    });
  };

  const getStatusColor = (status: string): StatusColors => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          bg: theme.colors.primaryGhost,
          text: theme.colors.success,
          dot: theme.colors.success,
        };
      case 'pending':
        return {
          bg: theme.colors.primarySoft,
          text: theme.colors.primary,
          dot: theme.colors.primary,
        };
      case 'cancelled':
        return {
          bg: '#fef2f0',
          text: theme.colors.error,
          dot: theme.colors.error,
        };
      default:
        return {
          bg: theme.colors.border.subtle,
          text: theme.colors.text.tertiary,
          dot: theme.colors.text.tertiary,
        };
    }
  };

  const handleBookAppointment = (): void => {
    navigation.navigate('AppointmentForm');
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const statusColors = getStatusColor(appointment.status);

    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('AppointmentDetails', { appointment })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>
              {appointment.title ||
                appointment.appointment_form?.name ||
                'Appointment'}
            </Text>
            <Text style={styles.appointmentDescription}>
              {appointment.description ||
                appointment.form_data?.service_type ||
                ''}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColors.bg,
                borderColor: statusColors.text + '20',
              },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusColors.dot }]}
            />
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {appointment.status}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <WebSafeIcon
              name="Calendar"
              size={14}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.detailText}>
              {formatDate(
                appointment.date || appointment.form_data?.appointment_date || ''
              )}
            </Text>
            <View style={styles.detailSeparator} />
            <WebSafeIcon
              name="Clock"
              size={14}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.detailText}>
              {formatTime(
                appointment.time || appointment.form_data?.appointment_time || ''
              )}
            </Text>
          </View>

          {(appointment.form_data?.full_name || appointment.provider) && (
            <View style={styles.detailRow}>
              <WebSafeIcon
                name="User"
                size={14}
                color={theme.colors.text.secondary}
              />
              <Text style={styles.detailText}>
                {appointment.form_data?.full_name || appointment.provider}
              </Text>
            </View>
          )}

          {appointment.total_price &&
            parseFloat(appointment.total_price) > 0 && (
              <View style={styles.detailRow}>
                <WebSafeIcon
                  name="DollarSign"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.detailText}>
                  ${parseFloat(appointment.total_price).toFixed(2)}
                </Text>
              </View>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Appointments" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Appointments" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {appointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <WebSafeIcon
                name="Calendar"
                size={48}
                color={theme.colors.text.tertiary}
              />
              <Text style={styles.emptyTitle}>Your Schedule Awaits</Text>
              <Text style={styles.emptyMessage}>
                Begin your wellness journey by booking your first appointment.
              </Text>
            </View>
          ) : (
            <View style={styles.appointmentsList}>
              {appointments.map(renderAppointmentCard)}
            </View>
          )}
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  appointmentsList: {
    gap: theme.spacing.sm,
  },
  appointmentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  appointmentInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  appointmentTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    lineHeight: 20,
    marginBottom: 2,
  },
  appointmentDescription: {
    fontSize: theme.typography.sizes.xs,
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
  },
  detailSeparator: {
    width: 2,
    height: 2,
    backgroundColor: theme.colors.text.light,
    borderRadius: 1,
    marginHorizontal: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
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