import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../constants/theme';
import WebSafeIcon from './WebSafeIcon';

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
  submitted_at?: string;
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

interface TestimonialCardProps {
  testimonial: Testimonial;
  onPress?: () => void;
  isPublic?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, onPress, isPublic = false }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const dateToShow = isPublic
    ? (testimonial.approved_at || testimonial.created_at || testimonial.submitted_at)
    : testimonial.submitted_at;

  const dateLabel = isPublic ? 'Shared on:' : 'Submitted on:';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{testimonial.template.name}</Text>
          {isPublic && testimonial.user_name && (
            <Text style={styles.userName}>by {testimonial.user_name}</Text>
          )}
        </View>
        {!isPublic && testimonial.status && (
          <Text style={styles.status}>{testimonial.status}</Text>
        )}
        {isPublic && (
          <View style={styles.publicBadge}>
            <WebSafeIcon name="Globe" size={12} color={theme.colors.primary} />
            <Text style={styles.publicText}>Public</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.date}>{dateLabel} {formatDate(dateToShow)}</Text>
        {!isPublic && testimonial.template.has_daily_tracking && testimonial.tracking && (
          <View style={styles.trackingContainer}>
            <WebSafeIcon name="TrendingUp" size={14} color={theme.colors.primary} />
            <Text style={styles.trackingText}>
              Progress: {testimonial.tracking.completed_days}/{testimonial.tracking.total_days} days
            </Text>
          </View>
        )}
        <View style={styles.chevronContainer}>
          <WebSafeIcon name="ChevronRight" size={16} color={theme.colors.text.tertiary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  userName: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryGhost,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
  },
  publicText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  status: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  body: {
    position: 'relative',
    paddingRight: theme.spacing.lg,
  },
  date: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.sm,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  trackingText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
  },
  chevronContainer: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});

export default TestimonialCard;