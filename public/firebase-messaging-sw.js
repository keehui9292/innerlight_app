// Firebase Cloud Messaging Service Worker
// This file handles background push notifications for the web app

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDtzDlumtiP_BoobI4v7x6qpFF9tHdKZf4",
  authDomain: "innerlight-193e2.firebaseapp.com",
  projectId: "innerlight-193e2",
  storageBucket: "innerlight-193e2.firebasestorage.app",
  messagingSenderId: "621600392235",
  appId: "1:621600392235:web:4a5975277102fc49dd966e",
  measurementId: "G-KSDTSM69XV"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/icon.png',
    badge: '/icon.png',
    data: payload.data,
    tag: payload.data?.chatId || 'default',
    requireInteraction: true,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  // Open or focus the app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const chatId = event.notification.data?.chatId;
      const url = chatId ? `/?chatId=${chatId}` : '/';

      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then((client) => {
            // Navigate to the chat if chatId is present
            if (chatId && client.navigate) {
              return client.navigate(url);
            }
            return client;
          });
        }
      }

      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
