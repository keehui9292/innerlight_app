import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare, Star, ChevronRight, Leaf } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import Header from '../../components/common/Header';

interface TestimonialScreenProps {
  navigation: any;
}

interface TestimonialCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

const TestimonialScreen: React.FC<TestimonialScreenProps> = ({ navigation }) => {
  const testimonialCategories: TestimonialCategory[] = [
    {
      id: 'detoxification',
      title: 'Detoxification',
      description: 'Share your detox journey and experience',
      icon: Leaf,
      onPress: () => navigation.navigate('DetoxificationTestimonial'),
    },
    // Future categories can be added here
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Share Your Story" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerIcon}>
              <MessageSquare size={32} color={theme.colors.primary} />
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
                const IconComponent = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    activeOpacity={0.8}
                    onPress={category.onPress}
                  >
                    <View style={styles.categoryContent}>
                      <View style={styles.categoryIconContainer}>
                        <IconComponent size={24} color={theme.colors.primary} />
                      </View>
                      
                      <View style={styles.categoryTextContainer}>
                        <Text style={styles.categoryTitle}>
                          {category.title}
                        </Text>
                        <Text style={styles.categoryDescription}>
                          {category.description}
                        </Text>
                      </View>
                      
                      <ChevronRight size={20} color={theme.colors.text.tertiary} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Star size={20} color={theme.colors.primary} />
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
});

export default TestimonialScreen;