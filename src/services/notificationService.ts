import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app, VAPID_KEY } from '../config/firebase';

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private messaging: any = null;

  constructor() {
    if (Platform.OS === 'web') {
      try {
        this.messaging = getMessaging(app);
      } catch (error) {
        console.error('Error initializing Firebase messaging:', error);
      }
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web: Use browser's Notification API
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return false;
        }

        const permission = await Notification.requestPermission();
        console.log('Web notification permission:', permission);

        if (permission === 'granted') {
          // Get FCM token for web
          if (this.messaging && VAPID_KEY && VAPID_KEY !== 'YOUR_VAPID_KEY_HERE') {
            try {
              const token = await getToken(this.messaging, {
                vapidKey: VAPID_KEY,
              });
              console.log('FCM Token:', token);
              // TODO: Send this token to your backend
              return true;
            } catch (error) {
              console.error('Error getting FCM token:', error);
              console.error('Make sure you have added the VAPID key in src/config/firebase.ts');
            }
          } else if (VAPID_KEY === 'YOUR_VAPID_KEY_HERE') {
            console.warn('VAPID key not configured. Please add your VAPID key in src/config/firebase.ts');
          }
          return true;
        }
        return false;
      } else {
        // Mobile: Use expo-notifications
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return false;
        }

        // Get push notification token
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
        // TODO: Send this token to your backend

        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Check if notifications are enabled
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return Notification.permission === 'granted';
      } else {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
      }
    } catch (error) {
      console.error('Error checking notification status:', error);
      return false;
    }
  }

  // Show a local notification
  async showNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web: Use browser's Notification API
        if (Notification.permission === 'granted') {
          const notification = new Notification(title, {
            body,
            icon: '/icon.png', // Update with your app icon path
            badge: '/icon.png',
            data,
            tag: data?.chatId || 'default', // Prevents duplicate notifications
          });

          // Handle notification click
          notification.onclick = () => {
            window.focus();
            notification.close();

            // Handle navigation based on notification data
            if (data?.chatId) {
              // Navigate to chat - you'll need to implement this
              console.log('Navigate to chat:', data.chatId);
            }
          };
        }
      } else {
        // Mobile: Use expo-notifications
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: true,
          },
          trigger: null, // Show immediately
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Listen for foreground messages on web
  listenForMessages(callback: (payload: any) => void): (() => void) | null {
    if (Platform.OS === 'web' && this.messaging) {
      // Firebase Cloud Messaging for web
      const unsubscribe = onMessage(this.messaging, (payload) => {
        console.log('Foreground message received:', payload);

        // Show notification
        if (payload.notification) {
          this.showNotification(
            payload.notification.title || 'New Message',
            payload.notification.body || '',
            payload.data
          );
        }

        callback(payload);
      });

      return unsubscribe;
    } else {
      // Mobile: Use expo-notifications
      const subscription = Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
        callback(notification);
      });

      return () => subscription.remove();
    }
  }

  // Listen for notification responses (when user taps notification)
  listenForNotificationResponse(callback: (response: any) => void): () => void {
    if (Platform.OS === 'web') {
      // Web notifications handle clicks in showNotification()
      return () => {};
    } else {
      const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response:', response);
        callback(response);
      });

      return () => subscription.remove();
    }
  }
}

export default new NotificationService();
