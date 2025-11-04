import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Image,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHtml from 'react-native-render-html';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import ApiService from '../../services/apiService';
import { Event } from '../../types';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

interface EventDetailScreenProps {
  navigation: any;
  route: {
    params: {
      eventId: string;
    };
  };
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await ApiService.getUserEvent(eventId);

      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        Alert.alert('Error', 'Failed to load event details');
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', error.message || 'Failed to load event details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await fetchEventDetails();
    setRefreshing(false);
  }, [eventId]);

  const handleJoinEvent = async (): Promise<void> => {
    if (!event) return;

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to join this event?');
      if (!confirmed) return;
    } else {
      Alert.alert(
        'Join Event',
        'Are you sure you want to join this event?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Join', onPress: () => proceedJoinEvent() },
        ]
      );
      return;
    }

    await proceedJoinEvent();
  };

  const proceedJoinEvent = async (): Promise<void> => {
    try {
      setActionLoading(true);
      const response = await ApiService.joinEvent(eventId);
      if (response.success) {
        Alert.alert('Success', 'You have successfully joined this event!');
        await fetchEventDetails();
      }
    } catch (error: any) {
      console.error('Error joining event:', error);
      Alert.alert('Error', error.message || 'Failed to join event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async (): Promise<void> => {
    if (!event) return;

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to leave this event?');
      if (!confirmed) return;
    } else {
      Alert.alert(
        'Leave Event',
        'Are you sure you want to leave this event?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => proceedLeaveEvent() },
        ]
      );
      return;
    }

    await proceedLeaveEvent();
  };

  const proceedLeaveEvent = async (): Promise<void> => {
    try {
      setActionLoading(true);
      const response = await ApiService.leaveEvent(eventId);
      if (response.success) {
        Alert.alert('Success', 'You have left this event');
        await fetchEventDetails();
      }
    } catch (error: any) {
      console.error('Error leaving event:', error);
      Alert.alert('Error', error.message || 'Failed to leave event');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const isUserJoined = (): boolean => {
    if (!event || !event.participants || !user) return false;
    return event.participants.some(participant => participant.id === user.id);
  };

  const checkIfPastEvent = (event: Event): boolean => {
    // If API provides is_past, use it
    if (event.is_past !== undefined) {
      return event.is_past;
    }

    // Otherwise calculate it
    const eventDate = new Date(event.event_date);
    const now = new Date();

    // Reset time to midnight for date-only comparison
    const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return eventDateOnly < nowDateOnly;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <WebSafeIcon name="ChevronLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading event...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <WebSafeIcon name="ChevronLeft" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const joined = isUserJoined();
  const isFull = event.is_full && !joined;
  const isPast = checkIfPastEvent(event);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <WebSafeIcon name="ChevronLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.headerRight} />
      </View>

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
        {/* Featured Image */}
        {event.featured_image_url && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: event.featured_image_url }}
              style={styles.featuredImage}
              resizeMode="cover"
            />
            {joined && (
              <View style={styles.joinedBadgeOverlay}>
                <View style={styles.joinedBadge}>
                  <WebSafeIcon name="Check" size={16} color={theme.colors.white} />
                  <Text style={styles.joinedBadgeText}>Joined</Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{event.title}</Text>
            {event.status && (
              <View style={[
                styles.statusBadge,
                event.status === 'published' && styles.statusPublished,
                event.status === 'cancelled' && styles.statusCancelled,
              ]}>
                <Text style={styles.statusText}>{event.status}</Text>
              </View>
            )}
          </View>

          {/* Event Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <WebSafeIcon name="Calendar" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {event.formatted_event_date || formatDate(event.event_date)}
                </Text>
              </View>
            </View>

            {event.event_time && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <WebSafeIcon name="Clock" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>
                    {event.formatted_event_time || formatTime(event.event_time)}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <WebSafeIcon name="MapPin" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
              </View>
            </View>

            {event.max_participants && (
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <View style={styles.infoIconContainer}>
                  <WebSafeIcon name="Users" size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Participants</Text>
                  <Text style={styles.infoValue}>
                    {event.current_participants} / {event.max_participants}
                    {event.available_slots !== null && event.available_slots !== undefined &&
                      ` (${event.available_slots} spots left)`}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Description Section */}
          {event.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <View style={styles.descriptionCard}>
                <RenderHtml
                  contentWidth={width - (theme.spacing.md * 4)}
                  source={{ html: event.description }}
                  tagsStyles={{
                    body: {
                      fontSize: theme.typography.sizes.md,
                      color: theme.colors.text.secondary,
                      lineHeight: 22,
                      letterSpacing: -0.1,
                      margin: 0,
                      padding: 0,
                    },
                    p: {
                      margin: 0,
                      marginBottom: theme.spacing.sm,
                    },
                    h1: {
                      fontSize: theme.typography.sizes.xl,
                      fontWeight: theme.typography.weights.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    },
                    h2: {
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    },
                    h3: {
                      fontSize: theme.typography.sizes.md,
                      fontWeight: theme.typography.weights.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.xs,
                    },
                    ul: {
                      marginBottom: theme.spacing.sm,
                      paddingLeft: theme.spacing.md,
                    },
                    ol: {
                      marginBottom: theme.spacing.sm,
                      paddingLeft: theme.spacing.md,
                    },
                    li: {
                      marginBottom: theme.spacing.xs,
                    },
                    a: {
                      color: theme.colors.primary,
                      textDecorationLine: 'underline',
                    },
                    strong: {
                      fontWeight: theme.typography.weights.medium,
                      color: theme.colors.text.primary,
                    },
                    em: {
                      fontStyle: 'italic',
                    },
                  }}
                />
              </View>
            </View>
          )}

          {/* Gallery Section */}
          {event.gallery_urls && event.gallery_urls.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.galleryScroll}
              >
                {event.gallery_urls.map((url, index) => (
                  <View key={index} style={styles.galleryImageContainer}>
                    <Image
                      source={{ uri: url }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Participants Section */}
          {event.participants && event.participants.length > 0 && joined && (
            <View style={styles.participantsSection}>
              <Text style={styles.sectionTitle}>Participants ({event.participants.length})</Text>
              <View style={styles.participantsCard}>
                {event.participants.map((participant, index) => (
                  <View
                    key={participant.id}
                    style={[
                      styles.participantRow,
                      index === event.participants!.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    <View style={styles.participantAvatar}>
                      <Text style={styles.participantAvatarText}>
                        {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>{participant.name}</Text>
                      <Text style={styles.participantEmail}>{participant.email}</Text>
                    </View>
                    {participant.id === user?.id && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>You</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      {!isPast && (
        <View style={styles.actionContainer}>
          {joined ? (
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveEvent}
              disabled={actionLoading}
              activeOpacity={0.7}
            >
              {actionLoading ? (
                <ActivityIndicator color={theme.colors.text.secondary} />
              ) : (
                <>
                  <WebSafeIcon name="X" size={18} color={theme.colors.text.secondary} />
                  <Text style={styles.leaveButtonText}>Leave Event</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.joinButton, (isFull || actionLoading) && styles.disabledButton]}
              onPress={handleJoinEvent}
              disabled={isFull || actionLoading}
              activeOpacity={0.7}
            >
              {actionLoading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <WebSafeIcon
                    name={isFull ? "X" : "Check"}
                    size={18}
                    color={isFull ? theme.colors.text.muted : theme.colors.white}
                  />
                  <Text style={isFull ? styles.disabledButtonText : styles.joinButtonText}>
                    {isFull ? 'Event Full' : 'Join Event'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
  },
  headerRight: {
    width: 40,
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
  errorText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.muted,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  joinedBadgeOverlay: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.success,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.soft,
  },
  joinedBadgeText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  content: {
    padding: theme.spacing.md,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
  },
  statusPublished: {
    backgroundColor: '#dcfce7',
  },
  statusCancelled: {
    backgroundColor: '#fef2f0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadows.elegant,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.regular,
    letterSpacing: -0.1,
  },
  descriptionSection: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.2,
  },
  descriptionCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.elegant,
  },
  gallerySection: {
    marginBottom: theme.spacing.md,
  },
  galleryScroll: {
    marginLeft: -theme.spacing.md,
    paddingLeft: theme.spacing.md,
  },
  galleryImageContainer: {
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.soft,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: theme.borderRadius.lg,
  },
  participantsSection: {
    marginBottom: theme.spacing.md,
  },
  participantsCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    ...theme.shadows.elegant,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  participantAvatarText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  participantEmail: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  youBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.primaryGhost,
    borderRadius: theme.borderRadius.sm,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  actionContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    ...theme.shadows.light,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
  },
  joinButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
    letterSpacing: -0.1,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  leaveButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    letterSpacing: -0.1,
  },
  disabledButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  disabledButtonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    letterSpacing: -0.1,
  },
});

export default EventDetailScreen;
