import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/common/Header';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface User {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  is_pinned: boolean;
  view_count: number;
  comment_count: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  user: User;
  category: Category;
}

interface ForumScreenProps {
  navigation: any;
}

const ForumScreen: React.FC<ForumScreenProps> = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState<ForumPost[]>([]);
  const [topics, setTopics] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  

  const fetchForumData = async () => {
    try {
      setLoading(true);
      
      const [announcementsResponse, topicsResponse] = await Promise.all([
        ApiService.getForumAnnouncements(),
        ApiService.getForumTopics()
      ]);

      if (announcementsResponse.success && announcementsResponse.data?.data) {
        setAnnouncements(announcementsResponse.data.data);
      } else {
        setAnnouncements([]);
      }
      
      if (topicsResponse.success && topicsResponse.data?.data) {
        setTopics(topicsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching forum data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumData();
  }, []);

  // Listen for navigation focus to refresh data when returning from any screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchForumData();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchForumData();
    setRefreshing(false);
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };



  const handlePostPress = (post: ForumPost) => {
    // Determine if this is an announcement based on is_pinned property
    const isAnnouncement = post.is_pinned;
    
    navigation.navigate('TopicDetails', { 
      topicUuid: post.id, 
      topic: post,
      isAnnouncement 
    });
  };

  const renderPost = (post: ForumPost) => {
    const isAnnouncement = post.is_pinned;
    
    return (
    <TouchableOpacity
      key={post.id}
      style={[
        styles.postCard,
        isAnnouncement && styles.announcementCard
      ]}
      onPress={() => handlePostPress(post)}
      activeOpacity={0.7}
    >
      <View style={styles.postHeader}>
        <View style={styles.postTitleContainer}>
          {isAnnouncement && (
            <View style={styles.pinnedBadge}>
              <WebSafeIcon name="Pin" size={12} color={theme.colors.warning} />
              <Text style={styles.pinnedText}>Pinned</Text>
            </View>
          )}
          <Text style={styles.postTitle} numberOfLines={2}>
            {post.title}
          </Text>
        </View>
        <Text style={styles.categoryText}>{post.category.name}</Text>
      </View>

      {/* {post.content && (
        <Text style={styles.postContent} numberOfLines={3}>
          {getContentPreview(post.content)}
        </Text>
      )} */}

      <View style={styles.postFooter}>
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <WebSafeIcon name="Eye" size={14} color={theme.colors.text.tertiary} />
            <Text style={styles.statText}>{post.view_count}</Text>
          </View>
          
          {!isAnnouncement && (
            <View style={styles.statItem}>
              <WebSafeIcon name="MessageCircle" size={14} color={theme.colors.text.tertiary} />
              <Text style={styles.statText}>{post.comments_count || post.comment_count}</Text>
            </View>
          )}

          <Text style={styles.timeText}>{formatTime(post.last_activity_at || post.created_at)}</Text>
        </View>

        <View style={styles.postMeta}>
          <Text style={styles.authorText}>by {post.user.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Forum" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading forum...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Forum" />
      
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
          {/* Announcements Section */}
          {announcements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <WebSafeIcon name="Megaphone" size={20} color={theme.colors.warning} />
                <Text style={styles.sectionTitle}>Announcements</Text>
              </View>
              
              <View style={styles.postsContainer}>
                {announcements.map(announcement => renderPost(announcement))}
              </View>
            </View>
          )}

          {/* Forum Discussions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <WebSafeIcon name="MessageSquare" size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Forum Discussions</Text>
            </View>
            
            {topics.length === 0 ? (
              <View style={styles.emptyContainer}>
                <WebSafeIcon name="MessageSquare" size={48} color={theme.colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No Discussions Yet</Text>
                <Text style={styles.emptyMessage}>
                  Be the first to start a discussion in the forum
                </Text>
              </View>
            ) : (
              <View style={styles.postsContainer}>
                {topics.map(topic => renderPost(topic))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTopic')}
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    letterSpacing: -0.2,
  },
  postsContainer: {
    gap: theme.spacing.sm,
  },
  postCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  announcementCard: {
    borderColor: theme.colors.warning,
    borderWidth: 1.5,
    backgroundColor: theme.colors.warning + '05',
  },
  postHeader: {
    marginBottom: theme.spacing.sm,
  },
  postTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    gap: 4,
    marginTop: 2,
  },
  pinnedText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.warning,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
  },
  postTitle: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  categoryText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  postContent: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  postStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  authorText: {
    fontSize: theme.typography.sizes.xs,
    marginBottom: 2,
    color: "#999",
  },
  timeText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
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

export default ForumScreen;