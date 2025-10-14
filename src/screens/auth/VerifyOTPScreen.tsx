import React, { useState } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebSafeIcon from '../../components/common/WebSafeIcon';
import FormInput from '../../components/common/FormInput';
import CustomButton from '../../components/common/Button';
import { StackScreenProps } from '../../types';
import { theme } from '../../constants/theme';
import apiService from '../../services/apiService';

interface FormData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const VerifyOTPScreen: React.FC<StackScreenProps<'VerifyOTP'>> = ({ navigation, route }) => {
  const email = route.params?.email || '';

  const [formData, setFormData] = useState<FormData>({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyAndChangePassword = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.post('/auth/verify-otp-change-password', {
        email: email,
        otp: formData.otp,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword
      });

      if (response.success) {
        Alert.alert(
          'Success',
          'Your password has been changed successfully. Please login with your new password.',
          [
            {
              text: 'OK',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to change password. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = (): void => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Updating password...</Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <WebSafeIcon name="ArrowLeft" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify & Change Password</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.iconContainer}>
              <WebSafeIcon name="Shield" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.infoTitle}>Enter Verification Code</Text>
            <Text style={styles.infoSubtitle}>
              We've sent a 6-digit verification code to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <FormInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={formData.otp}
              onChangeText={(value) => handleInputChange('otp', value)}
              error={errors.otp}
              keyboardType="number-pad"
              maxLength={6}
              required
            />

            <FormInput
              label="New Password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChangeText={(value) => handleInputChange('newPassword', value)}
              error={errors.newPassword}
              secureTextEntry
              required
            />

            <FormInput
              label="Confirm Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              error={errors.confirmPassword}
              secureTextEntry
              required
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Change Password"
                onPress={handleVerifyAndChangePassword}
                loading={loading}
                disabled={loading}
                size="lg"
                colorScheme="primary"
              />
            </View>

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.resendText}>
                Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContent: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadows.medium,
  },
  loadingText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
    fontWeight: theme.typography.weights.medium,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.3,
  },
  infoSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.md,
  },
  emailText: {
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  formSection: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  resendContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  resendText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  resendLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});

export default VerifyOTPScreen;
