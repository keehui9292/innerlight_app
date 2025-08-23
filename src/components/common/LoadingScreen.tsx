import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
    letterSpacing: -0.2,
  },
});

export default LoadingScreen;