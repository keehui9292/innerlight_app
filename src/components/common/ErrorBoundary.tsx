import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_CONFIG } from '../../constants/config';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry for the inconvenience. Please restart the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: APP_CONFIG.theme.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: APP_CONFIG.theme.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: APP_CONFIG.theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ErrorBoundary;