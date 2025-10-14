import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';
import Header from '../../components/common/Header';
import WebSafeIcon from '../../components/common/WebSafeIcon';

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: Array<{
    value: string;
    label: string;
  }> | null;
}

interface TrackingEntry {
  tracking_date: string;
  tracking_data: Record<string, string> | any[];
  photos: any[];
  notes: string | null;
  created_at: string;
}

interface DailyEntry extends TrackingEntry {
  day_number: number;
}

interface Testimonial {
  id: string;
  user_name?: string;
  template: {
    id: string;
    name: string;
    slug?: string;
    category: string;
    category_label: string;
    has_daily_tracking?: boolean;
    diary_days?: number;
    initial_fields?: FormField[];
    daily_fields?: FormField[];
    initial_input_type?: string;
    daily_input_type?: string;
  };
  status?: string;
  is_public: boolean;
  submitted_at: string;
  approved_at?: string | null;
  created_at?: string;
  form_data: Record<string, any>;
  photos: any[];
  before_after_photos?: any[];
  tracking?: {
    completed_days: number;
    total_days: number;
    progress_percentage: number;
    initial_entry?: TrackingEntry;
    daily_entries: Record<string, DailyEntry>;
  };
}

interface TestimonialDetailsScreenProps {
  navigation: any;
  route: any;
}

