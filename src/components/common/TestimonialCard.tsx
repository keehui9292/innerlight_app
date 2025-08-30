import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import WebSafeIcon from './WebSafeIcon';

interface Testimonial {
  id: string;
  template: {
    name: string;
    has_daily_tracking: boolean;
    diary_days: number;
  };
  status: string;
  submitted_at: string;
  tracking: {
    completed_days: number;
    total_days: number;
    progress_percentage: number;
    entries: Array<{
      day_number: number;
      tracking_data: Record<string, string>;
    }>;
  };
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{testimonial.template.name}</Text>
        <Text style={styles.status}>{testimonial.status}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.date}>Submitted on: {new Date(testimonial.submitted_at).toLocaleDateString()}</Text>
        {testimonial.template.has_daily_tracking && (
          <View style={styles.trackingContainer}>
            <WebSafeIcon name="TrendingUp" size={18} color={theme.colors.primary} />
            <Text style={styles.trackingText}>
              Tracking Progress: {testimonial.tracking.completed_days} / {testimonial.tracking.total_days} days
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  status: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  body: {},
  date: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.md,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  trackingText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
});

export default TestimonialCard;