import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/common/Header';
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
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(0);
  const [useOptimizedPolling, setUseOptimizedPolling] = useState<boolean>(true);
  const failedChecksRef = React.useRef<number>(0);
  const isFetchingRef = React.useRef<boolean>(false);
  const lastFetchTimeRef = React.useRef<number>(0);

  const fetchChats = async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('Already fetching chats, skipping...');
      return;
    }

    // Prevent fetching more than once per 3 seconds
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 3000) {
      console.log('Fetched recently, skipping...');
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;

    try {
      const response = await ApiService.getUserChats();
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const checkForUpdates = async () => {
    if (!useOptimizedPolling) {
      // Fallback to old polling if optimized endpoint not available
      // But only fetch once every 10 seconds to reduce load
      const now = Date.now();
      if (now - lastFetchTimeRef.current >= 10000) {
        await fetchChats();
      }
      return;
    }

    try {
      const response = await ApiService.checkChatUpdates();

      if (response.success && response.data) {
        // Reset failed checks counter on success
        failedChecksRef.current = 0;

        // Only fetch if:
        // 1. has_updates is true
        // 2. timestamp is newer than last update
        // 3. Not currently fetching
        if (response.data.has_updates &&
            response.data.timestamp > lastUpdateTimestamp &&
            !isFetchingRef.current) {
          console.log('Updates detected, fetching chats...');
          await fetchChats();
          setLastUpdateTimestamp(response.data.timestamp);
        } else if (response.data.has_updates) {
          console.log('Updates reported but timestamp unchanged, skipping fetch');
        }
      } else {
        // Endpoint exists but returned error
        failedChecksRef.current++;
        if (failedChecksRef.current >= 3) {
          console.warn('check-updates endpoint failing, switching to direct polling');
          setUseOptimizedPolling(false);
        }
      }
    } catch (error) {
      console.error('Error checking for chat updates:', error);
      failedChecksRef.current++;

      // If endpoint fails 3 times in a row, assume it doesn't exist
      // and fall back to direct polling
      if (failedChecksRef.current >= 3) {
        console.warn('check-updates endpoint not available, switching to direct polling');
        setUseOptimizedPolling(false);
      }
    }
  };

  // Only poll when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Initial fetch when screen comes into focus
      fetchChats();

      // Optimized polling: check for updates first, then fetch only if needed
      const interval = setInterval(async () => {
        await checkForUpdates();
      }, 5000); // Check every 5 seconds (lightweight, cached)

      // Cleanup: stop polling when screen loses focus
      return () => {
        clearInterval(interval);
        console.log('ChatListScreen: Stopped polling (screen unfocused)');
      };
    }, [])
  );

  // Request notification permission on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await notificationService.areNotificationsEnabled();
      if (!hasPermission) {
        await notificationService.requestPermission();
      }

      // Listen for new messages
      const unsubscribe = notificationService.listenForMessages((payload) => {
        // Trigger update check when notification arrives (instead of fetching directly)
        checkForUpdates();
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    };

    setupNotifications();
  }, []);

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
      <Header title="Messages" />

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
