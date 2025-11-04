import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import ApiService from '../../services/apiService';
import { Event, TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const EventListScreen: React.FC<TabScreenProps<'Events'>> = ({ navigation }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

  useEffect(() => {
    fetchEvents();
    setIsInitialMount(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isInitialMount) {
        fetchEvents();
      }
    });

    return unsubscribe;
  }, [navigation, isInitialMount]);

  const fetchEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ApiService.getUserEvents();

      if (response.success && response.data) {
        // Add computed fields if they're not in the API response
        const enrichedEvents = response.data.map((event: Event) => {
          const eventDate = new Date(event.event_date);
          const now = new Date();

          // Reset time to midnight for date-only comparison
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

          // Event is upcoming if it's today or in the future
          const isUpcoming = eventDateOnly >= nowDateOnly;
          const isPast = eventDateOnly < nowDateOnly;

          return {
            ...event,
            is_upcoming: event.is_upcoming !== undefined ? event.is_upcoming : isUpcoming,
            is_past: event.is_past !== undefined ? event.is_past : isPast,
            is_full: event.is_full !== undefined ? event.is_full :
              (event.max_participants !== null && event.current_participants >= event.max_participants),
            available_slots: event.available_slots !== undefined ? event.available_slots :
              (event.max_participants !== null ? Math.max(0, event.max_participants - event.current_participants) : null),
          };
        });
        setEvents(enrichedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const handleJoinEvent = async (eventId: string): Promise<void> => {
    try {
      const response = await ApiService.joinEvent(eventId);
      if (response.success) {
        await fetchEvents();
      }
    } catch (error: any) {
      console.error('Error joining event:', error);
      alert(error.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (eventId: string): Promise<void> => {
    try {
      const response = await ApiService.leaveEvent(eventId);
      if (response.success) {
        await fetchEvents();
      }
    } catch (error: any) {
      console.error('Error leaving event:', error);
      alert(error.message || 'Failed to leave event');
    }
  };

  const isUserJoined = (event: Event): boolean => {
    if (!event.participants || !user) return false;
    return event.participants.some(participant => participant.id === user.id);
  };

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

  const formatTime = (timeString?: string | null): string => {
    if (!timeString) return '';

    let timeToFormat = timeString;
    if (timeString.includes('T')) {
      timeToFormat = timeString.split('T')[1]?.substring(0, 5) || timeString;
    }

    const [hours, minutes] = timeToFormat.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderEventItem = (event: Event) => {
    const joined = isUserJoined(event);
    const isFull = event.is_full && !joined;
    const isPast = event.is_past;

    return (
      <TouchableOpacity
        key={event.id}
        style={[styles.eventItem, isPast && styles.eventItemPast]}
        onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
        activeOpacity={0.7}
      >
        <View style={styles.eventIconContainer}>
          <View style={[styles.eventIcon, joined && styles.eventIconJoined]}>
            <WebSafeIcon
              name={joined ? "Check" : "Calendar"}
              size={20}
              color={joined ? theme.colors.white : theme.colors.primary}
            />
          </View>
        </View>

        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {event.title}
            </Text>
            {joined && (
              <View style={styles.joinedBadge}>
                <View style={styles.joinedDot} />
                <Text style={styles.joinedText}>Joined</Text>
              </View>
            )}
            {isFull && !joined && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullText}>Full</Text>
              </View>
            )}
          </View>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <WebSafeIcon name="Calendar" size={12} color={theme.colors.text.secondary} />
              <Text style={styles.detailText}>
                {event.formatted_event_date || formatDate(event.event_date)}
              </Text>
              {event.event_time && (
                <>
                  <View style={styles.detailSeparator} />
                  <WebSafeIcon name="Clock" size={12} color={theme.colors.text.secondary} />
                  <Text style={styles.detailText}>
                    {event.formatted_event_time || formatTime(event.event_time)}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.detailRow}>
              <WebSafeIcon name="MapPin" size={12} color={theme.colors.text.secondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>

            {event.max_participants && (
              <View style={styles.detailRow}>
                <WebSafeIcon name="Users" size={12} color={theme.colors.text.secondary} />
                <Text style={styles.detailText}>
                  {event.current_participants}/{event.max_participants}
                  {event.available_slots !== null && event.available_slots !== undefined &&
                    ` (${event.available_slots} left)`}
                </Text>
              </View>
            )}
          </View>

          {!isPast && (
            <View style={styles.eventActions}>
              {joined ? (
                <TouchableOpacity
                  style={styles.leaveButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleLeaveEvent(event.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.leaveButtonText}>Leave</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.joinButton, isFull && styles.disabledButton]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleJoinEvent(event.id);
                  }}
                  disabled={isFull}
                  activeOpacity={0.7}
                >
                  <Text style={isFull ? styles.disabledButtonText : styles.joinButtonText}>
                    {isFull ? 'Full' : 'Join'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const upcomingEvents = events.filter(event => event.is_upcoming);
  const pastEvents = events.filter(event => event.is_past);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Events" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Events" />

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
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <WebSafeIcon name="Calendar" size={48} color={theme.colors.text.light} />
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptySubtitle}>
              Check back later for upcoming events
            </Text>
          </View>
        ) : (
          <View style={styles.eventsList}>
            {upcomingEvents.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Upcoming Events</Text>
                </View>
                {upcomingEvents.map(renderEventItem)}
              </>
            )}

            {pastEvents.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Past Events</Text>
                </View>
                {pastEvents.map(renderEventItem)}
              </>
            )}
          </View>
        )}
      </ScrollView>
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
  eventsList: {
    paddingVertical: theme.spacing.xs,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  eventItemPast: {
    opacity: 0.6,
  },
  eventIconContainer: {
    marginRight: theme.spacing.sm,
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIconJoined: {
    backgroundColor: theme.colors.success,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  eventTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.primaryGhost,
    borderRadius: theme.borderRadius.sm,
  },
  joinedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.success,
    marginRight: 4,
  },
  joinedText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.success,
  },
  fullBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: '#fef2f0',
    borderRadius: theme.borderRadius.sm,
  },
  fullText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.error,
  },
  eventDetails: {
    gap: 4,
    marginBottom: theme.spacing.sm,
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
  eventActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  joinButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  joinButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  leaveButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  leaveButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  disabledButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  disabledButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
});

export default EventListScreen;
