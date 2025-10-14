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
  email: string;
  currentPassword: string;
}

interface FormErrors {
  email?: string;
  currentPassword?: string;
}

const RequestOTPScreen: React.FC<StackScreenProps<'RequestOTP'>> = ({ navigation, route }) => {
  const email = route.params?.email || '';

  const [formData, setFormData] = useState<FormData>({
    email: email,
    currentPassword: ''
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.post('/auth/request-otp', {
        email: formData.email,
        current_password: formData.currentPassword
      });

      if (response.success) {
        Alert.alert(
          'OTP Sent',
          `A verification code has been sent to ${formData.email}. Please check your email.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('VerifyOTP', {
                email: formData.email
              })
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP. Please check your credentials and try again.');
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
            <Text style={styles.loadingText}>Sending OTP...</Text>
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
            <Text style={styles.headerTitle}>Password Change Required</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.iconContainer}>
              <WebSafeIcon name="Lock" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.infoTitle}>Change Your Password</Text>
            <Text style={styles.infoSubtitle}>
              For security reasons, you need to change your default password.
              We'll send a verification code to your email to proceed.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <FormInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!email}
              required
            />

            <FormInput
              label="Current Password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              onChangeText={(value) => handleInputChange('currentPassword', value)}
              error={errors.currentPassword}
              secureTextEntry
              required
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Request Verification Code"
                onPress={handleRequestOTP}
                loading={loading}
                disabled={loading}
                size="lg"
                colorScheme="primary"
              />
            </View>
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
  formSection: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
});

export default RequestOTPScreen;
