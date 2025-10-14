import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import Header from '../../components/common/Header';
import ApiService from '../../services/apiService';
import TestimonialCard from '../../components/common/TestimonialCard';

interface PublicTestimonial {
  id: string;
  user_name: string;
  template: {
    id: string;
    name: string;
    category: string;
    category_label: string;
  };
  form_data: Record<string, any>;
  photos: any[];
  before_after_photos: any[];
  submitted_at: string;
  approved_at: string;
  is_public: boolean;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

interface PublicTestimonialsScreenProps {
  navigation: any;
}

const PublicTestimonialsScreen: React.FC<PublicTestimonialsScreenProps> = ({ navigation }) => {
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchPublicTestimonials = async (page: number = 1, reset: boolean = true) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await ApiService.getPublicTestimonials(page, 10);

      if (response.success && response.data) {
        // The API returns testimonials directly in the data array
        const testimonialArray = Array.isArray(response.data) ? response.data : [];

        const testimonialsWithPublicFlag = testimonialArray.map((testimonial: any) => ({
          ...testimonial,
          is_public: true
        }));

        if (reset || page === 1) {
          setTestimonials(testimonialsWithPublicFlag);
        } else {
          setTestimonials(prev => [...prev, ...testimonialsWithPublicFlag]);
        }

        // Set pagination if it exists in the response
        if ((response as any).pagination) {
          setPagination((response as any).pagination);
        }
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching public testimonials:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPublicTestimonials();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPublicTestimonials(1, true);
    setRefreshing(false);
  }, []);

  const loadMore = useCallback(() => {
    if (pagination && pagination.has_more_pages && !loadingMore) {
      fetchPublicTestimonials(currentPage + 1, false);
    }
  }, [pagination, loadingMore, currentPage]);

  const renderTestimonial = ({ item }: { item: PublicTestimonial }) => (
    <TestimonialCard
      testimonial={item}
      onPress={() => navigation.navigate('TestimonialDetails', { testimonial: item })}
      isPublic={true}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderPaginationInfo = () => {
    if (!pagination) return null;

    return (
      <View style={styles.paginationInfo}>
        <Text style={styles.paginationText}>
          Showing {pagination.from}-{pagination.to} of {pagination.total} testimonials
        </Text>
      </View>
    );
  };

  const handleShareYourStory = () => {
    navigation.navigate('Testimonial');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Community Stories" />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <WebSafeIcon name="Users" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.headerTitle}>
            Real Stories, Real Results
          </Text>
          <Text style={styles.headerSubtitle}>
            Discover inspiring transformation stories from our community
          </Text>
        </View>

        {loading && testimonials.length === 0 ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading testimonials...</Text>
          </View>
        ) : testimonials.length === 0 ? (
          <View style={styles.emptyContainer}>
            <WebSafeIcon name="MessageSquare" size={48} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No Stories Yet</Text>
            <Text style={styles.emptyMessage}>
              Be the first to share your transformation story with the community.
            </Text>
          </View>
        ) : (
          <>
            {renderPaginationInfo()}
            <FlatList
              data={testimonials}
              renderItem={renderTestimonial}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}

        {/* Share Your Story Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareYourStory}
          activeOpacity={0.8}
        >
          <WebSafeIcon name="Plus" size={20} color={theme.colors.white} />
          <Text style={styles.shareButtonText}>Share Your Story</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
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
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  paginationInfo: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  paginationText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.elegant,
  },
  shareButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    marginLeft: theme.spacing.sm,
  },
});

export default PublicTestimonialsScreen;