import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import Header from '../../components/common/Header';
import ApiService from '../../services/apiService';
import TestimonialCard from '../../components/common/TestimonialCard';

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
  template: {
    id: string;
    name: string;
    slug: string;
    category: string;
    category_label: string;
    has_daily_tracking: boolean;
    diary_days: number;
    initial_fields?: FormField[];
    daily_fields?: FormField[];
    initial_input_type?: string;
    daily_input_type?: string;
  };
  status: string;
  is_public: boolean;
  submitted_at: string;
  approved_at: string | null;
  form_data: Record<string, any>;
  photos: any[];
  before_after_photos: any[];
  tracking: {
    completed_days: number;
    total_days: number;
    progress_percentage: number;
    initial_entry?: TrackingEntry;
    daily_entries: Record<string, DailyEntry>;
  };
}

interface TestimonialScreenProps {
  navigation: any;
}

interface TestimonialCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

const TestimonialScreen: React.FC<TestimonialScreenProps> = ({ navigation }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialTemplates, setTestimonialTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      // Fetch both testimonials and templates
      const [testimonialsResponse, templatesResponse] = await Promise.all([
        ApiService.getTestimonials(),
        ApiService.getTestimonialTemplates()
      ]);
      
      if (testimonialsResponse.success && testimonialsResponse.data) {
        setTestimonials(testimonialsResponse.data);
      }
      
      if (templatesResponse.success && templatesResponse.data) {
        setTestimonialTemplates(templatesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Listen for navigation focus to refresh data when returning to screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTestimonials();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTestimonials();
    setRefreshing(false);
  }, []);

  // Helper function to get icon based on category
  const getIconForCategory = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'detox':
      case 'detoxification':
        return 'Leaf';
      case 'wellness':
        return 'Heart';
      case 'nutrition':
        return 'Apple';
      case 'fitness':
        return 'Activity';
      case 'mental-health':
        return 'Brain';
      case 'spiritual':
        return 'Sun';
      default:
        return 'FileText';
    }
  };

  // Helper function to get navigation route based on template slug
  const getNavigationRoute = (slug: string): string => {
    // Map template slugs to their respective screens
    switch (slug.toLowerCase()) {
      case 'detoxification':
        return 'DetoxificationTestimonial';
      // Add more template-specific screens as they're created
      default:
        // For now, all templates use the DetoxificationTestimonial screen
        // This can be expanded to have template-specific screens
        return 'DetoxificationTestimonial';
    }
  };

  // Generate testimonial categories from templates
  const testimonialCategories: TestimonialCategory[] = testimonialTemplates.map((template) => ({
    id: template.id,
    title: template.name,
    description: template.description || `Share your ${template.name.toLowerCase()} experience`,
    icon: getIconForCategory(template.category),
    onPress: () => navigation.navigate(getNavigationRoute(template.slug)),
  }));

  const renderItem = ({ item }: { item: Testimonial }) => (
    <TestimonialCard 
      testimonial={item} 
      onPress={() => navigation.navigate('TestimonialDetails', { testimonial: item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Share Your Story" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerIcon}>
              <WebSafeIcon name="MessageSquare" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerTitle}>
              Your Voice Matters
            </Text>
            <Text style={styles.headerSubtitle}>
              Share your transformation story and inspire others on their wellness journey
            </Text>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Choose Your Experience</Text>
            
            {loading ? (
              <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />
            ) : testimonialCategories.length === 0 ? (
              <View style={styles.emptyContainer}>
                <WebSafeIcon name="Package" size={48} color={theme.colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No Templates Available</Text>
                <Text style={styles.emptyMessage}>
                  Testimonial templates are currently being set up. Please check back later.
                </Text>
              </View>
            ) : (
              <View style={styles.categoriesContainer}>
                {testimonialCategories.map((category) => {
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      activeOpacity={0.8}
                      onPress={category.onPress}
                    >
                      <View style={styles.categoryContent}>
                        <View style={styles.categoryIconContainer}>
                          <WebSafeIcon name={category.icon} size={24} color={theme.colors.primary} />
                        </View>
                        
                        <View style={styles.categoryTextContainer}>
                          <Text style={styles.categoryTitle}>
                            {category.title}
                          </Text>
                          <Text style={styles.categoryDescription}>
                            {category.description}
                          </Text>
                        </View>
                        
                        <WebSafeIcon name="ChevronRight" size={16} color={theme.colors.text.tertiary} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Submitted Testimonials Section */}
          <View style={styles.testimonialsSection}>
            <Text style={styles.sectionTitle}>Submitted Testimonials</Text>
            {testimonials.length === 0 ? (
              <View style={styles.emptyContainer}>
                <WebSafeIcon name="FileText" size={48} color={theme.colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No Reviews Found</Text>
                <Text style={styles.emptyMessage}>
                  You haven't submitted any testimonials yet. Share your experience by selecting a category above.
                </Text>
              </View>
            ) : (
              <FlatList
                data={testimonials}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // To disable FlatList's own scrolling
              />
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <WebSafeIcon name="Star" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Why Share Your Story?</Text>
                <Text style={styles.infoText}>
                  Your testimonial helps others understand the real impact of our services and encourages them to begin their own wellness journey.
                </Text>
              </View>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  categoriesSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.2,
  },
  categoriesContainer: {
    gap: theme.spacing.sm,
  },
  categoryCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.elegant,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.2,
  },
  categoryDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    lineHeight: 18,
  },
  infoSection: {
    marginTop: theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...theme.shadows.light,
  },
  infoContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  infoTitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.1,
  },
  infoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  testimonialsSection: {
    marginTop: theme.spacing.lg,
  },
  loader: {
    marginVertical: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
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
});

export default TestimonialScreen;