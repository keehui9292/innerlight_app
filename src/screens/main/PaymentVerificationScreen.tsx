import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import CustomButton from '../../components/common/Button';
import { theme } from '../../constants/theme';
import ApiService from '../../services/apiService';

interface PaymentVerificationScreenProps {
  route?: any;
  navigation?: any;
}

const PaymentVerificationScreen: React.FC<PaymentVerificationScreenProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [verifying, setVerifying] = useState<boolean>(true);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [appointmentId, setAppointmentId] = useState<string>('');

  useEffect(() => {
    verifyPaymentFromUrl();
  }, []);

  const verifyPaymentFromUrl = async () => {
    try {
      let sessionId = '';
      let appointmentIdParam = '';

      // Get URL parameters based on platform
      if (Platform.OS === 'web') {
        // Web platform - parse from window.location
        const urlParams = new URLSearchParams(window.location.search);
        sessionId = urlParams.get('session_id') || '';
        appointmentIdParam = urlParams.get('appointment_id') || '';
      } else {
        // Mobile platform - get from route params
        const params = route.params as any;
        sessionId = params?.session_id || '';
        appointmentIdParam = params?.appointment_id || '';
      }

      console.log('Payment verification params:', { sessionId, appointmentId: appointmentIdParam });

      // Validate parameters
      if (!sessionId || !appointmentIdParam) {
        // No payment parameters - redirect to home instead of showing error
        console.log('No payment parameters found, redirecting to home');
        navigation.navigate('MainTabs' as never, {
          screen: 'Home',
        } as never);
        return;
      }

      setAppointmentId(appointmentIdParam);

      // Call API to verify payment
      const response = await ApiService.verifyPayment(sessionId, appointmentIdParam);

      console.log('Payment verification response:', response);

      if (response.success && response.data?.is_paid) {
        setPaymentSuccess(true);
        setErrorMessage('');
      } else {
        setPaymentSuccess(false);
        setErrorMessage(response.message || 'Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentSuccess(false);
      setErrorMessage('An error occurred while verifying payment. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleViewAppointment = () => {
    if (appointmentId) {
      // Navigate to appointments tab within MainTabs
      navigation.navigate('MainTabs' as never, {
        screen: 'Appointments',
      } as never);
    }
  };

  const handleBackToHome = () => {
    // Navigate to home tab within MainTabs
    navigation.navigate('MainTabs' as never, {
      screen: 'Home',
    } as never);
  };

  if (verifying) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.verifyingText}>Verifying your payment...</Text>
          <Text style={styles.verifyingSubtext}>Please wait while we confirm your transaction</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {paymentSuccess ? (
          // Success State
          <View style={styles.resultContainer}>
            <View style={[styles.iconCircle, styles.successCircle]}>
              <WebSafeIcon name="CheckCircle" size={64} color={theme.colors.success} />
            </View>

            <Text style={styles.resultTitle}>Payment Successful!</Text>
            <Text style={styles.resultMessage}>
              Your payment has been processed successfully. Your appointment has been confirmed.
            </Text>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <WebSafeIcon name="CheckCircle2" size={20} color={theme.colors.success} />
                <Text style={styles.detailText}>Payment confirmed</Text>
              </View>
              <View style={styles.detailRow}>
                <WebSafeIcon name="Calendar" size={20} color={theme.colors.success} />
                <Text style={styles.detailText}>Appointment confirmed</Text>
              </View>
              <View style={styles.detailRow}>
                <WebSafeIcon name="Mail" size={20} color={theme.colors.success} />
                <Text style={styles.detailText}>Confirmation email sent</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleViewAppointment}
                colorScheme="primary"
                fullWidth
              >
                <View style={styles.buttonContent}>
                  <WebSafeIcon name="Calendar" size={16} color={theme.colors.white} />
                  <Text style={styles.buttonText}>View My Appointments</Text>
                </View>
              </CustomButton>

              <CustomButton
                onPress={handleBackToHome}
                colorScheme="secondary"
                fullWidth
              >
                <View style={styles.buttonContent}>
                  <WebSafeIcon name="Home" size={16} color={theme.colors.primary} />
                  <Text style={styles.secondaryButtonText}>Back to Home</Text>
                </View>
              </CustomButton>
            </View>
          </View>
        ) : (
          // Error State
          <View style={styles.resultContainer}>
            <View style={[styles.iconCircle, styles.errorCircle]}>
              <WebSafeIcon name="XCircle" size={64} color={theme.colors.error} />
            </View>

            <Text style={styles.resultTitle}>Payment Verification Failed</Text>
            <Text style={styles.resultMessage}>
              {errorMessage || 'We could not verify your payment. Please contact support if you believe this is an error.'}
            </Text>

            <View style={[styles.detailsCard, styles.errorCard]}>
              <View style={styles.detailRow}>
                <WebSafeIcon name="AlertCircle" size={20} color={theme.colors.error} />
                <Text style={styles.detailText}>Payment not confirmed</Text>
              </View>
              {appointmentId && (
                <View style={styles.detailRow}>
                  <WebSafeIcon name="FileText" size={20} color={theme.colors.text.secondary} />
                  <Text style={styles.detailText}>Appointment ID: {appointmentId.substring(0, 8)}...</Text>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleViewAppointment}
                colorScheme="primary"
                fullWidth
              >
                <View style={styles.buttonContent}>
                  <WebSafeIcon name="Calendar" size={16} color={theme.colors.white} />
                  <Text style={styles.buttonText}>View Appointment</Text>
                </View>
              </CustomButton>

              <CustomButton
                onPress={handleBackToHome}
                colorScheme="secondary"
                fullWidth
              >
                <View style={styles.buttonContent}>
                  <WebSafeIcon name="Home" size={16} color={theme.colors.primary} />
                  <Text style={styles.secondaryButtonText}>Back to Home</Text>
                </View>
              </CustomButton>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  verifyingText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  verifyingSubtext: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successCircle: {
    backgroundColor: theme.colors.primaryGhost,
  },
  errorCircle: {
    backgroundColor: '#fef2f0',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  resultMessage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  detailsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    ...theme.shadows.elegant,
  },
  errorCard: {
    borderColor: theme.colors.error + '20',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  detailText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.regular,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  buttonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.white,
  },
  secondaryButtonText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
});

export default PaymentVerificationScreen;
