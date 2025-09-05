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
  TouchableOpacity,
  Platform,
  Modal,
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
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');
  const [updatingComment, setUpdatingComment] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState<boolean>(false);
  
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

  const fetchCurrentUser = async () => {
    try {
      const response = await ApiService.getMe();
      if (response.success && response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
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
    fetchCurrentUser();
  }, [topicUuid]);

  // Listen for navigation focus to refresh data when returning from any screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTopicDetails();
      fetchComments();
      fetchCurrentUser();
    });

    return unsubscribe;
  }, [navigation]);

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

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    // Strip HTML tags for editing
    const plainText = comment.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    setEditingCommentText(plainText);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingCommentText.trim()) {
      Alert.alert('Error', 'Please enter comment content');
      return;
    }

    try {
      setUpdatingComment(true);
      const response = await ApiService.updateComment(commentId, {
        content: editingCommentText.trim()
      });

      if (response.success) {
        setEditingCommentId(null);
        setEditingCommentText('');
        await fetchComments(); // Refresh comments
        Alert.alert('Success', 'Comment updated successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to update comment');
      }
    } catch (error: any) {
      console.error('Error updating comment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update comment';
      Alert.alert('Error', errorMessage);
    } finally {
      setUpdatingComment(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (Platform.OS === 'web') {
      setCommentToDelete(commentId);
      setShowDeleteModal(true);
    } else {
      Alert.alert(
        'Delete Comment',
        'Are you sure you want to delete this comment? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => confirmDeleteComment(commentId),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const confirmDeleteComment = async (commentId: string) => {
    try {
      setDeletingComment(true);
      const response = await ApiService.deleteComment(commentId);
      if (response.success) {
        await fetchComments(); // Refresh comments
        if (Platform.OS === 'web') {
          alert('Comment deleted successfully');
        } else {
          Alert.alert('Success', 'Comment deleted successfully');
        }
      } else {
        const errorMessage = response.message || 'Failed to delete comment';
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete comment';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setDeletingComment(false);
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const handleEditTopic = () => {
    navigation.navigate('CreateTopic', { topic });
  };

  const handleDeleteTopic = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
        confirmDeleteTopic();
      }
    } else {
      Alert.alert(
        'Delete Topic',
        'Are you sure you want to delete this topic? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDeleteTopic,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const confirmDeleteTopic = async () => {
    try {
      const response = await ApiService.delete(`/forum/topics/${topic?.id}`);
      if (response.success) {
        if (Platform.OS === 'web') {
          alert('Topic deleted successfully');
        } else {
          Alert.alert('Success', 'Topic deleted successfully');
        }
        navigation.goBack();
      } else {
        const errorMessage = response.message || 'Failed to delete topic';
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Error deleting topic:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete topic';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
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

  const renderComment = (comment: Comment, isReply: boolean = false) => {
    const isOwner = currentUser && currentUser.user.id === comment.user.id;
    const isEditing = editingCommentId === comment.id;

    return (
      <View key={comment.id} style={[styles.commentCard, isReply && styles.replyCard]}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{comment.user.name}</Text>
          <View style={styles.commentHeaderRight}>
            <Text style={styles.commentDate}>{formatDate(comment.created_at)}</Text>
            {isOwner && (
              <View style={styles.commentActions}>
                <TouchableOpacity
                  onPress={() => handleEditComment(comment)}
                  style={styles.actionButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <WebSafeIcon name="Edit2" size={16} color={theme.colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteComment(comment.id)}
                  style={styles.actionButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <WebSafeIcon name="Trash2" size={16} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {isEditing ? (
          <View style={styles.editCommentContainer}>
            <TextInput
              style={styles.editCommentInput}
              value={editingCommentText}
              onChangeText={setEditingCommentText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.editCommentActions}>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={[styles.editButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUpdateComment(comment.id)}
                style={[styles.editButton, styles.saveButton]}
                disabled={updatingComment}
              >
                <Text style={styles.saveButtonText}>
                  {updatingComment ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <RenderHtml
            contentWidth={width - (theme.spacing.md * 2) - (isReply ? theme.spacing.lg : 0)}
            source={{ html: comment.content }}
            baseStyle={{
              ...htmlConfig.baseStyle,
              fontSize: theme.typography.sizes.sm,
            }}
            tagsStyles={htmlConfig.tagsStyles}
          />
        )}

        {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      </View>
    );
  };

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

  const isTopicAuthor = currentUser && topic && currentUser.user.id === topic.user.id;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header 
        title={isAnnouncement ? "Announcement" : "Topic"}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={isTopicAuthor && !isAnnouncement ? (
          <View style={styles.topicActions}>
            <TouchableOpacity
              onPress={handleEditTopic}
              style={styles.topicActionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <WebSafeIcon name="Edit2" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteTopic}
              style={styles.topicActionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <WebSafeIcon name="Trash2" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ) : undefined}
      />
      
      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
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
        </ScrollView>
      </View>

      {/* Delete Confirmation Modal (for web) */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContainer}>
            <Text style={styles.deleteModalTitle}>Delete Comment</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete this comment? This action cannot be undone.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                onPress={handleCancelDelete}
                style={[styles.modalButton, styles.cancelModalButton]}
                disabled={deletingComment}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => commentToDelete && confirmDeleteComment(commentToDelete)}
                style={[styles.modalButton, styles.deleteModalButton]}
                disabled={deletingComment}
              >
                <Text style={styles.deleteModalButtonText}>
                  {deletingComment ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  commentHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  commentActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  editCommentContainer: {
    gap: theme.spacing.sm,
  },
  editCommentInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editCommentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.border.default,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  saveButtonText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.white,
    fontWeight: theme.typography.weights.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  deleteModalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    minWidth: 300,
    maxWidth: 400,
    ...theme.shadows.medium,
  },
  deleteModalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  deleteModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: theme.colors.border.default,
  },
  deleteModalButton: {
    backgroundColor: theme.colors.error,
  },
  cancelModalButtonText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  deleteModalButtonText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.white,
    fontWeight: theme.typography.weights.medium,
  },
  topicActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  topicActionButton: {
    padding: theme.spacing.xs,
  },
});

export default TopicDetailsScreen;