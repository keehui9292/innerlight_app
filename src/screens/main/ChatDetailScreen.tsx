import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';
import notificationService from '../../services/notificationService';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  message_text: string;
  message_type: string;
  timestamp: any;
  read_by: string[];
  edited?: boolean;
  deleted?: boolean;
}

interface ChatDetailScreenProps {
  navigation: any;
  route: {
    params: {
      chatId: string;
      chatTitle: string;
    };
  };
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
  const { chatId, chatTitle } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const previousMessageCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isAtBottomRef = useRef<boolean>(true);
  const contentHeightRef = useRef<number>(0);
  const scrollViewHeightRef = useRef<number>(0);

  useEffect(() => {
    navigation.setOptions({
      title: chatTitle,
    });
  }, [chatTitle]);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  // Listen for notification responses (when user taps notification)
  useEffect(() => {
    const unsubscribe = notificationService.listenForNotificationResponse((response) => {
      const chatIdFromNotification = response?.notification?.request?.content?.data?.chatId;
      if (chatIdFromNotification && chatIdFromNotification !== chatId) {
        // Navigate to the correct chat if tapped notification is for different chat
        navigation.navigate('ChatDetail', {
          chatId: chatIdFromNotification,
          chatTitle: response?.notification?.request?.content?.data?.chatTitle || 'Chat'
        });
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId]);

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      const response = await ApiService.getMessages(chatId, { limit: 50 });
      if (response.success && response.data) {
        const messagesList = response.data.filter((msg: Message) => !msg.deleted);

        // Check for new messages and show notification
        if (previousMessageCountRef.current > 0 && messagesList.length > previousMessageCountRef.current) {
          const newMessages = messagesList.slice(previousMessageCountRef.current);
          const latestMessage = newMessages[newMessages.length - 1];

          // Only show notification if the message is from someone else
          if (latestMessage && latestMessage.sender_id !== user?.id) {
            notificationService.showNotification(
              latestMessage.sender_name || chatTitle,
              latestMessage.message_text,
              { chatId, chatTitle }
            );
          }
        }

        // Update message count reference
        previousMessageCountRef.current = messagesList.length;

        // Don't reverse - keep chronological order (oldest first)
        // FlatList will show them oldest at top, newest at bottom
        setMessages(messagesList);

        // Mark messages as read
        const unreadMessageIds = messagesList
          .filter((msg: Message) => msg.sender_id !== user?.id && !msg.read_by?.includes(user?.id || ''))
          .map((msg: Message) => msg.id);

        if (unreadMessageIds.length > 0 && user?.id) {
          ApiService.markMessagesAsRead(chatId, unreadMessageIds).catch(err =>
            console.error('Error marking messages as read:', err)
          );
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await ApiService.sendMessage(chatId, {
        message_text: messageText,
        message_type: 'text',
      });
      // Refresh messages after sending
      await fetchMessages();
      // Scroll to bottom after sending message
      setTimeout(() => scrollToBottom(true), 200);
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageText); // Restore text on error
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const scrollToBottom = (animated: boolean = true) => {
    if (messages.length > 0 && contentHeightRef.current > scrollViewHeightRef.current) {
      scrollViewRef.current?.scrollToEnd({ animated });
      setShowScrollButton(false);
      isAtBottomRef.current = true;
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    contentHeightRef.current = contentSize.height;
    scrollViewHeightRef.current = layoutMeasurement.height;

    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);

    // Show button if user scrolled up more than 100px from bottom
    const isNearBottom = distanceFromBottom < 100;
    isAtBottomRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom && contentSize.height > layoutMeasurement.height);
  };

  const handleContentSizeChange = (_width: number, height: number) => {
    contentHeightRef.current = height;

    // Auto-scroll to bottom on initial load or when user is already at bottom
    if (isInitialLoadRef.current) {
      // Initial load: scroll without animation for instant display
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
        isInitialLoadRef.current = false;
      }, 100);
    } else if (isAtBottomRef.current && messages.length > 0) {
      // User is at bottom: auto-scroll to show new messages
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = (item: Message) => {
    const isOwnMessage = item.sender_id === user?.id;
    const showSenderName = !isOwnMessage;

    return (
      <View key={item.id} style={[styles.messageContainer, isOwnMessage && styles.messageContainerOwn]}>
        {showSenderName && (
          <Text style={styles.senderName}>{item.sender_name}</Text>
        )}
        <View style={[styles.messageBubble, isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther]}>
          <Text style={[styles.messageText, isOwnMessage && styles.messageTextOwn]}>
            {item.message_text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isOwnMessage && styles.messageTimeOwn]}>
              {formatTimestamp(item.timestamp)}
            </Text>
            {isOwnMessage && item.read_by && item.read_by.length > 1 && (
              <View style={styles.readIcon}>
                <WebSafeIcon name="CheckCheck" size={14} color={theme.colors.primary} />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <WebSafeIcon name="ArrowLeft" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{chatTitle}</Text>
        <TouchableOpacity style={styles.backButton}>
          <WebSafeIcon name="MoreVertical" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.messagesContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={handleContentSizeChange}
          >
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <WebSafeIcon name="MessageCircle" size={48} color={theme.colors.text.light} />
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>Start the conversation</Text>
              </View>
            ) : (
              messages.map(renderMessage)
            )}
          </ScrollView>

          {showScrollButton && (
            <TouchableOpacity
              style={styles.scrollToBottomButton}
              onPress={() => scrollToBottom(true)}
              activeOpacity={0.8}
            >
              <WebSafeIcon name="ArrowDown" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={theme.colors.text.light}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <WebSafeIcon name="Send" size={20} color={theme.colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  contentWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  messagesContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  messagesList: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  messagesContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    maxWidth: '80%',
  },
  messageContainerOwn: {
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  messageBubble: {
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  messageBubbleOwn: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: theme.colors.white,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  messageTime: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
  },
  messageTimeOwn: {
    color: theme.colors.primaryLight,
  },
  readIcon: {
    marginLeft: theme.spacing.xs,
  },
  inputContainer: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.primaryLight,
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.light,
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: theme.spacing.md,
    right: theme.spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
    elevation: 5,
  },
});

export default ChatDetailScreen;
