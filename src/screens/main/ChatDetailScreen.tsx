import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import ImageGalleryModal from '../../components/chat/ImageGalleryModal';
import ImageConfirmationModal from '../../components/chat/ImageConfirmationModal';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';
import notificationService from '../../services/notificationService';
import { compressImage } from '../../utils/imageCompression';

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
  attachments?: any[];
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
  const [uploading, setUploading] = useState<boolean>(false);
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState<number>(0);
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isUploadingConfirmed, setIsUploadingConfirmed] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const previousMessageCountRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isAtBottomRef = useRef<boolean>(true);
  const contentHeightRef = useRef<number>(0);
  const scrollViewHeightRef = useRef<number>(0);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      title: chatTitle,
    });
  }, [chatTitle]);

  // Only poll when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Initial fetch when screen comes into focus
      fetchMessages();

      // Optimized polling: check for new messages first, then fetch only if needed
      const interval = setInterval(async () => {
        await checkForNewMessages();
      }, 3000); // Check every 3 seconds (lightweight, cached)

      // Cleanup: stop polling when screen loses focus
      return () => {
        clearInterval(interval);
        console.log('ChatDetailScreen: Stopped polling (screen unfocused)');
      };
    }, [chatId])
  );

  const checkForNewMessages = async () => {
    try {
      const response = await ApiService.checkNewMessages(chatId);

      if (response.success && response.data) {
        // Only fetch full messages if there are new messages
        if (response.data.has_new_messages &&
            response.data.last_message_id !== lastMessageIdRef.current) {
          await fetchMessages();
          lastMessageIdRef.current = response.data.last_message_id;
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
      // Fallback to fetching messages if check fails
      await fetchMessages();
    }
  };

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
        let messagesList = response.data.filter((msg: Message) => !msg.deleted);

        // Fetch attachments for messages with attachments
        const messagesWithAttachments = messagesList.filter(
          (msg: Message) => msg.message_type === 'attachment'
        );

        for (const msg of messagesWithAttachments) {
          try {
            const attachmentsResponse = await ApiService.getAttachments(chatId, msg.id);
            if (attachmentsResponse.success && attachmentsResponse.data?.attachments) {
              msg.attachments = attachmentsResponse.data.attachments;
              console.log(`Loaded ${msg.attachments.length} attachments for message ${msg.id}`);
            } else {
              console.warn(`No attachments found for message ${msg.id}`);
            }
          } catch (error) {
            console.error(`Error fetching attachments for message ${msg.id}:`, error);
            // Continue loading other messages even if this one fails
          }
        }

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

        // Track the last message ID for optimized polling
        if (messagesList.length > 0) {
          lastMessageIdRef.current = messagesList[messagesList.length - 1].id;
        }

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

  const handleAttachmentPress = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web: Show file input for images only
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Images only
        input.multiple = true; // Allow multiple files
        input.onchange = async (event: any) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            const fileArray = Array.from(files) as File[];
            showConfirmationModal(fileArray);
          }
        };
        input.click();
      } else {
        // Mobile: Request permissions and show gallery
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.IMAGES, // Images only
            allowsEditing: false,
            quality: 0.8,
            allowsMultiple: true, // Allow multiple selection
          });

          if (!result.canceled && result.assets.length > 0) {
            showConfirmationModal(result.assets);
          }
        } else {
          Alert.alert('Permission Required', 'Please allow access to your media library to share files.');
        }
      }
    } catch (error) {
      console.error('Error picking attachment:', error);
      Alert.alert('Error', 'Failed to pick attachment');
    }
  };

  const showConfirmationModal = (filesOrAssets: any[]) => {
    // Convert assets to confirmation format
    const confirmationImages = filesOrAssets.map((item) => ({
      uri: Platform.OS === 'web' ? URL.createObjectURL(item) : item.uri,
      filename: item.name || item.filename || `image_${Date.now()}.jpg`,
      size: item.size,
      original: item, // Keep original for upload
    }));

    setSelectedImages(confirmationImages);
    setConfirmationVisible(true);
  };

  const handleConfirmUpload = async () => {
    if (selectedImages.length === 0) return;

    try {
      setIsUploadingConfirmed(true);

      // Step 1: Send message first to get Firebase message_id
      const messageResponse = await ApiService.sendMessage(chatId, {
        message_text: `Sharing ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''}`,
        message_type: 'attachment',
      });

      if (!messageResponse.success || !messageResponse.data?.message_id) {
        Alert.alert('Error', 'Failed to create message');
        return;
      }

      const firebaseMessageId = messageResponse.data.message_id;
      console.log('Firebase Message ID:', firebaseMessageId);

      // Step 2: Upload attachments with the correct Firebase message_id
      await uploadAttachments(selectedImages.map((img) => img.original), firebaseMessageId);

      // Close confirmation modal
      setConfirmationVisible(false);
      setSelectedImages([]);
    } catch (error) {
      console.error('Error in confirmation upload:', error);
      Alert.alert('Error', 'Failed to process images');
    } finally {
      setIsUploadingConfirmed(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAttachments = async (filesOrAssets: any[], firebaseMessageId: string) => {
    try {
      setUploading(true);

      // Compress and prepare all files for upload
      const compressedFiles: File[] = [];

      for (const fileOrAsset of filesOrAssets) {
        try {
          // Compress the image
          const compressedFile = await compressImage(fileOrAsset);
          compressedFiles.push(compressedFile as File);
        } catch (error) {
          console.error(`Error compressing file:`, error);
          Alert.alert('Compression Error', 'Failed to process one or more images');
          setUploading(false);
          return;
        }
      }

      // Step 2: Upload to server (bulk upload) with the Firebase message_id
      const result = await ApiService.uploadAttachments(chatId, compressedFiles, firebaseMessageId);

      if (result.success) {
        const uploadedCount = result.data?.count || compressedFiles.length;
        console.log(`Successfully uploaded ${uploadedCount} image(s)`);

        // Refresh messages to show the attachments
        await fetchMessages();
        setTimeout(() => scrollToBottom(true), 200);
      } else {
        Alert.alert('Upload Failed', result.message || 'Failed to upload attachments');
      }
    } catch (error) {
      console.error('Error uploading attachments:', error);
      Alert.alert('Upload Error', 'Failed to upload attachments. Please try again.');
    } finally {
      setUploading(false);
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

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp * 1000);
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

  const openImageGallery = (attachments: any[], index: number) => {
    // Safety check: ensure we have valid attachments with URLs
    if (!attachments || attachments.length === 0) {
      Alert.alert('Error', 'No images to display');
      return;
    }

    // Filter out attachments without URLs
    const validAttachments = attachments.filter((att) => att.url);
    if (validAttachments.length === 0) {
      Alert.alert('Error', 'No valid images to display');
      return;
    }

    // Ensure index is within bounds
    const safeIndex = Math.min(Math.max(0, index), validAttachments.length - 1);
    setGalleryImages(validAttachments);
    setGalleryInitialIndex(safeIndex);
    setGalleryVisible(true);
  };

  const renderMessage = (item: Message) => {
    const isOwnMessage = item.sender_id === user?.id;
    const showSenderName = !isOwnMessage;
    // Only show images if we have attachments with valid URLs
    const validAttachments = item.attachments?.filter((att) => att && att.url) || [];
    const hasImages = validAttachments.length > 0;

    return (
      <View key={item.id} style={[styles.messageContainer, isOwnMessage && styles.messageContainerOwn]}>
        {showSenderName && (
          <Text style={styles.senderName}>{item.sender_name}</Text>
        )}
        <View style={[styles.messageBubble, isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther]}>
          {/* Message text */}
          <Text style={[styles.messageText, isOwnMessage && styles.messageTextOwn]}>
            {item.message_text}
          </Text>

          {/* Images grid */}
          {hasImages && (
            <View style={styles.imagesContainer}>
              {validAttachments.map((attachment, index) => (
                <TouchableOpacity
                  key={attachment.attachment_id || index}
                  onPress={() => openImageGallery(validAttachments, index)}
                  style={styles.imageThumbnail}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: attachment.url }}
                    style={styles.imageThumbnailImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Message footer */}
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
              <TouchableOpacity
                style={[styles.attachmentButton, uploading && styles.attachmentButtonDisabled]}
                onPress={handleAttachmentPress}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <WebSafeIcon name="Paperclip" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
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

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        visible={galleryVisible}
        images={galleryImages}
        initialIndex={galleryInitialIndex}
        onClose={() => setGalleryVisible(false)}
      />

      {/* Image Confirmation Modal */}
      <ImageConfirmationModal
        visible={confirmationVisible}
        images={selectedImages}
        loading={isUploadingConfirmed || uploading}
        onConfirm={handleConfirmUpload}
        onCancel={() => {
          setConfirmationVisible(false);
          setSelectedImages([]);
        }}
        onRemoveImage={handleRemoveImage}
      />
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
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  imageThumbnail: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  imageThumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  attachmentButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  attachmentButtonDisabled: {
    opacity: 0.5,
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
