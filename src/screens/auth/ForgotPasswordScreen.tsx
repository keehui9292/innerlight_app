import React, { useState } from 'react';
import { Platform, Alert, StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
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

const ForgotPasswordScreen: React.FC<StackScreenProps<'ForgotPassword'>> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const { forgotPassword, loading } = useAuth();

  const handleEmailChange = (value: string): void => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const validateEmail = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!validateEmail()) return;

    const result = await forgotPassword(email);
    
    if (result.success) {
      setEmailSent(true);
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleBackToLogin = (): void => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                Reset Password
              </Text>
            </View>

            {!emailSent ? (
              // Email input form
              <View style={styles.formContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    Forgot Password?
                  </Text>
                  <Text style={styles.subtitle}>
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </Text>
                </View>

                <View style={styles.form}>
                  <FormInput
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={handleEmailChange}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    required
                  />

                  <CustomButton
                    title="Send Reset Link"
                    onPress={handleForgotPassword}
                    loading={loading}
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
              // Success state
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
                    <Text style={styles.emailText}>{email}</Text>
                  </Text>
                  <Text style={styles.helpText}>
                    Didn't receive the email? Check your spam folder or try again.
                  </Text>
                </View>

                <View style={styles.buttonContainer}>
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
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  formContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  linkText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
    marginLeft: theme.spacing.xs,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
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
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  successText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
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
  buttonContainer: {
    width: '100%',
  },
  buttonSpacing: {
    height: theme.spacing.md,
  },
});

export default ForgotPasswordScreen;