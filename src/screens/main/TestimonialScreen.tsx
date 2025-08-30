import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import Header from '../../components/common/Header';
import ApiService from '../../services/apiService';
import TestimonialCard from '../../components/common/TestimonialCard';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTestimonials();
      if (response.success && response.data) {
        setTestimonials(response.data);
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTestimonials();
    setRefreshing(false);
  }, []);

  const testimonialCategories: TestimonialCategory[] = [
    {
      id: 'detoxification',
      title: 'Detoxification',
      description: 'Share your detox journey and experience',
      icon: 'Leaf',
      onPress: () => navigation.navigate('DetoxificationTestimonial'),
    },
    // Future categories can be added here
  ];

  const renderItem = ({ item }: { item: Testimonial }) => (
    <TestimonialCard testimonial={item} />
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
              <WebSafeIcon name="MessageSquare" size={32} color={theme.colors.primary} />
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
                      
                      <WebSafeIcon name="ChevronRight" size={20} color={theme.colors.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submitted Testimonials Section */}
          <View style={styles.testimonialsSection}>
            <Text style={styles.sectionTitle}>Submitted Testimonials</Text>
            {loading ? (
              <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
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
});

export default TestimonialScreen;