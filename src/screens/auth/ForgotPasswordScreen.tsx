import React, { useState } from 'react';
import { Platform, Alert, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import CustomButton from '../../components/common/Button';
import { StackScreenProps } from '../../types';
import { theme } from '../../constants/theme';

interface FormErrors {
  email?: string;
}

interface FormData {
  email: string;
}

const ForgotPasswordScreen: React.FC<StackScreenProps<'ForgotPassword'>> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { forgotPassword, loading } = useAuth();

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (): Promise<void> => {
    const isValid = validateForm();
    setIsFormValid(isValid);
    
    if (!isValid) return;

    const result = await forgotPassword(formData.email);
    
    if (result.success) {
      setEmailSent(true);
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Error', result.message);
    }
    
    setIsFormValid(false);
  };

  const handleBackToLogin = (): void => {
    navigation.navigate('Login');
  };

  const handleGoBack = (): void => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading Overlay */}
      {loading && isFormValid && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Sending reset link...</Text>
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
              <ArrowLeft size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reset Password</Text>
            <View style={styles.placeholder} />
          </View>

          {!emailSent && (
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Forgot Password?</Text>
              <Text style={styles.welcomeSubtitle}>No worries! Enter your email address and we'll send you a link to reset your password.</Text>
            </View>
          )}

          {!emailSent ? (
            // Form Section
            <View style={styles.formSection}>
              <FormInput
                label=""
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Send Reset Link"
                  onPress={handleForgotPassword}
                  loading={loading}
                  disabled={loading}
                  size="lg"
                  colorScheme="primary"
                />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Remember your password? 
                </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text style={styles.linkText}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Success Section
            <View style={styles.successSection}>
              <View style={styles.successContainer}>
                <View style={styles.iconContainer}>
                  <CheckCircle size={40} color={theme.colors.success} />
                </View>
                
                <View style={styles.successContent}>
                  <Text style={styles.successTitle}>
                    Check Your Email
                  </Text>
                  <Text style={styles.successText}>
                    We've sent a password reset link to{'\n'}
                    <Text style={styles.emailText}>{formData.email}</Text>
                  </Text>
                  <Text style={styles.helpText}>
                    Didn't receive the email? Check your spam folder or try again.
                  </Text>
                </View>

                <View style={styles.successButtonContainer}>
                  <CustomButton
                    title="Back to Login"
                    onPress={handleBackToLogin}
                    size="lg"
                    colorScheme="primary"
                  />
                  
                  <View style={styles.buttonSpacing} />
                  
                  <CustomButton
                    title="Resend Email"
                    onPress={() => setEmailSent(false)}
                    size="lg"
                    colorScheme="secondary"
                  />
                </View>
              </View>
            </View>
          )}
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
    marginBottom: theme.spacing.lg,
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
  welcomeSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.sm,
  },
  formSection: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  successSection: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  linkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  successContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f9f5',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  successContent: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  successText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: theme.typography.weights.medium,
  },
  helpText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  successButtonContainer: {
    width: '100%',
  },
  buttonSpacing: {
    height: theme.spacing.md,
  },
});

export default ForgotPasswordScreen;