import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { APP_CONFIG } from '../../constants/config';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={APP_CONFIG.theme.primary} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_CONFIG.theme.background,
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    color: APP_CONFIG.theme.textSecondary,
  },
});

export default LoadingScreen;