const TestimonialDetailsScreen: React.FC<TestimonialDetailsScreenProps> = ({ navigation, route }) => {
  const { testimonial: initialTestimonial } = route.params || {};
  const [testimonial] = useState<Testimonial>(initialTestimonial);

  if (!testimonial) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Testimonial not found</Text>
          <CustomButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return { bg: theme.colors.primaryGhost, text: theme.colors.success, dot: theme.colors.success };
      case 'pending':
        return { bg: theme.colors.primarySoft, text: theme.colors.primary, dot: theme.colors.primary };
      case 'draft':
        return { bg: '#fef2f0', text: theme.colors.error, dot: theme.colors.error };
      default:
        return { bg: theme.colors.border.subtle, text: theme.colors.text.tertiary, dot: theme.colors.text.tertiary };
    }
  };

  const handleDayPress = (dayNumber: number) => {
    // Only allow day navigation for personal testimonials with tracking
    if (!testimonial.tracking) return;

    // Check if this day exists in daily_entries
    const dayEntry = testimonial.tracking.daily_entries[dayNumber.toString()];

    // A day is truly completed only if it has actual tracking data (not empty array)
    const hasActualData = dayEntry && !Array.isArray(dayEntry.tracking_data) &&
                         Object.keys(dayEntry.tracking_data).length > 0;
    const isCompleted = hasActualData;

    // A day is available if it's the next day after completed days or if it exists but has no data
    const nextAvailableDay = testimonial.tracking.completed_days + 1;
    const isAvailable = dayNumber <= nextAvailableDay;

    // Only allow access to completed days or available days
    if (!isCompleted && !isAvailable) {
      return; // Don't navigate if it's not completed or available
    }

    // Prepare data for the day
    const dayData = dayEntry ? {
      day_number: dayNumber,
      initial_data: dayNumber === 1 && testimonial.tracking.initial_entry
        ? (Array.isArray(testimonial.tracking.initial_entry.tracking_data)
           ? {}
           : testimonial.tracking.initial_entry.tracking_data)
        : undefined,
      daily_data: Array.isArray(dayEntry.tracking_data) ? {} : dayEntry.tracking_data,
    } : null;

    console.log('TestimonialDetails navigating with data:', {
      testimonialId: testimonial.id,
      dayNumber,
      isCompleted,
      dayData,
      dayEntry: dayEntry,
    });

    navigation.navigate('DailyQuestions', {
      testimonialId: testimonial.id,
      dayNumber,
      isCompleted,
      dayData,
      template: testimonial.template,
    });
  };

  const renderDayButtons = () => {
    if (!testimonial.template.has_daily_tracking || !testimonial.tracking) return null;

    const days = Array.from({ length: testimonial.template.diary_days }, (_, i) => i + 1);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Tracking</Text>
        <View style={styles.daysContainer}>
          {days.map((dayNumber) => {
            const dayEntry = testimonial.tracking!.daily_entries[dayNumber.toString()];
            const isCompleted = !!dayEntry;
            const nextAvailableDay = testimonial.tracking!.completed_days + 1;
            const isAccessible = isCompleted || dayNumber === nextAvailableDay;
            const isLocked = !isAccessible;

            return (
              <TouchableOpacity
                key={dayNumber}
                style={[
                  styles.dayButton,
                  isCompleted && styles.dayButtonCompleted,
                  dayNumber === nextAvailableDay && !isCompleted && styles.dayButtonAvailable,
                  isLocked && styles.dayButtonLocked,
                ]}
                onPress={() => handleDayPress(dayNumber)}
                activeOpacity={isLocked ? 1 : 0.8}
                disabled={isLocked}
              >
                <Text style={[
                  styles.dayButtonText,
                  isCompleted && styles.dayButtonTextCompleted,
                  dayNumber === nextAvailableDay && !isCompleted && styles.dayButtonTextAvailable,
                  isLocked && styles.dayButtonTextLocked,
                ]}>
                  Day {dayNumber}
                </Text>
                {isCompleted && (
                  <Text style={styles.completedLabel}>Completed</Text>
                )}
                {dayNumber === nextAvailableDay && !isCompleted && (
                  <Text style={styles.availableLabel}>Available</Text>
                )}
                {isLocked && (
                  <Text style={styles.lockedLabel}>Locked</Text>
                )}
                {isCompleted && (
                  <View style={styles.completedIcon}>
                    <WebSafeIcon
                      name="CheckCircle"
                      size={12}
                      color={theme.colors.success}
                    />
                  </View>
                )}
                {isLocked && (
                  <View style={styles.lockedIcon}>
                    <WebSafeIcon
                      name="Lock"
                      size={12}
                      color={theme.colors.text.muted}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const statusColors = getStatusColor(testimonial.status || 'published');
  const isPublicTestimonial = testimonial.is_public && !testimonial.tracking;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header title={isPublicTestimonial ? "Community Story" : "Review Details"} />

      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Testimonial Info Card */}
          <View style={styles.testimonialCard}>
            {/* Status Badge - Top Right for personal testimonials */}
            {!isPublicTestimonial && testimonial.status && (
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
                    {testimonial.status}
                  </Text>
                </View>
              </View>
            )}

            {/* Testimonial Info */}
            <View style={styles.testimonialInfo}>
              <Text style={styles.testimonialTitle}>
                {testimonial.template.name}
              </Text>
              {isPublicTestimonial && testimonial.user_name && (
                <Text style={styles.userNameText}>
                  by {testimonial.user_name}
                </Text>
              )}
              <Text style={styles.testimonialSubmittedDate}>
                {isPublicTestimonial ? 'Shared' : 'Submitted'} on {new Date(
                  isPublicTestimonial
                    ? (testimonial.approved_at || testimonial.created_at || testimonial.submitted_at)
                    : testimonial.submitted_at
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            {/* Progress Display - Only for personal testimonials */}
            {testimonial.template.has_daily_tracking && testimonial.tracking && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Progress</Text>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressValue}>
                    {testimonial.tracking.completed_days} / {testimonial.tracking.total_days} days
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${testimonial.tracking.progress_percentage}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {Math.round(testimonial.tracking.progress_percentage)}%
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Form Data Section - for public testimonials */}
          {isPublicTestimonial && Object.keys(testimonial.form_data).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Testimonial Details</Text>
              <View style={styles.detailsContainer}>
                {Object.entries(testimonial.form_data).map(([key, value]) => {
                  if (key === 'agreed_to_terms' || !value) return null;

                  const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);

                  return (
                    <View key={key} style={styles.detailItem}>
                      <View style={styles.detailIcon}>
                        <WebSafeIcon name="Info" size={16} color={theme.colors.text.secondary} />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>{displayKey}</Text>
                        <Text style={styles.detailValue}>{displayValue}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Daily Tracking Section - Only for personal testimonials */}
          {renderDayButtons()}

          {/* General Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <WebSafeIcon name="FileText" size={16} color={theme.colors.text.secondary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Testimonial ID</Text>
                  <Text style={styles.detailValue}>{testimonial.id.substring(0, 8)}...</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <WebSafeIcon name="Tag" size={16} color={theme.colors.text.secondary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{testimonial.template.category_label}</Text>
                </View>
              </View>

              {!isPublicTestimonial && (
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <WebSafeIcon name="Calendar" size={16} color={theme.colors.text.secondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>
                      {testimonial.template.has_daily_tracking ? 'Daily Tracking' : 'Initial Questions'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
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
  scrollContainer: {
    ...Platform.select({
      web: { position: 'absolute', top: 70, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
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
  testimonialCard: {
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
  testimonialInfo: {
    width: '100%',
    paddingTop: theme.spacing.xs,
    paddingRight: 100, // Space for status badge
    marginBottom: theme.spacing.sm,
  },
  testimonialTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  userNameText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.xs,
  },
  testimonialSubmittedDate: {
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
  progressContainer: {
    paddingTop: theme.spacing.md,
    marginTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  progressLabel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.1,
  },
  progressInfo: {
    gap: theme.spacing.sm,
  },
  progressValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border.subtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    textAlign: 'right',
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
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    justifyContent: 'space-between',
  },
  dayButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minWidth: '30%',
    maxWidth: '32%',
    alignItems: 'center',
    ...theme.shadows.light,
    marginBottom: theme.spacing.xs,
  },
  dayButtonCompleted: {
    backgroundColor: theme.colors.primaryGhost,
    borderColor: theme.colors.primary,
  },
  dayButtonAvailable: {
    backgroundColor: theme.colors.success + '10',
    borderColor: theme.colors.success,
    borderWidth: 2,
  },
  dayButtonLocked: {
    backgroundColor: theme.colors.border.subtle,
    borderColor: theme.colors.border.light,
    opacity: 0.6,
  },
  dayButtonText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  dayButtonTextCompleted: {
    color: theme.colors.primary,
  },
  dayButtonTextAvailable: {
    color: theme.colors.success,
  },
  dayButtonTextLocked: {
    color: theme.colors.text.muted,
  },
  completedLabel: {
    fontSize: 8,
    color: theme.colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  availableLabel: {
    fontSize: 8,
    color: theme.colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  lockedLabel: {
    fontSize: 8,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: theme.typography.weights.medium,
    textAlign: 'center',
  },
  completedIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  lockedIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  detailsContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    ...theme.shadows.elegant,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  detailIcon: {
    marginRight: theme.spacing.md,
    marginTop: 1,
    width: 18,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: theme.typography.weights.medium,
  },
  detailValue: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
});

export default TestimonialDetailsScreen;