import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Header from '../../components/common/Header';
import { theme } from '../../constants/theme';

interface WebViewScreenProps {
  navigation: any;
  route: any;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ navigation, route }) => {
  const { url, title = 'Browser' } = route.params || {};

  if (!url) {
    Alert.alert('Error', 'No URL provided', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
    return null;
  }

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const handleError = () => {
    Alert.alert(
      'Error',
      'Failed to load the page. Please check your internet connection and try again.',
      [
        { text: 'Retry', onPress: () => navigation.replace('WebView', { url, title }) },
        { text: 'Go Back', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header 
        title={title} 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={renderLoading}
          onError={handleError}
          onHttpError={handleError}
          allowsBackForwardNavigationGestures={true}
          scalesPageToFit={Platform.OS === 'android'}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' && { height: '100vh' as any, overflow: 'hidden' }),
  },
  webviewContainer: {
    flex: 1,
    ...Platform.select({
      web: { position: 'absolute', top: 70, bottom: 0, left: 0, right: 0 },
      default: { flex: 1 },
    }),
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default WebViewScreen;