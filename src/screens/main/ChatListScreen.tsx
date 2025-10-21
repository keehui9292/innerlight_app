import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { useAuth } from '../../context/AuthContext';
import { TabScreenProps } from '../../types';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';
import notificationService from '../../services/notificationService';

interface Chat {
  id: string;
  type: 'one-to-one' | 'group';
  members: string[];
  member_details?: Record<string, any>;
  last_message?: {
    text: string;
    sender_id: string;
    timestamp: any;
    type: string;
  };
  group_name?: string;
  group_description?: string;
  updated_at: any;
  unread_count?: number;
}

const ChatListScreen: React.FC<TabScreenProps<'Chats'>> = ({ navigation }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchChats();

    // Poll for chat updates every 5 seconds
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await notificationService.areNotificationsEnabled();
      if (!hasPermission) {
        await notificationService.requestPermission();
      }

      // Listen for new messages
      const unsubscribe = notificationService.listenForMessages((payload) => {
        // Refresh chat list when new message arrives
        fetchChats();
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    };

    setupNotifications();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await ApiService.getUserChats();
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  }, []);

  const getChatTitle = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.group_name || 'Group Chat';
    }

    // For one-to-one, get the other person's name
    const otherUserId = chat.members.find(id => id !== user?.id);
    if (otherUserId && chat.member_details?.[otherUserId]) {
      return chat.member_details[otherUserId].name;
    }
    return 'Chat';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.group_name?.charAt(0).toUpperCase() || 'G';
    }

    const otherUserId = chat.members.find(id => id !== user?.id);
    if (otherUserId && chat.member_details?.[otherUserId]) {
      const name = chat.member_details[otherUserId].name;
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return 'U';
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      // Today - show time
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderChatItem = (chat: Chat) => {
    const title = getChatTitle(chat);
    const avatar = getChatAvatar(chat);
    const lastMessageText = chat.last_message?.text || 'No messages yet';
    const timestamp = formatTimestamp(chat.last_message?.timestamp || chat.updated_at);
    const hasUnread = (chat.unread_count || 0) > 0;

    return (
      <TouchableOpacity
        key={chat.id}
        style={[styles.chatItem, hasUnread && styles.chatItemUnread]}
        onPress={() => navigation.navigate('ChatDetail', { chatId: chat.id, chatTitle: title })}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, chat.type === 'group' && styles.avatarGroup]}>
            <Text style={styles.avatarText}>{avatar}</Text>
          </View>
          {hasUnread && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatTitle, hasUnread && styles.chatTitleUnread]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.chatTime}>{timestamp}</Text>
          </View>

          <View style={styles.chatFooter}>
            <Text style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]} numberOfLines={1}>
              {lastMessageText}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {chat.unread_count! > 99 ? '99+' : chat.unread_count}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => navigation.navigate('NewChat')}
        >
          <WebSafeIcon name="Edit" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {chats.length === 0 ? (
          <View style={styles.emptyState}>
            <WebSafeIcon name="MessageSquare" size={48} color={theme.colors.text.light} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a conversation with your team
            </Text>
          </View>
        ) : (
          <View style={styles.chatsList}>
            {chats.map(renderChatItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  chatsList: {
    paddingVertical: theme.spacing.xs,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  chatItemUnread: {
    backgroundColor: '#fef9f8',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  avatarGroup: {
    backgroundColor: theme.colors.primaryDark,
  },
  avatarText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  chatTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    flex: 1,
  },
  chatTitleUnread: {
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  chatTime: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.xs,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  lastMessageUnread: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  unreadText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.light,
    textAlign: 'center',
  },
});

export default ChatListScreen;
