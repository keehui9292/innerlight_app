import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderHtml from 'react-native-render-html';
import Header from '../../components/common/Header';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import CustomButton from '../../components/common/Button';
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

interface Comment {
  id: string;
  content: string;
  topic_id: string;
  parent_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
}

interface Topic {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  is_pinned: boolean;
  view_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  user: User;
  category: Category;
}

interface TopicDetailsScreenProps {
  navigation: any;
  route: any;
}

const TopicDetailsScreen: React.FC<TopicDetailsScreenProps> = ({ navigation, route }) => {
  const { topicUuid, topic: initialTopic, isAnnouncement = false } = route.params || {};
  const [topic, setTopic] = useState<Topic | null>(initialTopic || null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialTopic);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [hideComment, setHideComment] = useState<boolean>(true);
  
  const { width } = Dimensions.get('window');
  
  // HTML rendering configuration
  const htmlConfig = {
    contentWidth: width - (theme.spacing.md * 2),
    baseStyle: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text.primary,
      lineHeight: 22,
    },
    tagsStyles: {
      p: {
        marginTop: 0,
        marginBottom: 12,
      },
      h1: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.semibold,
        marginTop: 0,
        marginBottom: 12,
        color: theme.colors.text.primary,
      },
      h2: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.medium,
        marginTop: 0,
        marginBottom: 10,
        color: theme.colors.text.primary,
      },
      h3: {
        fontSize: theme.typography.sizes.md,
        fontWeight: theme.typography.weights.medium,
        marginTop: 0,
        marginBottom: 8,
        color: theme.colors.text.primary,
      },
      strong: {
        fontWeight: theme.typography.weights.semibold,
      },
      em: {
        fontStyle: 'italic' as const,
      },
      ul: {
        marginTop: 0,
        marginBottom: 12,
        paddingLeft: 20,
      },
      ol: {
        marginTop: 0,
        marginBottom: 12,
        paddingLeft: 20,
      },
      li: {
        marginBottom: 4,
      },
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
        paddingLeft: 12,
        marginVertical: 8,
        fontStyle: 'italic' as const,
      },
      code: {
        backgroundColor: theme.colors.border.subtle,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        fontFamily: 'monospace',
      },
    },
  };

  const fetchTopicDetails = async () => {
    try {
      if (!topic) {
        setLoading(true);
      }
      
      const response = await ApiService.getTopicDetails(topicUuid);
      if (response.success && response.data) {
        setHideComment(response.data.category_id === 24);
        setTopic(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load topic details');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (isAnnouncement) return; // Don't load comments for announcements
    
    try {
      setLoadingComments(true);
      const response = await ApiService.getTopicComments(topicUuid);
      if (response.success && response.data?.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchTopicDetails();
    fetchComments();
  }, [topicUuid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchTopicDetails(),
      fetchComments()
    ]);
    setRefreshing(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await ApiService.createComment(topicUuid, {
        content: newComment.trim()
      });

      if (response.success) {
        setNewComment('');
        await fetchComments(); // Refresh comments
        Alert.alert('Success', 'Comment posted successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to post comment');
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <View key={comment.id} style={[styles.commentCard, isReply && styles.replyCard]}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.user.name}</Text>
        <Text style={styles.commentDate}>{formatDate(comment.created_at)}</Text>
      </View>
      
      <RenderHtml
        contentWidth={width - (theme.spacing.md * 2) - (isReply ? theme.spacing.lg : 0)}
        source={{ html: comment.content }}
        baseStyle={{
          ...htmlConfig.baseStyle,
          fontSize: theme.typography.sizes.sm,
        }}
        tagsStyles={htmlConfig.tagsStyles}
      />

      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Loading..." 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading topic...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!topic) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Error" 
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <WebSafeIcon name="AlertCircle" size={48} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Topic Not Found</Text>
          <Text style={styles.errorMessage}>This topic may have been removed or is no longer available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={isAnnouncement ? "Announcement" : "Topic"}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
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
          {/* Topic Header */}
          <View style={styles.topicHeader}>
            {isAnnouncement && (
              <View style={styles.announcementBadge}>
                <WebSafeIcon name="Megaphone" size={16} color={theme.colors.warning} />
                <Text style={styles.announcementText}>Official Announcement</Text>
              </View>
            )}
            
            <Text style={styles.topicTitle}>{topic.title}</Text>
            
            <View style={styles.topicMeta}>
              <View style={styles.metaRow}>
                <Text style={styles.categoryText}>{topic.category.name}</Text>
                <View style={styles.topicStats}>
                  <View style={styles.statItem}>
                    <WebSafeIcon name="Eye" size={14} color={theme.colors.text.tertiary} />
                    <Text style={styles.statText}>{topic.view_count}</Text>
                  </View>
                  {!isAnnouncement && (
                    <View style={styles.statItem}>
                      <WebSafeIcon name="MessageCircle" size={14} color={theme.colors.text.tertiary} />
                      <Text style={styles.statText}>{topic.comment_count}</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.authorRow}>
                <Text style={styles.authorText}>by {topic.user.name}</Text>
                <Text style={styles.dateText}>{formatDate(topic.created_at)}</Text>
              </View>
            </View>
          </View>

          {/* Topic Content */}
          <View style={styles.contentSection}>
            <RenderHtml
              contentWidth={width - (theme.spacing.md * 2)}
              source={{ html: topic.content }}
              baseStyle={htmlConfig.baseStyle}
              tagsStyles={htmlConfig.tagsStyles}
            />
          </View>

          {/* Comments Section (only for regular topics) */}
          {!hideComment &&(
            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>
                Comments ({topic.comment_count})
              </Text>

              {/* Add Comment Form */}
              <View style={styles.addCommentSection}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                
                <CustomButton
                  title={submittingComment ? "Posting..." : "Post Comment"}
                  onPress={handleSubmitComment}
                  disabled={submittingComment || !newComment.trim()}
                  colorScheme="primary"
                  fullWidth
                />
              </View>

              {/* Comments List */}
              {loadingComments ? (
                <View style={styles.commentsLoading}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.loadingText}>Loading comments...</Text>
                </View>
              ) : comments.length === 0 ? (
                <View style={styles.noComments}>
                  <WebSafeIcon name="MessageCircle" size={32} color={theme.colors.text.tertiary} />
                  <Text style={styles.noCommentsText}>No comments yet</Text>
                  <Text style={styles.noCommentsSubtext}>Be the first to share your thoughts</Text>
                </View>
              ) : (
                <View style={styles.commentsList}>
                  {comments.map(comment => renderComment(comment))}
                </View>
              )}
            </View>
          )}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  errorTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  topicHeader: {
    marginBottom: theme.spacing.lg,
  },
  announcementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  announcementText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.warning,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
  },
  topicTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    lineHeight: 28,
    marginBottom: theme.spacing.md,
  },
  topicMeta: {
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase',
  },
  topicStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  dateText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  contentSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  commentsSection: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  addCommentSection: {
    gap: theme.spacing.md,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  commentsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  noCommentsText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
  },
  noCommentsSubtext: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  commentsList: {
    gap: theme.spacing.sm,
  },
  commentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  replyCard: {
    marginLeft: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.border.subtle,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  commentAuthor: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  commentDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
});

export default TopicDetailsScreen;